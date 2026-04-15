import { PrismaClient } from "@prisma/client"
import express, { Router, Request, Response, NextFunction } from "express"


const router: Router = express.Router()
const prisma = new PrismaClient()

interface FlashcardParams {
    id: string
}

interface FlashcardCreate {
    language1: string
    language2: string
    side1: string
    side2: string
    quizId: number
}

interface FlashcardUpdate {
    language1: string
    language2: string
    side1: string
    side2: string
}

router.get("/:id(\\d+)", async (req: Request<FlashcardParams>, res: Response, next: NextFunction) => {
    try {
        const flashcardId: number = parseInt(req.params.id)
        const flashcard = await prisma.flashcard.findUnique({
            where: {
                id: flashcardId
            },
            include: {
                UserQuizProgress: true
            }
        })

        if (flashcard) {
            return res.json(flashcard)
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
        const createdFlashcard = await prisma.flashcard.create({
            data: req.body as FlashcardCreate,
            include: {
                UserQuizProgress: true
            }
        })

        return res.status(201).json(createdFlashcard)
    }
    catch (error) {
        next(error)
    }
})

router.patch("/:id(\\d+)", async (req: Request<FlashcardParams>, res: Response, next: NextFunction) => {
    try {
        const flashcardId: number = parseInt(req.params.id)
        const updatedFlashcardData = req.body as FlashcardUpdate

        const updatedFlashcard = await prisma.flashcard.update({
            where: {
                id: flashcardId,
            },
            data: updatedFlashcardData,
            include: {
                UserQuizProgress: true
            }
        })

        return res.status(200).json(updatedFlashcard)
    }
    catch (error) {
        next(error)
    }
})

router.delete("/:id(\\d+)", async (req: Request<FlashcardParams>, res: Response, next: NextFunction) => {
    try {
        await prisma.flashcard.delete({
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