import { PrismaClient } from "@prisma/client"
import express, { Router, Request, Response, NextFunction } from "express"


const router: Router = express.Router()
const prisma = new PrismaClient()

interface QuizProgressParams {
    id: string
}

interface QuizProgressCreate {
    isStarred?: boolean
    isKnown?: boolean
    userId: number
    quizId: number
    flashcardId: number
}

interface QuizProgressUpdate {
    isStarred: boolean
    isKnown: boolean
    userId: number
    quizId: number
    flashcardId: number
}

router.get("/:id(\\d+)", async (req: Request<QuizProgressParams>, res: Response, next: NextFunction) => {
    try {
        const quizProgressId: number = parseInt(req.params.id)
        const quizProgress = await prisma.userQuizProgress.findUnique({
            where: {
                id: quizProgressId
            }
        })

        if (quizProgress) {
            return res.json(quizProgress)
        }
        else{
            return res.sendStatus(404)
        }
    }
    catch (error) {
        next(error)
    }
})

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const createdQuizProgress = await prisma.userQuizProgress.create({
            data: req.body as QuizProgressCreate,
        })

        return res.status(201).json(createdQuizProgress)
    }
    catch (error) {
        next(error)
    }
})

router.patch("/:id(\\d+)", async (req: Request<QuizProgressParams>, res: Response, next: NextFunction) => {
    try {
        const quizProgressId: number = parseInt(req.params.id)
        const updatedQuizProgressData = req.body as QuizProgressUpdate

        const updatedQuizProgress = await prisma.userQuizProgress.update({
            where: {
                id: quizProgressId,
            },
            data: updatedQuizProgressData
        })

        return res.status(200).json(updatedQuizProgress)
    }
    catch (error) {
        next(error)
    }
})

router.delete("/:id((\\d+)", async (req: Request<QuizProgressParams>, res: Response, next: NextFunction) => {
    try {
        await prisma.userQuizProgress.delete({
            where: {
                id: parseInt(req.params.id),
            }
        })

        return res.sendStatus(200)
    }
    catch (error) {
        next(error)
    }
})

export default router