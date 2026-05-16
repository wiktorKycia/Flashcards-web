import { useMutation } from '@tanstack/react-query'

interface UpdateQuizVariables {
    id: number
    name: string
    frontLanguage: string
    backLanguage: string
    description: string | null
}

const updateQuiz = async ({
    id,
    name,
    frontLanguage,
    backLanguage,
    description
}: UpdateQuizVariables): Promise<UpdatedQuiz> => {
    const response = await fetch(`/api/quizzes/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
            name,
            description,
            frontLanguage,
            backLanguage
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

export const useUpdateQuiz = () => {
    return useMutation({
        mutationFn: updateQuiz
    })
}

interface UpdatedQuiz {
    id: number
    name: string
    description: string | null
    authorId: number
    frontLanguage: string
    backLanguage: string
}

