import { useMutation } from '@tanstack/react-query'

type GenerateFirstLetterGapTaskProps = {
    questionsAmount: number
    quizId: number
    languageSide: 'FRONT' | 'BACK'
}

export const useFirstLetterGapTask = () => {
    return useMutation({
        mutationFn: async({
            questionsAmount,
            quizId,
            languageSide
        }: GenerateFirstLetterGapTaskProps) => {
            const response = await fetch(
                "/api/tasks/generation/first-letter-gap",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        questionsAmount,
                        quizId,
                        languageSide,
                    }),
                }
            )

            if (!response.ok) {
                const errorData = await response.json()

                throw new Error(errorData.error ?? 'Wystąpił błąd')
            }

            return response.json()
        }
    })

}