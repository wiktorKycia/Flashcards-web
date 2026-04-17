import OpenAI from 'openai'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import express, { NextFunction, Request, Response, Router } from 'express'

dotenv.config({path: '.env.app'})

const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1-nano";
const router: Router = express.Router()
const prisma = new PrismaClient()

async function sendAIRequest(systemMessage: string, userMessage: Record<string, any>) {
    const client = new OpenAI({ baseURL: endpoint, apiKey: token });

    const response = await client.chat.completions.create({
        messages: [
            { role: 'system', content: systemMessage },
            { role: 'user', content: JSON.stringify(userMessage) }
        ],
        model: model,
        response_format: { type: "json_object" }
    })

    const content = response.choices?.[0]?.message?.content

    if (!content) {
        throw new Error("AI returned empty response")
    }

    return content
}

async function chooseFlashcards(amount: number, quizId: number, languageSide: "FRONT" | "BACK"){
    let quiz = undefined

    if (languageSide === "FRONT") {
        quiz = await prisma.quiz.findOne({
            where: {
                id: quizId,
            },
            select: {
                quizId: quizId,
                flashcards: {
                    front: true
                }
            }
        })
    }
    else {
        quiz = await prisma.quiz.findOne({
            where: {
                id: quizId,
            },
            select: {
                quizId: quizId,
                flashcards: {
                    back: true
                }
            }
        })
    }

    const flashcards = quiz.flashcards
    const shuffled = flashcards.sort(() => 0.5 - Math.random())

    return await shuffled.slice(0, amount)
}

router.post("/fill-gap-task", async (request: Request, res: Response, next: NextFunction) => {
    try {
        const systemMessage = "Your job is to create tasks for english setbooks." +
            "You will be given a word. You have to create a sentence, that would normally contain that word. " +
            "Replace the word with a gap, so the student will have to guess it. " +
            "For example: The given word is \"downhill\". " +
            "The sentence should then look something like: \"The punctuality of the train service has been going _____ since the beginning of this year.\" ." +
            "Second example: The given word is \"unjustified\". " +
            "The ouput sentence: \"Her anger at his comment was completely ________, given the explanation he had offered.\" ." +
            "You can think of any sentence, that was only the example. Remember that your answer should contain only the sentence with the gap marked as underscores."


    }
    catch (error) {
        next(error)
    }
})

export default router