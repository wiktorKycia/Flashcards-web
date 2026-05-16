import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'

interface DeleteQuizVariables {
    id: number
}

interface UseDeleteQuizResult {
    isDeleting: boolean
    deleteError: string | null
    handleDeleteQuiz: (options: {
        id: number
        onSuccess?: () => void
        confirmMessage?: string
    }) => Promise<void>
}

const deleteQuiz = async ({ id }: DeleteQuizVariables): Promise<void> => {
    const response = await fetch(`/api/quizzes/${id}`, {
        method: 'DELETE'
    })

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
    }
}

export const useDeleteQuiz = (): UseDeleteQuizResult => {
    const [isDeleting, setIsDeleting] = useState(false)
    const [deleteError, setDeleteError] = useState<string | null>(null)

    const mutation = useMutation({
        mutationFn: deleteQuiz
    })

    const handleDeleteQuiz = async ({
        id,
        onSuccess,
        confirmMessage
    }: {
        id: number
        onSuccess?: () => void
        confirmMessage?: string
    }) => {
        const message =
            confirmMessage ??
            'Na pewno chcesz usunąć ten quiz? Ta akcja jest nieodwracalna.'

        if (!window.confirm(message)) {
            return
        }

        setIsDeleting(true)
        setDeleteError(null)

        try {
            await mutation.mutateAsync({ id })
            onSuccess?.()
        } catch {
            setDeleteError('Nie udało się usunąć quizu')
        } finally {
            setIsDeleting(false)
        }
    }

    return {
        isDeleting,
        deleteError,
        handleDeleteQuiz
    }
}

