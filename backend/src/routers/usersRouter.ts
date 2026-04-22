import { PrismaClient } from "@prisma/client"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import express, { Router, Request, Response, NextFunction } from "express"
import bcrypt from "bcrypt"
import fs from 'fs/promises'

const router: Router = express.Router()
const prisma = new PrismaClient()

interface UserParams {
    id: string
    password: string
}

interface UserCreate {
    name: string
    email: string
    password: string
    path_to_img?: string
}

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.query.userId ? parseInt(req.query.userId as string): undefined
        if (!userId)
        {
            return res.sendStatus(400)
        }
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                name: true,
                path_to_img: true
            },
        })

        if (user) {
            let imageBase64 = null

            if (user.path_to_img) {
                const imageBuffer = await fs.readFile(user.path_to_img)
                imageBase64 = imageBuffer.toString('base64')
            }

            return res.json({
                name: user.name,
                image: imageBase64 ? `data:image/jpeg;base64,${imageBase64}` : null
            })
        }
        else {
            return res.sendStatus(404)
        }
    }
    catch(error) {
        next(error)
    }
})

router.get("/:id(\\d+)", async (req: Request<UserParams>, res: Response, next: NextFunction) => {
    try {
        const userId: number = parseInt(req.params.id)
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                path_to_img: true
            },
        })

        if (user) {
            return res.json(user)
        }
        else {
            return res.sendStatus(404)
        }
    }
    catch(error) {
        next(error)
    }
})

router.get("/:id(\\d+)/created-quizzes", async (req: Request<UserParams>, res: Response, next: NextFunction) => {
    try {
        const userId: number = parseInt(req.params.id)
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                createdQuizzes: true
            },
        })

        if (user) {
            return res.json(user.createdQuizzes)
        }
        else {
            return res.sendStatus(404)
        }
    }
    catch(error) {
        next(error)
    }
})

router.get("/:id(\\d+)/saved-quizzes", async (req: Request<UserParams>, res: Response, next: NextFunction) => {
    try {
        const userId: number = parseInt(req.params.id)
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                SavedQuiz: {
                    include: {
                        quiz: true,
                    }
                }
            },
        })

        if (user) {
            return res.json(user.SavedQuiz)
        }
        else {
            return res.sendStatus(404)
        }
    }
    catch(error) {
        next(error)
    }
})

router.get("/:id(\\d+)/folders", async (req: Request<UserParams>, res: Response, next: NextFunction) => {
    try {
        const userId: number = parseInt(req.params.id)
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                Folder: {
                    include: {
                        SavedQuiz: true,
                    }
                }
            },
        })

        if (user) {
            return res.json(user.Folder)
        }
        else {
            return res.sendStatus(404)
        }
    }
    catch(error) {
        next(error)
    }
})

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { password, ...rest } = req.body

        if (!password) {
            return res.status(400).json({
                error: "Hasło jest wymagane"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUserData: UserCreate = {
            ...rest,
            password: hashedPassword
        }

        const createdUser = await prisma.user.create({
            data: newUserData,
            select: {
                id: true,
                name: true,
                email: true,
                path_to_img: true,
            },
        })

        return res.status(201).json({createdUser})
    }
    catch(error) {
        if (
            error instanceof PrismaClientKnownRequestError &&
            error.code === "P2002"
        ) {
            const field = (error.meta?.target as string[] | undefined)?.[0]

            if (field === "name") {
                return res.status(409).json({
                    error: "Podana nazwa użytkownika jest zajęta"
                })
            }
            else if (field === "email") {
                return res.status(409).json({
                    error: "Istnieje już konto z podanym adresem email"
                })
            }
            else {
                return next(error)
            }
        }
        else {
            return next(error)
        }
    }
})

router.post("/auth/login", async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.body.email || !req.body.password) {
            return res.sendStatus(400)
        }

        const user = await prisma.user.findUnique({
            where: {
                email: req.body.email
            }
        })

        if (!user) {
            return res.sendStatus(401)
        }

        const isValid: boolean = await bcrypt.compare(req.body.password, user.password)

        if (!isValid) {
            return res.sendStatus(401)
        }

        return res.sendStatus(200)
    }
    catch(error) {
        next(error)
    }
})

router.delete("/:id(\\d+)", async (req: Request<UserParams>, res: Response, next: NextFunction) => {
    try {
        await prisma.user.delete({
            where: {
                id: parseInt(req.params.id)
            }
        })

        return res.sendStatus(200)
    }
    catch(error) {
        next(error)
    }
})

export default router