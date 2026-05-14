import { useState, type SubmitEvent } from 'react'
import type KnowledgeTestSettings from '@/types/KnowledgeTestSettings'

type Props = {
    onSubmitSettings: (settings: KnowledgeTestSettings) => void
}

export default function KnowledgeTestSetup({ onSubmitSettings }: Props) {
    const [fillGapCount, setFillGapCount] = useState(5)
    const [firstLetterCount, setFirstLetterCount] = useState(5)
    const [singleChoiceCount, setSingleChoiceCount] = useState(5)
    const [flashcardsSide, setFlashcardsSide] = useState("FRONT")

    const handleSubmit = (e: SubmitEvent) => {
        e.preventDefault()

        onSubmitSettings({
            fillGapCount,
            firstLetterCount,
            singleChoiceCount,
            flashcardsSide,
        })
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Podaj liczbę pytań z luką:
                <input
                    type="range"
                    value={fillGapCount}
                    min="0"
                    max="5"
                    onChange={(e) =>
                        setFillGapCount(Number(e.target.value))
                    }
                />
            </label>

            <label>
                Podaj liczbę pytań z luką, w których podana jest pierwsza litera odpowiedzi:
                <input
                    type="range"
                    value={firstLetterCount}
                    min="0"
                    max="5"
                    onChange={(e) =>
                        setFirstLetterCount(Number(e.target.value))
                    }
                />
            </label>

            <label>
                Podaj liczbę pytań jednokrotnego wyboru:
                <input
                    type="range"
                    value={singleChoiceCount}
                    min="0"
                    max="5"
                    onChange={(e) =>
                        setSingleChoiceCount(Number(e.target.value))
                    }
                />
            </label>

            <label htmlFor="flashcards-side">Wybierz stronę fiszek, której mają dotyczyć pytania:</label>

            <select
                id="flashcards-side"
                value={flashcardsSide}
                onChange={(e) =>setFlashcardsSide(e.target.value)}
            >
                <option value="FRONT">Przód</option>
                <option value="BACK">Tył</option>
            </select>

            <button type="submit">
                Rozpocznij
            </button>
        </form>
    )
}