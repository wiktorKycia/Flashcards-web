import { useQuery } from '@tanstack/react-query'

const getCreatedQuizzes = async (userId: number): Promise<Quiz[]> => {
    const createdQuizzes = await fetch(`/api/users/${userId}/created-quizzes`)

    if(!createdQuizzes.ok)
    {
        throw new Error(`HTTP ${createdQuizzes.status}`)
    }
    else
    {
        return await createdQuizzes.json()
    }
}

const getSavedQuizzes = async (userId: number): Promise<Quiz[]> => {
    const savedQuizzes = await fetch(`/api/users/${userId}/saved-quizzes`)

    if(!savedQuizzes.ok)
    {
        throw new Error(`HTTP ${savedQuizzes.status}`)
    }
    else
    {
        return await savedQuizzes.json()
    }
}

const getUserName = async (userId: number): Promise<User> => {
    const userInfo = await fetch(`/api/users/${userId}`)

    if(!userInfo.ok)
    {
        throw new Error(`HTTP ${userInfo.status}`)
    }
    else 
    {
        return await userInfo.json()
    }
}

const getData = async (userId: number, isVisitingSelf: boolean): Promise<UserInfo> => {
    if(isVisitingSelf)
    {
        return {
            name: await getUserName(userId).name,
            savedQuizzes: await getSavedQuizzes(userId),
            createdQuizzes: await getCreatedQuizzes(userId)
        }
    }
    else
    {
        return {
            name: await getUserName(userId).name,
            createdQuizzes: await getCreatedQuizzes(userId)
        }
    }
}

export const useUserProfile = (userId: number, isVisitingSelf: boolean) => {
    return useQuery({
        queryKey: ['userId', userId, isVisitingSelf],
        queryFn: () => getData(userId, isVisitingSelf),
        enabled: !!userId
    })
}

interface UserInfo {
    name: string
    createdQuizzes: Quiz[]
    savedQuizzes?: Quiz[]
}

interface Quiz {
    id: number
    name: string
    description: string
}

interface User {
    id: number,
    name: string,
    email: string,
    path_to_img?: string
}
