import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'
import usersRouter from "./routers/usersRouter"
import foldersRouter from "./routers/foldersRouter"
import flashcardsRouter from "./routers/flashcardsRouter"
import quizzesRouter from "./routers/quizzesRouter"
import quizzesProgressRouter from "./routers/quizzesProgressRouter"
import savedQuizzesRouter from "./routers/savedQuizzesRouter"
import tasksGenerationRouter from "./routers/tasksGenerationRouter"
import quizzesLikesRouter from "./routers/quizzesLikesRouter"
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library'
import { MongoClient, Collection } from "mongodb"

const myenv = dotenv.config({ path: '.env.app' })
dotenvExpand.expand(myenv)

const app = express()

// const frontend_origin = (process.env.FRONTEND_ORIGIN || 'http://localhost:5173').trim()

app.use(cors())
app.use(express.json())

const mongoURL: string | undefined = process.env.MONGODB_URL
let errorsCollection: Collection
let requestsCollection: Collection
let connectedMongo: boolean = false

// Creating connection with MongoDB
;(async () => {
    if (!mongoURL) {
        console.warn(`MongoDB URL is missing`)
        return
    }

    try {
        const mongoClient = new MongoClient(mongoURL)
        await mongoClient.connect();
        const mongoDb = mongoClient.db("flashcards-app")
        errorsCollection = mongoDb.collection("errorLogs")
        requestsCollection = mongoDb.collection("requestLogs")
        console.log("Connected to flashcards-app in MongoDB")
        connectedMongo = true
    }
    catch (error) {
        console.error("Could not connect to flashcards-app in MongoDB: ", error)
    }
})()

app.use(async (req: Request, _res: Response, next: NextFunction) => {
    try {
        if (connectedMongo) {
            const log = {
                timestamp: new Date(),
                method: req.method,
                url: req.url,
                query: req.query,
                body: req.body
            }

            await requestsCollection.insertOne(log)
        }

        next()
    }
    catch (error) {
        next(error)
    }
})

app.use((req: Request, _res: Response, next: NextFunction) => {
    const now = new Date()
    let logMessage: string = `Request at ${now.toLocaleDateString()} ${now.toLocaleTimeString()} - ${req.method} ${req.url}`

    if (Object.keys(req.query).length > 0 && Object.keys(req.body).length > 0) {
        logMessage += ` with a query: ${JSON.stringify(req.query)} and a body ${JSON.stringify(req.body)}`
    }
    else if (Object.keys(req.query).length > 0) {
        logMessage += ` with a query: ${JSON.stringify(req.query)}`
    }
    else if (Object.keys(req.body).length > 0) {
        logMessage += ` with a body: ${JSON.stringify(req.body)}`
    }

    console.log(logMessage)
    next()
})

app.use("/users", usersRouter)
app.use("/folders", foldersRouter)
app.use("/saved-quizzes", savedQuizzesRouter)
app.use("/flashcards", flashcardsRouter)
app.use("/quizzes", quizzesRouter)
app.use("/quizzes-progress", quizzesProgressRouter)
app.use("/quizzes-likes", quizzesLikesRouter)
app.use("/api/tasks/generation", tasksGenerationRouter)

app.get('/', (_req: Request, res: Response) => {
    res.status(200).json({content: "Hello world!"})
})

app.all("*", (_req: Request, res: Response) => {
    res.sendStatus(404)
})

app.use(async (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    const errorMessage: string = err instanceof Error ? err.message : "Unknown error"
    const errorCode: string = typeof err === "object" && err !== null && "code" in err ? String(err.code) : "Unknown code"

    if (connectedMongo) {
        try {
            await errorsCollection.insertOne({
                timestamp: new Date(),
                code: errorCode,
                message: errorMessage
            })
        }
        catch (error2 : unknown) {
            const mongoErrorMessage: string = error2 instanceof Error ? error2.message : "Unknown error"
            const mongoErrorCode: string = typeof error2 === "object" && error2 !== null && "code" in error2 ? String(error2.code) : "Unknown code"
            console.error(`MongoDB error: ${mongoErrorCode} - ${mongoErrorMessage}`)
        }
    }

    console.error(`App error: ${errorCode} - ${errorMessage}`)

    if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P2025"){
            return res.sendStatus(404)
        }
        else if (err.code === "P2002"){
            const field = (err.meta?.target as string[] | undefined)?.[0]
            const message: string = field ? `${field} jest już zajęte` : "Wartość musi być unikalna"
            return res.status(409).json({
                error: message
            })
        }
    }

    if (err instanceof PrismaClientValidationError) {
        return res.sendStatus(400)
    }

    if (err.message === "Missing GITHUB_TOKEN in .env.app file") {
        return res.status(500).json({
            error: "Nie skonfigurowano tokena GitHub wymaganego do korzystania z modeli AI"
        })
    }
    else if (err.message === "All models failed or returned empty responses") {
        return res.status(503).json({
            error: "Wszystkie modele AI są chwilowo niedostępne lub osiągnęły limity. Spróbuj ponownie za około minutę"
        })
    }
    else if (err.message === "Flashcards not found") {
        return res.sendStatus(404)
    }

    else if (err.message === "Not enough flashcards found") {
        return res.sendStatus(422)
    }

    return res.sendStatus(500)
})

app.listen(3000, () => {
    console.log('App is running on http://localhost:3000')
})
