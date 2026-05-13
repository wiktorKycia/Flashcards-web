import { useMutation } from '@tanstack/react-query'

type GenerateSingleChoiceTaskProps = {
    questionsAmount: number
    quizId: number
    languageSide: 'FRONT' | 'BACK'
}

export const useFillGapTask = () => {
    return useMutation({
        mutationFn: async({
            questionsAmount,
            quizId,
            languageSide
        }: GenerateSingleChoiceTaskProps) => {
            const response = await fetch(
                "/api/tasks/generation/single-choice",
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