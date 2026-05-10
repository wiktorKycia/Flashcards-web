import { useLoggedInOnly } from '@/hooks/useLoggedInOnly.ts'
import {useMutation} from "@tanstack/react-query";

export default function useCreateQuiz()
{
    useLoggedInOnly()
    /*
    argument authorId -> pobrać z auth              (done)
    quizname jako ""                                (done)
    najpierw to idzie do bazy                       (done)
    potem przenosi na stronę z dużym formularzem    (done)
    zapisuje cały stan w localstorage (troche tak jak z tym auth)
    po kliknięciu save przenosi wszystkie dane na backend
     */


    async function createQuiz(authorId: number): Promise<CreatedQuiz>
    {
        const response = await fetch('/api/quizzes/', {
            method: 'POST',
            body: JSON.stringify({ name: "", authorId: authorId }),
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