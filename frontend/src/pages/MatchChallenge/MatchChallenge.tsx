import { useEffect, useMemo, useState } from 'react'
import MatchCard from '@/components/MatchCard'
import styles from './MatchChallenge.module.scss'
import { useParams } from 'react-router'
import { useQuizData } from '@/hooks/useQuizData.ts'
import LoadingSpinner from '@/components/LoadingSpinner'

type CardStatus = 'idle' | 'selected' | 'correct' | 'wrong' | 'hidden'

type CardItem = {
    id: string
    pairId: number
    content: string
    status: CardStatus
}

export default function MatchChallenge(){
    const id: number = parseInt(useParams().id as string)
    const { data, isLoading, isError } = useQuizData(id)

    const initialCards: CardItem[] = useMemo<CardItem[]>(() => {
        const mapped = data?.flashcards.flatMap((flashcard) => [
            {
                id: `${flashcard.id}-a`,
                pairId: flashcard.id,
                content: flashcard.front,
                status: 'idle' as CardStatus
            },
            {
                id: `${flashcard.id}-b`,
                pairId: flashcard.id,
                content: flashcard.back,
                status: 'idle' as CardStatus
            }
        ])

        if (mapped != undefined) {
            return shuffle(mapped)
        }
    }, [data?.flashcards])

    const [cards, setCards] = useState<CardItem[]>(initialCards)

    const selectedCards = cards.filter(
        (card) => card.status === 'selected'
    )

    const handleCardClick = (id: string) => {
        if (selectedCards.length >= 2) return

        setCards((prev) =>
            prev.map((card) =>
                card.id === id ? { ...card, status: 'selected'} : card
            )
        )
    }

    useEffect(() => {
        if (selectedCards.length !== 2) return

        const [first, second] = selectedCards

        if (first.pairId === second.pairId && first.id != second.id){
            setCards((prev) =>
                prev.map((card) =>
                    card.id === first.id || card.id === second.id ? { ...card, status: 'correct'} : card
                )
            )

            const hideTimeout = setTimeout(() => {
                setCards((prev) =>
                    prev.map((card) =>
                        card.id === first.id || card.id === second.id ? { ...card, status: 'hidden'} : card
                    )
                )
            }, 500)

            return () => clearTimeout(hideTimeout)
        }

        setCards((prev) =>
            prev.map((card) =>
                card.id === first.id || card.id === second.id ? { ...card, status: 'wrong'} : card
            )
        )

        const resetTimeout = setTimeout(() => {
            setCards((prev) =>
                prev.map((card) =>
                    card.status === "wrong" ? { ...card, status: 'idle'} : card
                )
            )
        }, 700)

        return () => clearTimeout(resetTimeout)
    }, [selectedCards])

    const isFinished = cards.every((card) => card.status === 'hidden')

    return (
        <>
            <div className={styles.MatchChallenge}>
                <h1>Match Challenge</h1>
                {isError && <div>Wystąpił błąd</div>}
                {isLoading && <LoadingSpinner />}
                {isFinished && (
                    <div className={styles.Finished}>
                        Ukończono!
                    </div>
                )}

                <div className={styles.Grid}>
                    {cards.map((card) => (
                        <MatchCard
                            key={card.id}
                            content={card.content}
                            status={card.status}
                            onClick={() => handleCardClick(card.id)}
                        />
                    ))}
                </div>
            </div>
        </>
    )
}

function shuffle<T>(array: T[]) {
    const copied = [...array]
    for (let i = copied.length - 1; i > 0; i--){
        const j = Math.floor((Math.random() * (i + 1)))
        ;[copied[i], copied[j]] = [copied[j], copied[i]]
    }

    return copied
}