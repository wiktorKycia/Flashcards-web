import { useState } from 'react'
import type KnowledgeTestSettings from '@/types/KnowledgeTestSettings'
import KnowledgeTestSetup from '@/components/KnowledgeTestSetup'

export default function KnowledgeTest() {
    const [settings, setSettings] = useState<KnowledgeTestSettings | null>(null)

    return (
        <>
            (!settings ? (
                <KnowledgeTestSetup onSubmitSettings={setSettings} />
            ) : (

            )
        </>
    )
}