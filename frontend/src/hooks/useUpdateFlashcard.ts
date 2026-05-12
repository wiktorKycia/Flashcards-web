import { useMutation } from '@tanstack/react-query'

interface UpdateFlashcardVariables {
    id: number
    front: string
    back: string
    starred: boolean
}

const updateFlashcard = async ({
    id,
    front,
    back,
    starred
}: UpdateFlashcardVariables): Promise<Flashcard> => {
    const response = await fetch(`/api/flashcards/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
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

export const useUpdateFlashcard = () => {
    return useMutation({
        mutationFn: updateFlashcard
    })
}

interface Flashcard {
    id: number
    front: string
    back: string
    quizId: number
    starred: boolean
}

