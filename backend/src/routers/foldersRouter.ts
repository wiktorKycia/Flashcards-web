import { PrismaClient } from "@prisma/client"
import express, { Router, Request, Response, NextFunction } from "express"


const router: Router = express.Router()
const prisma = new PrismaClient()

interface FolderParams {
    id: string
}

interface FolderCreate {
    name: string
    userId: number
}

router.get("/:id(\\d+)", async (req: Request<FolderParams>, res: Response, next: NextFunction) => {
    try {
        const folderId: number = parseInt(req.params.id)
        const folder = await prisma.folder.findUnique({
            where: {
                id: folderId
            },
            include: {
                user: true,
                SavedQuiz: true,
            },
        })

        if(folder){
            return res.json(folder)
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
        const createdFolder = await prisma.folder.create({
            data: req.body as FolderCreate
        })
        return res.status(201).json(createdFolder)
    }
    catch (error) {
        next(error)
    }
})

router.patch("/:id(\\d+)", async (req: Request<FolderParams>, res: Response, next: NextFunction) => {
    try {
        const folderId: number = parseInt(req.params.id)
        const updatedFolderData = req.body

        const updatedFolder = await prisma.folder.update({
            where: {
                id: folderId
            },
            data: updatedFolderData
        })

        return res.status(200).json(updatedFolder)
    }
    catch (error) {
        next(error)
    }
})

router.delete("/:id(\\d+)", async (req: Request<FolderParams>, res: Response, next: NextFunction) => {
    try {

        await prisma.folder.delete({
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