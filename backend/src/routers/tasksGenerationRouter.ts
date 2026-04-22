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

async function chooseFlashcards(questionsAmount: number, quizId: number, languageSide: "FRONT" | "BACK", isSingleChoice: boolean = false){
    let quiz: any
    let flashcards: any

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

    flashcards = quiz.flashcards
    if (flashcards.length === 0) {
        const error = new Error("Flashcards not found")
        ;(error as any).statusCode = 404
        throw error
    }

    const shuffled = flashcards.sort(() => 0.5 - Math.random())

    if (languageSide === "FRONT") {
        if (isSingleChoice) {
            let result: {
                data: {
                    [key: string]: any
                }
            } = {
                "data": {}
            }

            for (let i = 0; i < questionsAmount; i += 3){
                const taskIndex = i / 3 + 1
                result.data[`task${taskIndex}`] = {
                    "phrase1": shuffled[i].front,
                    "phrase2": shuffled[i + 1].front,
                    "phrase3": shuffled[i + 2].front
                }
            }

            return JSON.stringify(result)
        }
        else {
            return shuffled
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

            for (let i = 0; i < questionsAmount; i += 3){
                const taskIndex = i / 3 + 1
                result.data[`task${taskIndex}`] = {
                    "phrase1": shuffled[i].back,
                    "phrase2": shuffled[i + 1].back,
                    "phrase3": shuffled[i + 2].back
                }
            }

            return JSON.stringify(result)
        }
        else {
            return shuffled
                .slice(0, questionsAmount)
                .map((f: { back: string }) => f.back)
                .join('; ')
        }
    }
}

router.post("/fill-gap-task", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const flashcards: string = await chooseFlashcards(req.body.questionsAmount, req.body.quizId, req.body.languageSide)
        const questions = await sendAIRequest(mainSystemMessage, flashcards)

        res.json(questions)
    }
    catch (error) {
        next(error)
    }
})

router.post("/first-letter-gap-task", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const flashcards: string = await chooseFlashcards(req.body.questionsAmount, req.body.quizId, req.body.languageSide)
        const questions = await sendAIRequest(mainSystemMessage, flashcards)

        // This part is for changing the first underscore in the gap to the first letter of the phrase, because weaker models cannot handle it for multi-word phrases according to my tests
        for (let resultIndex in questions.data) {
            questions.data[resultIndex].sentence = questions.data[resultIndex].sentence.replace("_", questions.data[resultIndex].phrase[0])
        }
        res.json(questions)
    }
    catch (error) {
        next(error)
    }
})

router.post("/multiple-choice-task", async (req: Request, res: Response, next: NextFunction) => {
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

        const flashcards: string = await chooseFlashcards(req.body.questionsAmount, req.body.quizId, req.body.languageSide, true)
        const questions = await sendAIRequest(systemMessage, flashcards)

        res.json(questions)
    }
    catch (error) {
        next(error)
    }
})

export default router