import OpenAI from 'openai'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import express, { NextFunction, Request, Response, Router } from 'express'

dotenv.config({path: '.env.app'})

const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.github.ai/inference";
const client = new OpenAI({ baseURL: endpoint, apiKey: token, maxRetries: 0 });
const modelsList: string[] = ["openai/gpt-4.1", "openai/gpt-4o", "openai/gpt-4.1-nano", "openai/gpt-4.1-mini", "openai/gpt-4o-mini"];
const router: Router = express.Router()
const prisma = new PrismaClient()

const mainSystemMessage = 'Your job is to create tasks for setbooks in particular language.\n' +
    'You will be given some phrases. For each provided phrase, create one natural sentence in the same language. ' +
    'The sentence must match the phrase\'s difficulty level (e.g., A1, B2, C1) and provide enough context to understand the phrase\'s meaning. ' +
    'Replace the phrase with a gap, so the student will have to guess it.\n\n' +
    'For example: The given phrase is "downhill". ' +
    'The sentence should then look something like: "The punctuality of the train service has been going _____ since the beginning of this year.".\n' +
    'Second example: The given phrase is "completely unjustified". ' +
    'The output sentence: "Her anger at his comment was ________, given the explanation he had offered.".\n' +
    'RULE FOR MULTI_WORD PHRASES:\n' +
    '- multi-word phrases must NOT create multiple gaps or word-by-word gaps. They must always become one continuous gap (e.g. p_____ not p____ o___ c___ for the phrase "piece of cake").\n' +
    'You can think of any sentence, that was only the example. Remember that your answer should contain only the sentence with the gap marked as underscores.\n' +
    'Return the data as a JSON array of objects with the following structure:\n' +
    '{\n' +
    '   data: [\n' +
    '       {\n' +
    '           "phrase": "text",\n' +
    '           "sentence": "text"\n' +
    '       },\n' +
    '       {\n' +
    '           "phrase": "text",\n' +
    '           "sentence": "text"\n' +
    '       }\n' +
    '   ]\n' +
    '}'

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

            return JSON.parse(content)
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
    else if ((isSingleChoice && flashcards.length < questionsAmount * 3) || flashcards.length < questionsAmount) {
        warning = "W quizie nie ma wystarczającej liczby fiszek do utworzenia wymaganej liczby pytań"
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
        const subtasks = await sendAIRequest(mainSystemMessage, phrases)

        if (warning) {
            return res.json({ subtasks, warning })
        }
        else {
            return res.json({ subtasks })
        }
    }
    catch (error) {
        if (error instanceof Error && (error.message === "Flashcards not found" || error.message === "Quiz not found")) {
            res.sendStatus(404)
        }

        next(error)
    }
})

router.post("/first-letter-gap", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { phrases, warning } = await chooseFlashcards(req.body.questionsAmount, req.body.quizId, req.body.languageSide)
        const subtasks = await sendAIRequest(mainSystemMessage, phrases)

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
        if (error instanceof Error && error.message === "Flashcards not found") {
            res.sendStatus(404)
        }

        next(error)
    }
})

router.post("/single-choice", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const systemMessage =
            'Your job is to create tasks for setbooks in particular language.\n' +
            'You will be given some phrases. For each 3 of provided phrases, choose one phrase and create one natural sentence in the same language with that phrase. ' +
            'The rest of the phrases will serve as incorrect answers in the given multiple choice tasks. ' +
            'The sentence must match the phrase\'s difficulty level (e.g., A1, B2, C1) and provide enough context to understand the phrase\'s meaning. ' +
            'Replace the phrase with a gap, so the student will have to guess it.\n' +
            'For example: The given phrases are "downhill, left, up in flames". ' +
            'The sentence should then look something like: "The punctuality of the train service has been going _____ since the beginning of this year.".\n' +
            'Second example: The given phrases are "completely unjustified, full of soup, too much blue". ' +
            'The output sentence: "Her anger at his comment was ________, given the explanation he had offered.".\n' +
            'You can think of any sentence, that was only the example. Remember that your answer should contain sentences with the gap marked as underscores and phrases as answers for each question.\n' +
            'RULE FOR MULTI_WORD PHRASES:\n' +
            '- multi-word phrases must NOT create multiple gaps or word-by-word gaps. They must always become one continuous gap (e.g. p_____ not p____ o___ c___ for the phrase "piece of cake").\n' +
            'Return the data as a JSON array of objects with the following structure:\n' +
            '{\n' +
            '   data: [\n' +
            '       {\n' +
            '           "phrase1": "text",\n' +
            '           "phrase2": "text",\n' +
            '           "phrase3": "text",\n' +
            '           "correctAnswer": "text",\n' +
            '           "sentence": "text"\n' +
            '       },\n' +
            '       {\n' +
            '           "phrase1": "text",\n' +
            '           "phrase2": "text",\n' +
            '           "phrase3": "text",\n' +
            '           "correctAnswer": "text",\n' +
            '           "sentence": "text"\n' +
            '       }\n' +
            '   ]\n' +
            '}'

        const { phrases, warning } = await chooseFlashcards(req.body.questionsAmount, req.body.quizId, req.body.languageSide, true)
        const subtasks = await sendAIRequest(systemMessage, phrases)

        if (warning) {
            return res.json({ subtasks, warning })
        }
        else {
            return res.json({ subtasks })
        }
    }
    catch (error) {
        if (error instanceof Error && error.message === "Flashcards not found") {
            res.sendStatus(404)
        }

        next(error)
    }
})

export default router