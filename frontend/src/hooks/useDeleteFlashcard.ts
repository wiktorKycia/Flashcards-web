import { useMutation } from '@tanstack/react-query'

interface DeleteFlashcardVariables {
    id: number
}

const deleteFlashcard = async ({ id }: DeleteFlashcardVariables): Promise<void> => {
    const response = await fetch(`/api/flashcards/${id}`, {
        method: 'DELETE'
    })

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
    }
}

export const useDeleteFlashcard = () => {
    return useMutation({
        mutationFn: deleteFlashcard
    })
}

