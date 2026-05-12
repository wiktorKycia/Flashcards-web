import { useState, type SubmitEvent } from 'react'
import type KnowledgeTestSettings from '@/types/KnowledgeTestSettings'

type Props = {
    onSubmitSettings: (settings: KnowledgeTestSettings) => void
}

export default function KnowledgeTestSetup({ onSubmitSettings }: Props) {
    const [fillGapCount, setFillGapCount] = useState(5)
    const [firstLetterCount, setFirstLetterCount] = useState(5)
    const [singleChoiceCount, setSingleChoiceCount] = useState(5)

    const handleSubmit = (e: SubmitEvent) => {
        e.preventDefault()

        onSubmitSettings({
            fillGapCount,
            firstLetterCount,
            singleChoiceCount,
        })
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="range"
                value={fillGapCount}
                min="0"
                max="5"
                onChange={(e) =>
                    setFillGapCount(Number(e.target.value))
                }
            />

            <input
                type="range"
                value={firstLetterCount}
                min="0"
                max="5"
                onChange={(e) =>
                    setFirstLetterCount(Number(e.target.value))
                }
            />

            <input
                type="range"
                value={singleChoiceCount}
                min="0"
                max="5"
                onChange={(e) =>
                    setSingleChoiceCount(Number(e.target.value))
                }
            />

            <button type="submit">
                Rozpocznij
            </button>
        </form>
    )
}