import { PrismaClient } from "@prisma/client"
import express, { Router, Request, Response, NextFunction } from "express"


const router: Router = express.Router()
const prisma = new PrismaClient()

interface QuizParams {
    id: string
}

interface QuizCreate {
    name: string
    description?: string
    authorId: number
}

interface QuizUpdate {
    name: string
    description?: string
}

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const quizzes = await prisma.quiz.findMany({})
        return res.json(quizzes)
    }
    catch (error) {
        next(error)
    }
})

router.get("/:id(\\d+)", async (req: Request<QuizParams>, res: Response, next: NextFunction) => {
    try {
        const quizId = parseInt(req.params.id)
        const quiz = await prisma.quiz.findUnique({
            where: {
                id: quizId,
            }
        })

        if (quiz) {
            return res.json(quiz)
        }
        else {
            return res.sendStatus(404)
        }
    }
    catch (error) {
        next(error)
    }
})

router.get("/:id(\\d+)/flashcards", async (req: Request<QuizParams>, res: Response, next: NextFunction) => {
    try {
        const quizId = parseInt(req.params.id)
        const quiz = await prisma.quiz.findUnique({
            where: {
                id: quizId,
            },
            include: {
                flashcards: {
                    include: {
                        UserQuizProgress: true
                    }
                }
            }
        })

        if (quiz) {
            return res.json(quiz.flashcards)
        }
        else {
            return res.sendStatus(404)
        }
    }
    catch (error) {
        next(error)
    }
})

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const createdQuiz = await prisma.quiz.create({
            data: req.body as QuizCreate,
        })
        return res.status(201).json(createdQuiz)
    }
    catch (error) {
        next(error)
    }
})

router.patch("/:id(\\d+)", async (req: Request<QuizParams>, res: Response, next: NextFunction) => {
    try {
        const quizId: number = parseInt(req.params.id)
        const updatedQuizData = req.body as QuizUpdate

        const updatedQuiz = await prisma.quiz.update({
            where: {
                id: quizId
            },
            data: updatedQuizData
        })

        return res.json(updatedQuiz)
    }
    catch (error) {
        next(error)
    }
})

router.delete("/:id(\\d+)", async (req: Request<QuizParams>, res: Response, next: NextFunction) => {
    try {
        await prisma.quiz.delete({
            where: {
                id: parseInt(req.params.id)
            }
        })

        return res.sendStatus(200)
    }
    catch (error) {
        next(error)
    }
})

export default router