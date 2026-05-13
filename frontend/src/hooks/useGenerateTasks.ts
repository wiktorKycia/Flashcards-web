import { useMutation } from '@tanstack/react-query'

type GenerateTasksProps = {
    fillGapCounnt: number
    firstLetterCount: number
    singleChoiceCount: number
    quizId: number
    languageSide: 'FRONT' | 'BACK'
}

export const useGenerateTasks = () => {
    return useMutation({
        mutationFn: async ({
           fillGapCounnt,
           firstLetterCount,
           singleChoiceCount,
           quizId,
           languageSide
        }: GenerateTasksProps) => {
            let firstError: string | null = null
            let firstWrongStatus: number | null = null
            let warning: string | null = null
            let data1 = null, data2 = null, data3 = null

            const res1 = await fetch(
                "/api/tasks/generation/fill-gap",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        questionsAmount: fillGapCounnt,
                        quizId,
                        languageSide,
                    }),
                }
            )

            try {
                data1 = await res1.json()
            }
            catch {
                data1 = null
            }

            if (!res1.ok) {
                firstWrongStatus = res1.status
                firstError = data1?.error ?? null
            }

            if(data1?.warning){
                warning = data1?.warning
            }

            const res2 = await fetch(
                "/api/tasks/generation/first-letter-gap",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        questionsAmount: firstLetterCount,
                        quizId,
                        languageSide,
                    }),
                }
            )

            try {
                data2 = await res2.json()
            }
            catch {
                data2 = null
            }

            if (!res2.ok && firstError == null) {
                firstWrongStatus = res2.status
                firstError = data2?.error ?? null
            }

            if (data2?.warning && warning == null) {
                warning = data2?.warning
            }

            const res3 = await fetch(
                "/api/tasks/generation/single-choice",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        questionsAmount: singleChoiceCount,
                        quizId,
                        languageSide,
                    }),
                }
            )

            try {
                data3 = await res3.json()
            }
            catch {
                data3 = null
            }

            if (!res3.ok && firstError == null) {
                firstWrongStatus = res3.status
                firstError = data3?.error ?? null
            }

            if (data3?.warning && warning == null) {
                warning = data3?.warning
            }

            return {
                fillGap: data1,
                firstLetterGap: data2,
                singleChoice: data3,
                status: firstWrongStatus,
                errorMessage: firstError,
                warning,
            }
        }
    })
}