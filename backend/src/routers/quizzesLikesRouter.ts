import { PrismaClient } from "@prisma/client"
import express, { Router, Request, Response, NextFunction } from "express"


const router: Router = express.Router()
const prisma = new PrismaClient()

interface QuizLikeParams {
    id: string
}

interface QuizLikeCreateAndUpdate {
    isLiked: boolean
    userId: number
    quizId: number
}

router.get("/:id(\\d+)", async (req: Request<QuizLikeParams>, res: Response, next: NextFunction) => {
    try {
        const quizLikeId: number = parseInt(req.params.id)
        const quizLike = await prisma.userQuizLike.findUnique({
            where: {
                id: quizLikeId
            }
        })

        if (quizLike) {
            return res.json(quizLike)
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
        const createdQuizLike = await prisma.userQuizLike.create({
            data: req.body as QuizLikeCreateAndUpdate,
        })

        return res.status(201).json(createdQuizLike)
    }
    catch (error) {
        next(error)
    }
})

router.patch("/:id(\\d+)", async (req: Request<QuizLikeParams>, res: Response, next: NextFunction) => {
    try {
        const quizLikeId: number = parseInt(req.params.id)
        const updatedQuizLikeData = req.body as QuizLikeCreateAndUpdate

        const updatedQuizLike = await prisma.userQuizLike.update({
            where: {
                id: quizLikeId,
            },
            data: updatedQuizLikeData
        })

        return res.status(200).json(updatedQuizLike)
    }
    catch (error) {
        next(error)
    }
})

router.delete("/:id(\\d+)", async (req: Request<QuizLikeParams>, res: Response, next: NextFunction) => {
    try {
        await prisma.userQuizLike.delete({
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