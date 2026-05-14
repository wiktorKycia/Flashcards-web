import GapTask from '@/components/GapTask'
import SingleChoiceTask from '@/components/SingleChoiceTask'

type Props = {
    data: {
        fillGap?: {
            data: never[]
        }
        firstLetterGap?: {
            data: never[]
        }
        singleChoice?: {
            data: never[]
        }
    }
}

export default function KnowledgeTestView({ data }: Props) {
    return (
        <div>
            {data.fillGap?.data?.length ? (
                <section>
                    <h2>Wypełnij luki</h2>

                    {data.fillGap.data.map((task, i) => (
                        <GapTask
                            key={i}
                            task={task}
                        />
                    ))}
                </section>
            ) : null}

            {data.firstLetterGap?.data?.length ? (
                <section>
                    <h2>Wypełnij pozostałe części fraz w lukach na podstawie ich pierwszych liter</h2>

                    {data.firstLetterGap.data.map((task, i) => (
                        <GapTask
                            key={i}
                            task={task}
                        />
                    ))}
                </section>
            ) : null}

            {data.singleChoice?.data?.length ? (
                <section>
                    <h2>Wybierz poprawne uzupełnienie luki</h2>

                    {data.singleChoice.data.map((task, i) => (
                        <SingleChoiceTask
                            key={i}
                            task={task}
                        />
                    ))}
                </section>
            ) : null}
        </div>
    )
}