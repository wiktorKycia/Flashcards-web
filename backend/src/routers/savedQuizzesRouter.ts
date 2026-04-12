import { PrismaClient } from "@prisma/client"
import express, { Router, Request, Response, NextFunction } from "express"


const router: Router = express.Router()
const prisma = new PrismaClient()

interface SavedQuizParams {
    id: string
}

interface SavedQuizCreateAndUpdate {
    userId: number
    quizId: number
    folderId?: number
}

router.get("/:id(\\d+)", async (req: Request<SavedQuizParams>, res: Response, next: NextFunction) => {
    try {
        const savedQuizId: number = parseInt(req.params.id)
        const savedQuiz = await prisma.savedQuiz.findUnique({
            where: {
                id: savedQuizId
            }
        })

        if (savedQuiz) {
            return res.json(savedQuiz)
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
        const createdSavedQuiz = await prisma.savedQuiz.create({
            data: req.body as SavedQuizCreateAndUpdate,
        })

        return res.status(201).json(createdSavedQuiz)
    }
    catch (error) {
        next(error)
    }
})

router.patch("/:id(\\d+)", async (req: Request<SavedQuizParams>, res: Response, next: NextFunction) => {
    try {
        const savedQuizId: number = parseInt(req.params.id)
        const updatedSavedQuizData = req.body as SavedQuizCreateAndUpdate

        const updatedSavedQuiz = await prisma.savedQuiz.update({
            where: {
                id: savedQuizId,
            },
            data: updatedSavedQuizData
        })

        return res.status(200).json(updatedSavedQuiz)
    }
    catch (error) {
        next(error)
    }
})

router.delete("/:id((\\d+)", async (req: Request<SavedQuizParams>, res: Response, next: NextFunction) => {
    try {
        await prisma.savedQuiz.delete({
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