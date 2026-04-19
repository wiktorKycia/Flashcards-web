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

async function sendAIRequest(systemMessage: string, userMessage: string) {
    const client = new OpenAI({ baseURL: endpoint, apiKey: token });

    const response = await client.chat.completions.create({
        messages: [
            { role: 'system', content: systemMessage },
            { role: 'user', content: userMessage}
        ],
        model: model,
        response_format: { type: "json_object" }
    })

    const content = response.choices?.[0]?.message?.content

    if (!content) {
        throw new Error("AI returned empty response")
    }

    return JSON.parse(content)
}

async function chooseFlashcards(amount: number, quizId: number, languageSide: "FRONT" | "BACK"){
    let quiz = undefined

    if (languageSide === "FRONT") {
        quiz = await prisma.quiz.findOne({
            where: {
                id: quizId
            },
            select: {
                quizId: quizId,
                flashcards: {
                    select: {
                        front: true
                    }
                }
            }
        })
    } else {
        quiz = await prisma.quiz.findOne({
            where: {
                id: quizId
            },
            select: {
                quizId: quizId,
                flashcards: {
                    select: {
                        back: true
                    }
                }
            }
        })
    }

    const flashcards = quiz.flashcards
    if (flashcards.length === 0) {
        const error = new Error("Flashcards not found")
        ;(error as any).statusCode = 404
        throw error
    }
    const shuffled = flashcards.sort(() => 0.5 - Math.random())

    if (languageSide === "FRONT") {
        return shuffled.slice(0, amount).map((f: { front: string }) => f.front).join(", ")
    }
    else {
        return shuffled.slice(0, amount).map((f: { back: string }) => f.back).join(", ")
    }
}

router.post("/fill-gap-task", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const systemMessage =
            'Your job is to create tasks for setbooks in particular language.' +
            'You will be given some words in json format. For each provided word, create one natural sentence in the same language. ' +
            'The sentence must match the word\'s difficulty level (e.g., A1, B2, C1) and provide enough context to understand the word\'s meaning. ' +
            'Replace the word with a gap, so the student will have to guess it. ' +
            'For example: The given word is "downhill". ' +
            'The sentence should then look something like: "The punctuality of the train service has been going _____ since the beginning of this year." .' +
            'Second example: The given word is "unjustified". ' +
            'The ouput sentence: "Her anger at his comment was completely ________, given the explanation he had offered." .' +
            'You can think of any sentence, that was only the example. Remember that your answer should contain only the sentence with the gap marked as underscores.' +
            'Return the data as a JSON array of objects with the following structure:\n' +
            '[\n' +
            '  {\n' +
            '    "word": "text",\n' +
            '    "sentence": "text"\n' +
            '  }\n' +
            ']'

        const flashcards: string = await chooseFlashcards(req.body.amount, req.body.quizId, req.body.languageSide)
        const questions = await sendAIRequest(systemMessage, flashcards)

        res.json(questions)
    }
    catch (error) {
        next(error)
    }
})

router.post("/first-letter-gap-task", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const systemMessage =
            'Your job is to create tasks for setbooks in particular language.' +
            'You will be given some words in json format. For each provided word, create one natural sentence in the same language. ' +
            'The sentence must match the word\'s difficulty level (e.g., A1, B2, C1) and provide enough context to understand the word\'s meaning. ' +
            'Replace the word with a gap, but leave the first letter, so the student will have to guess the rest of it. ' +
            'For example: The given word is "downhill". ' +
            'The sentence should then look something like: "The punctuality of the train service has been going d____ since the beginning of this year." .' +
            'Second example: The given word is "unjustified". ' +
            'The ouput sentence: "Her anger at his comment was completely u_______, given the explanation he had offered." .' +
            'You can think of any sentence, that was only the example. Remember that your answer should contain only the sentence and the first letter of the word with the gap marked as underscores.' +
            'Return the data as a JSON array of objects with the following structure:\n' +
            '[\n' +
            '  {\n' +
            '    "word": "text",\n' +
            '    "sentence": "text"\n' +
            '  }\n' +
            ']'

        const flashcards: string = await chooseFlashcards(req.body.amount, req.body.quizId, req.body.languageSide)
        const questions = await sendAIRequest(systemMessage, flashcards)

        res.json(questions)
    }
    catch (error) {
        next(error)
    }
})

router.post("/multiple-choice-task", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const systemMessage =
            'Your job is to create tasks for setbooks in particular language.' +
            'You will be given some phrases in json format. For each 3 of provided phrases, choose one phrase and create one natural sentence in the same language with that phrase. ' +
            'The rest of the phrases will serve as incorrect answers in the given multiple choice tasks. ' +
            'The sentence must match the phrase\'s difficulty level (e.g., A1, B2, C1) and provide enough context to understand the phrase\'s meaning. ' +
            'Replace the phrase with a gap, so the student will have to guess it. ' +
            'For example: The given pharses are "downhill, left, up in flames". ' +
            'The sentence should then look something like: "The punctuality of the train service has been going _____ since the beginning of this year." .' +
            'Second example: The given phrases are "unjustified, full of soup, too much blue". ' +
            'The ouput sentence: "Her anger at his comment was completely ________, given the explanation he had offered." .' +
            'You can think of any sentence, that was only the example. Remember that your answer should contain sentences with the gap marked as underscores and phrases as answers for each question.' +
            'Return the data as a JSON array of objects with the following structure:\n' +
            '[\n' +
            '  {\n' +
            '    "word1": "text",\n' +
            '    "word2": "text",\n' +
            '    "word3": "text",\n' +
            '    "correctAnswer": "text",\n' +
            '    "sentence": "text"\n' +
            '  }\n' +
            ']'

        const flashcards: string = await chooseFlashcards(req.body.amount * 3, req.body.quizId, req.body.languageSide)
        const questions = await sendAIRequest(systemMessage, flashcards)

        res.json(questions)
    }
    catch (error) {
        next(error)
    }
})

export default router