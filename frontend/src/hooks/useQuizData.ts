import { useQuery } from '@tanstack/react-query'

const getData = async (quizId: number): Promise<QuizData> => {
    const quizResponse = await fetch(`/api/quizzes/${quizId}`)

    if (!quizResponse.ok) {
        throw new Error(`HTTP ${quizResponse.status}`)
    } else {
        const quiz: Quiz = await quizResponse.json()
        const flashcardsResponse = await fetch(
            `/api/quizzes/${quizId}/flashcards`
        )
        const flashcards: Flashcard[] = await flashcardsResponse.json()

        const quizAuthorResponse = await fetch(
            `/api/users/?userId=${quiz.authorId}`
        )
        const quizAuthor: QuizAuthor = await quizAuthorResponse.json()

        return { quiz, flashcards, quizAuthor }
    }
}

export const useQuizData = (id: number) => {
    return useQuery({
        queryKey: ['quiz', 'flashcards', 'quizAuthor', id],
        queryFn: () => getData(id)
    })
}

interface Quiz {
    id: number
    name: string
    description: string
    authorId: number
}

interface Flashcard {
    id: number
    language1: string
    language2: string
    side1: string
    side2: string
    quizId: number
}

interface QuizAuthor {
    name: string
    image: string // base64 string, that needs to be converted to image
}

interface QuizData {
    quiz: Quiz
    flashcards: Flashcard[]
    quizAuthor: QuizAuthor
}
