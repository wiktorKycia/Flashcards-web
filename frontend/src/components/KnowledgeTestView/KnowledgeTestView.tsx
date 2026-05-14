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
    return (
        <form>
            {data.fillGap?.data?.length? (
                <section>
                    <h2>Wypełnij luki</h2>

                    {data.fillGap.data.map((task, i) => (
                        <GapTask
                            key={`fill-gap${i}`}
                            task={task}
                            taskId={`fill-gap${i}`}
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
                        />
                    ))}
                </section>
            ) : null}
        </form>
    )
}