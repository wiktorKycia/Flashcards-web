import { useLoggedInOnly } from '@/hooks/useLoggedInOnly.ts'
import {useMutation} from "@tanstack/react-query";

export default function useCreateQuiz()
{
    useLoggedInOnly()

    async function createQuiz(authorId: number): Promise<CreatedQuiz>
    {
        const response = await fetch('/api/quizzes/', {
            method: 'POST',
            body: JSON.stringify({ name: "", authorId: authorId, frontLanguage: "", backLanguage: "" }),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`)
        }

        return response.json()
    }

    return useMutation({
        mutationFn: createQuiz
    })
}

interface CreatedQuiz {
    id: number,
    name: string,
    description: string | null,
    authorId: number
}