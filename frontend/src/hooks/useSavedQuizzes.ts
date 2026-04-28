import { useQuery } from '@tanstack/react-query'

const getData = async (userId: number): Promise<Quiz[]> => {
    const quizResponse = await fetch(`/api/saved-quizzes?userId=${userId}`)

    if (!quizResponse.ok) {
        throw new Error(`HTTP ${quizResponse.status}`)
    } else {
        return await quizResponse.json()
    }
}

export const useSavedQuizzes = (id: number) => {
    return useQuery({
        queryKey: ['quiz', id],
        queryFn: () => getData(id),
        enabled: !!id
    })
}

interface Quiz {
    id: number
    name: string
    description: string
    authorId: number
}
