import { useQuery } from '@tanstack/react-query'

const getData = async (userId: number): Promise<UserInfo> => {
    const quizResponse = await fetch(`/api/user-with-quizzes?userId=${userId}`) // rename this path

    return {
        name: "Mock",
        createdQuizzes: [
            {
                id: 1,
                name: "MockQuiz1",
                description: "This is the mock quiz"
            }
        ]
    }

    if (!quizResponse.ok)
    {
        throw new Error(`HTTP ${quizResponse.status}`)
    }
    else
    {
        return await quizResponse.json()
    }
}

export const useUserInfo = (id: number) => {
    return useQuery({
        queryKey: ['userInfo', id],
        queryFn: () => getData(id)
    })
}

interface UserInfo {
    name: string,
    createdQuizzes: Quiz[]
}

interface Quiz {
    id: number,
    name: string,
    description: string
}
