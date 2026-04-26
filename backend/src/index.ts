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
import tasksGenerationRouter from './routers/tasksGenerationRouter'
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library'

const myenv = dotenv.config({ path: '.env.app' })
dotenvExpand.expand(myenv)

const app = express()

// const frontend_origin = (process.env.FRONTEND_ORIGIN || 'http://localhost:5173').trim()

app.use(cors())
app.use(express.json())

app.use("/users", usersRouter)
app.use("/folders", foldersRouter)
app.use("/saved-quizzes", savedQuizzesRouter)
app.use("/flashcards", flashcardsRouter)
app.use("/quizzes", quizzesRouter)
app.use("/quizzes-progress", quizzesProgressRouter)
app.use("/api/tasks/generation", tasksGenerationRouter)

app.get('/', (_req: Request, res: Response) => {
    res.status(200).json({content: "Hello world!"})
})

app.all("*", (_req: Request, res: Response) => {
    res.sendStatus(404)
})

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
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
