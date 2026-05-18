import { useState } from 'react'
import GapTask from '@/components/GapTask'
import SingleChoiceTask from '@/components/SingleChoiceTask'

type GapTask = {
    sentence: string
    phrase: string
}

type SingleChoiceTask = {
    sentence: string
    phrase1: string
    phrase2: string
    phrase3: string
    correctAnswer: string
}

type Props = {
    data: {
        fillGap?: {
            data: GapTask[]
        }
        firstLetterGap?: {
            data: GapTask[]
        }
        singleChoice?: {
            data: SingleChoiceTask[]
        }
    }
}

export default function KnowledgeTestView({ data }: Props) {
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [score, setScore] = useState<number>(0)
    const [isFinished, setIsFinished] = useState<boolean>(false)

    const handleAnswerChange = (taskID: string, value: string) => {
        if (isFinished) return

        setAnswers(prev => ({
            ...prev,
            [taskID]: value
        }))
    }

    const handleCheck = () => {
        let points = 0

        data.fillGap?.data.forEach((task, i) => {
            const id = `fill-gap${i}`

            if (answers[id]?.trim() === task.phrase.trim()) {
                points++
            }
        })

        data.firstLetterGap?.data.forEach((task, i) => {
            const id = `first-letter${i}`

            if (answers[id]?.trim() === task.phrase.trim()) {
                points++
            }
        })

        data.singleChoice?.data.forEach((task, i) => {
            const id = `single-choice${i}`

            if (answers[id]?.trim() === task.correctAnswer.trim()) {
                points++
            }
        })

        setScore(points)
        setIsFinished(true)
    }

    const handleReset = () => {
        setAnswers({})
        setScore(0)
        setIsFinished(false)
    }

    const totalQuestions: number =
        (data.fillGap?.data.length || 0) +
        (data.firstLetterGap?.data.length || 0) +
        (data.singleChoice?.data.length || 0)

    const percentage: number = totalQuestions > 0 ? Math.round(score / totalQuestions * 100) : 0

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                handleCheck()
            }}
        >
            {data.fillGap?.data?.length ? (
                <section>
                    <h2>Wypełnij luki</h2>

                    {data.fillGap.data.map((task, i) => (
                        <GapTask
                            key={`fill-gap${i}`}
                            task={task}
                            taskId={`fill-gap${i}`}
                            value={answers[`fill-gap${i}`] || ''}
                            onChange={handleAnswerChange}
                            isFinished={isFinished}
                        />
                    ))}
                </section>
            ) : null}

            {data.firstLetterGap?.data?.length ? (
                <section>
                    <h2>Wypełnij pozostałe części fraz w lukach na podstawie ich pierwszych liter</h2>

                    {data.firstLetterGap.data.map((task, i) => (
                        <GapTask
                            key={`first-letter${i}`}
                            task={task}
                            taskId={`first-letter${i}`}
                            value={answers[`first-letter${i}`] || ''}
                            onChange={handleAnswerChange}
                            isFinished={isFinished}
                        />
                    ))}
                </section>
            ) : null}

            {data.singleChoice?.data?.length ? (
                <section>
                    <h2>Wybierz poprawne uzupełnienie luki</h2>

                    {data.singleChoice.data.map((task, i) => (
                        <SingleChoiceTask
                            key={`single-choice${i}`}
                            task={task}
                            taskId={`single-choice${i}`}
                            selectedValue={answers[`single-choice${i}`] || ''}
                            onChange={handleAnswerChange}
                            isFinished={isFinished}
                        />
                    ))}
                </section>
            ) : null}

            {isFinished && (
                <div>
                    <h2>Wynik</h2>
                    <p>{score} / {totalQuestions}</p>
                    <p>{percentage}%</p>
                </div>
            )}

            <div>
                {!isFinished ? (
                    <button type="submit">
                        Sprawdź
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={handleReset}
                    >
                        Resetuj test
                    </button>
                )}
            </div>
        </form>
    )
}