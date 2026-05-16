import OpenAI from 'openai'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import express, { NextFunction, Request, Response, Router } from 'express'
import fs from 'fs'
import path from 'path'

dotenv.config({path: '.env.app'})

const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.github.ai/inference";
const client = new OpenAI({ baseURL: endpoint, apiKey: token, maxRetries: 0 });
const modelsList: string[] = ["openai/gpt-4.1", "openai/gpt-4o", "DeepSeek-V3-0324", "openai/gpt-4.1-nano", "openai/gpt-4.1-mini", "openai/gpt-4o-mini"];
const router: Router = express.Router()
const prisma = new PrismaClient()
const fillGapPrompt = loadPrompt("fill-gap.txt")
const singleChoicePrompt = loadPrompt("single-choice.txt")

function loadPrompt(fileName: string): string {
    const filePath = path.join(__dirname, "..", "prompts", fileName)
    return fs.readFileSync(filePath, "utf-8")
}

async function sendAIRequest(systemMessage: string, userMessage: string) {
    let modelIndex: number = 0;

    if (!token) {
        throw new Error("Missing GITHUB_TOKEN in .env.app file")
    }

    while (modelIndex < modelsList.length) {
        const controller = new AbortController();
        const timeoutId = setTimeout(async () => controller.abort(), 12000)

        try {
            const response = await client.chat.completions.create({
                messages: [
                    {role: 'system', content: systemMessage},
                    {role: 'user', content: userMessage}
                ],
                model: modelsList[modelIndex]  ?? "openai/gpt-4.1-mini",
                response_format: {type: "json_object"}
            }, {signal: controller.signal})

            clearTimeout(timeoutId)

            const content = response.choices?.[0]?.message?.content

            if (!content) {
                modelIndex++
                continue
            }

            const cleanContent = content
                .replace(/^```json/i, "")
                .replace(/^```/i, "")
                .replace(/```$/i, "")
                .trim()

            return JSON.parse(cleanContent)
        } catch(error) {
            clearTimeout(timeoutId)

            if (error instanceof  OpenAI.APIError) {
                const isRateLimit: boolean = error.status === 429
                const isForbidden: boolean = error.status === 403

                if (isRateLimit || isForbidden) {
                    modelIndex++
                    continue
                }
            }
            if (error instanceof Error && error.name === "AbortError") {
                modelIndex++
                continue
            }

            throw error
        }
    }

    throw new Error("All models failed or returned empty responses")
}

async function chooseFlashcards(questionsAmount: number, quizId: number, languageSide: "FRONT" | "BACK", isSingleChoice: boolean = false){
    let warning: string | null = null
    const flashcards = await prisma.flashcard.findMany({
        where: {
            quizId: quizId
        }
    })

    if (flashcards.length === 0) {
        throw new Error("Flashcards not found")
    }
    else if (isSingleChoice && flashcards.length < 3) {
        throw new Error("Not enough flashcards found")
    }
    else if ((isSingleChoice && flashcards.length < questionsAmount * 3) || flashcards.length < questionsAmount) {
        warning = "W quizie nie ma wystarczającej liczby fiszek do utworzenia wymaganej liczby pytań"

        if (isSingleChoice) {
            questionsAmount = Math.floor(flashcards.length / 3)
        }
        else {
            questionsAmount = flashcards.length
        }
    }

    const shuffled = flashcards.sort(() => 0.5 - Math.random())

    let phrases: string
    if (languageSide === "FRONT") {
        if (isSingleChoice) {
            let result: {
                data: {
                    [key: string]: any
                }
            } = {
                "data": {}
            }

            for (let i = 0; i < questionsAmount * 3; i += 3){
                const taskIndex = i / 3 + 1
                result.data[`task${taskIndex}`] = {
                    "phrase1": shuffled[i]!.front,
                    "phrase2": shuffled[i + 1]!.front,
                    "phrase3": shuffled[i + 2]!.front
                }
            }

            phrases = JSON.stringify(result)
        }
        else {
            phrases = shuffled
                .slice(0, questionsAmount)
                .map((f: { front: string }) => f.front)
                .join('; ')
        }
    }
    else {
        if (isSingleChoice) {
            let result: {
                data: {
                    [key: string]: any
                }
            } = {
                "data": {}
            }

            for (let i = 0; i < questionsAmount * 3; i += 3){
                const taskIndex = i / 3 + 1
                result.data[`task${taskIndex}`] = {
                    "phrase1": shuffled[i]!.back,
                    "phrase2": shuffled[i + 1]!.back,
                    "phrase3": shuffled[i + 2]!.back
                }
            }

            phrases = JSON.stringify(result)
        }
        else {
            phrases = shuffled
                .slice(0, questionsAmount)
                .map((f: { back: string }) => f.back)
                .join('; ')
        }
    }

    return {
        phrases,
        warning
    }
}

router.post("/fill-gap", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { phrases, warning } = await chooseFlashcards(
            req.body.questionsAmount,
            req.body.quizId,
            req.body.languageSide
        )
        const subtasks = await sendAIRequest(fillGapPrompt, phrases)

        if (warning) {
            return res.json({ subtasks, warning })
        }
        else {
            return res.json({ subtasks })
        }
    }
    catch (error) {
        next(error)
    }
})

router.post("/first-letter-gap", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { phrases, warning } = await chooseFlashcards(req.body.questionsAmount, req.body.quizId, req.body.languageSide)
        const subtasks = await sendAIRequest(fillGapPrompt, phrases)

        // This part is for changing the first underscore in the gap to the first letter of the phrase, because weaker models cannot handle it for multi-word phrases according to my tests
        for (let resultIndex in subtasks.data) {
            subtasks.data[resultIndex].sentence = subtasks.data[resultIndex].sentence.replace("_", subtasks.data[resultIndex].phrase[0])
        }

        if (warning) {
            return res.json({ subtasks, warning })
        }
        else {
            return res.json({ subtasks })
        }
    }
    catch (error) {
        next(error)
    }
})

router.post("/single-choice", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { phrases, warning } = await chooseFlashcards(req.body.questionsAmount, req.body.quizId, req.body.languageSide, true)
        const subtasks = await sendAIRequest(singleChoicePrompt, phrases)

        if (warning) {
            return res.json({ subtasks, warning })
        }
        else {
            return res.json({ subtasks })
        }
    }
    catch (error) {
        next(error)
    }
})

export default router