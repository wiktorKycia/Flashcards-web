import { useQuery } from '@tanstack/react-query'
import resolvePromise from '@/helpers/resolvePromise'

const getCreatedQuizzes = async (userId: number): Promise<Quiz[]> => {
    const createdQuizzes = await fetch(`/api/users/${userId}/created-quizzes`)
    return resolvePromise<Quiz[]>(createdQuizzes)
}

const getSavedQuizzes = async (userId: number): Promise<Quiz[]> => {
    const savedQuizzes = await fetch(`/api/users/${userId}/saved-quizzes`)
    return resolvePromise<Quiz[]>(savedQuizzes)
}

const getUserName = async (userId: number): Promise<User> => {
    const userInfo = await fetch(`/api/users/${userId}`)
    return resolvePromise<User>(userInfo)
}

const getData = async (userId: number, isVisitingSelf: boolean): Promise<UserInfo> => {
    if(isVisitingSelf)
    {
        return {
            name: (await getUserName(userId)).name,
            savedQuizzes: await getSavedQuizzes(userId),
            createdQuizzes: await getCreatedQuizzes(userId)
        }
    }
    else
    {
        return {
            name: (await getUserName(userId)).name,
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
