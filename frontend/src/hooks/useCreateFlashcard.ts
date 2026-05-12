import { useMutation } from '@tanstack/react-query'

interface CreateFlashcardVariables {
    quizId: number
    front: string
    back: string
    starred: boolean
}

const createFlashcard = async ({
    quizId,
    front,
    back,
    starred
}: CreateFlashcardVariables): Promise<Flashcard> => {
    const response = await fetch('/api/flashcards/', {
        method: 'POST',
        body: JSON.stringify({
            quizId,
            front,
            back,
            starred
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
    }

    return response.json()
}

export const useCreateFlashcard = () => {
    return useMutation({
        mutationFn: createFlashcard
    })
}

interface Flashcard {
    id: number
    front: string
    back: string
    quizId: number
    starred: boolean
}

