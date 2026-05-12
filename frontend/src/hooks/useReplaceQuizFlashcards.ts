import { useMutation, useQueryClient } from '@tanstack/react-query'

interface ReplaceQuizFlashcardsVariables {
    quizId: number
    flashcards: ReplaceQuizFlashcard[]
}

interface ReplaceQuizFlashcard {
    front: string
    back: string
    starred: boolean
}

const replaceQuizFlashcards = async ({
    quizId,
    flashcards
}: ReplaceQuizFlashcardsVariables): Promise<QuizFlashcard[]> => {
    const response = await fetch(`/api/quizzes/${quizId}/flashcards`, {
        method: 'PUT',
        body: JSON.stringify(flashcards),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
    }

    return response.json()
}

export const useReplaceQuizFlashcards = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: replaceQuizFlashcards,
        onSuccess: async (_data, variables) => {
            await queryClient.invalidateQueries({
                queryKey: ['quiz', 'flashcards', 'quizAuthor', variables.quizId]
            })
        }
    })
}

interface QuizFlashcard {
    id: number
    front: string
    back: string
    quizId: number
    starred: boolean
}

