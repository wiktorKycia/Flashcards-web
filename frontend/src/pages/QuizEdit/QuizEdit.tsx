import styles from './QuizEdit.module.scss'
import ButtonTop from '@/components/ButtonTop'
import { useLoggedInOnly } from '@/hooks/useLoggedInOnly.ts'
import { useAuth } from '@/context/AuthContext.tsx'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router'
import { useQuizData } from '@/hooks/useQuizData.ts'
import { type SubmitEvent, useEffect, useState } from 'react'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useUpdateQuiz } from '@/hooks/useUpdateQuiz.ts'
import { useCreateFlashcard } from '@/hooks/useCreateFlashcard.ts'
import { useUpdateFlashcard } from '@/hooks/useUpdateFlashcard.ts'
import { useDeleteFlashcard } from '@/hooks/useDeleteFlashcard.ts'
import { useQueryClient } from '@tanstack/react-query'

interface DraftFlashcard {
    id?: number
    clientId: string
    front: string
    back: string
    starred: boolean
}

interface QuizDraft {
    quiz: {
        name: string
        description: string
        frontLanguage: string
        backLanguage: string
    }
    flashcards: DraftFlashcard[]
    removedFlashcardIds: number[]
}

function createClientId() {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export default function QuizEdit(){
    useLoggedInOnly()
    const auth = useAuth()
    const navigate = useNavigate()

    const id: number = parseInt(useParams().id as string)
    const { data, isLoading, isError } = useQuizData(id)

    const [draft, setDraft] = useState<QuizDraft | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [saveError, setSaveError] = useState<string | null>(null)
    const [saveMessage, setSaveMessage] = useState<string | null>(null)

    const updateQuiz = useUpdateQuiz()
    const createFlashcard = useCreateFlashcard()
    const updateFlashcard = useUpdateFlashcard()
    const deleteFlashcard = useDeleteFlashcard()
    const queryClient = useQueryClient()

    useEffect(() => {
        if (isLoading || isError) return
        if (!data?.quiz || !data?.flashcards) return

        if (auth.user?.id !== data.quiz.authorId)
        {
            navigate(-1) // go back by one page
            return
        }

        if (draft) return

        setDraft({
            quiz: {
                name: data.quiz.name ?? '',
                description: data.quiz.description ?? '',
                frontLanguage: data.quiz.frontLanguage ?? '',
                backLanguage: data.quiz.backLanguage ?? ''
            },
            flashcards: data.flashcards.map((flashcard) => ({
                id: flashcard.id,
                clientId: createClientId(),
                front: flashcard.front,
                back: flashcard.back,
                starred: flashcard.starred
            })),
            removedFlashcardIds: []
        })
    }, [auth.user?.id, data?.quiz, data?.flashcards, isLoading, isError, navigate, draft])

    function handleQuizFieldChange(field: 'name' | 'description' | 'frontLanguage' | 'backLanguage', value: string) {
        setDraft((prev) => {
            if (!prev) return prev
            return {
                ...prev,
                quiz: {
                    ...prev.quiz,
                    [field]: value
                }
            }
        })
    }

    function handleFlashcardChange(clientId: string, field: keyof DraftFlashcard, value: string) {
        setDraft((prev) => {
            if (!prev) return prev
            return {
                ...prev,
                flashcards: prev.flashcards.map((flashcard) =>
                    flashcard.clientId === clientId
                        ? { ...flashcard, [field]: value }
                        : flashcard
                )
            }
        })
    }

    function handleFlashcardRemove(clientId: string) {
        setDraft((prev) => {
            if (!prev) return prev
            const removed = prev.flashcards.find(
                (flashcard) => flashcard.clientId === clientId
            )
            const removedFlashcardIds = removed?.id
                ? Array.from(new Set([...prev.removedFlashcardIds, removed.id]))
                : prev.removedFlashcardIds

            return {
                ...prev,
                flashcards: prev.flashcards.filter(
                    (flashcard) => flashcard.clientId !== clientId
                ),
                removedFlashcardIds
            }
        })
    }

    function handleFlashcardAdd() {
        setDraft((prev) => {
            if (!prev) return prev
            return {
                ...prev,
                flashcards: [
                    ...prev.flashcards,
                    {
                        clientId: createClientId(),
                        front: '',
                        back: '',
                        starred: false
                    }
                ]
            }
        })
    }

    async function handleButtonSave(event: SubmitEvent<HTMLFormElement>)
    {
        event.preventDefault()
        if (!draft) return

        const name = draft.quiz.name.trim()
        const frontLanguage = draft.quiz.frontLanguage.trim()
        const backLanguage = draft.quiz.backLanguage.trim()
        if (!name || !frontLanguage || !backLanguage) {
            setSaveError('Uzupelnij nazwe quizu oraz oba jezyki')
            setSaveMessage(null)
            return
        }

        setIsSaving(true)
        setSaveError(null)
        setSaveMessage(null)

        try {
            const description = draft.quiz.description.trim()
            const quizPayload = {
                name,
                description: description.length ? description : null,
                frontLanguage,
                backLanguage
            }

            await updateQuiz.mutateAsync({
                id,
                ...quizPayload
            })

            const flashcardRequests = draft.flashcards.map((flashcard) => {
                if (flashcard.id) {
                    return updateFlashcard.mutateAsync({
                        id: flashcard.id,
                        starred: flashcard.starred,
                        front: flashcard.front,
                        back: flashcard.back
                    })
                }

                return createFlashcard.mutateAsync({
                    starred: flashcard.starred,
                    front: flashcard.front,
                    back: flashcard.back,
                    quizId: id
                })
            })

            const deleteRequests = draft.removedFlashcardIds.map((flashcardId) =>
                deleteFlashcard.mutateAsync({
                    id: flashcardId
                })
            )

            await Promise.all([...flashcardRequests, ...deleteRequests])

            await queryClient.invalidateQueries({
                queryKey: ['quiz', 'flashcards', 'quizAuthor', id]
            })

            setSaveMessage('Zapisano zmiany')
        } catch {
            setSaveError('Nie udalo sie zapisac zmian')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <>
            <main className={styles.QuizEdit}>
                {isError && (
                    <div className={styles.StatusText}>wystąpił błąd</div>
                )}
                {isLoading && <LoadingSpinner />}
                {!isError && !isLoading && draft && (
                    <form
                        className={styles.MainWrapper}
                        onSubmit={handleButtonSave}
                    >
                        <div className={styles.FieldGroup}>
                            <label htmlFor="quiz_name">Nazwa quizu:</label>
                            <input
                                id="quiz_name"
                                type="text"
                                placeholder="Angielski, dział 2, lekcja 1"
                                value={draft.quiz.name}
                                onChange={(event) =>
                                    handleQuizFieldChange(
                                        'name',
                                        event.target.value
                                    )
                                }
                            />
                        </div>

                        <div className={styles.FieldGroup}>
                            <label htmlFor="quiz_description">Opis:</label>
                            <textarea
                                id="quiz_description"
                                value={draft.quiz.description}
                                onChange={(event) =>
                                    handleQuizFieldChange(
                                        'description',
                                        event.target.value
                                    )
                                }
                                className={styles.DescriptionInput}
                            />
                        </div>

                        <div className={'container-horizontal-borderless'}>
                            <div className={styles.FieldGroup}>
                                <label htmlFor="quiz_front_language">
                                    Język przodu:
                                </label>
                                <input
                                    id="quiz_front_language"
                                    type="text"
                                    placeholder="en"
                                    value={draft.quiz.frontLanguage}
                                    onChange={(event) =>
                                        handleQuizFieldChange(
                                            'frontLanguage',
                                            event.target.value
                                        )
                                    }
                                />
                            </div>

                            <div className={styles.FieldGroup}>
                                <label htmlFor="quiz_back_language">
                                    Język tyłu:
                                </label>
                                <input
                                    id="quiz_back_language"
                                    type="text"
                                    placeholder="pl"
                                    value={draft.quiz.backLanguage}
                                    onChange={(event) =>
                                        handleQuizFieldChange(
                                            'backLanguage',
                                            event.target.value
                                        )
                                    }
                                />
                            </div>
                        </div>

                        <section className={styles.FlashcardsSection}>
                            <div className={styles.SectionHeader}>
                                <h2>Fiszki</h2>
                                <button
                                    type="button"
                                    onClick={handleFlashcardAdd}
                                    className={styles.AddButton}
                                >
                                    Dodaj fiszke
                                </button>
                            </div>

                            {draft.flashcards.map((flashcard) => (
                                <div
                                    key={flashcard.clientId}
                                    className={styles.FlashcardRow}
                                >
                                    <input
                                        type="text"
                                        placeholder={`Przód (${draft.quiz.frontLanguage})`}
                                        value={flashcard.front}
                                        onChange={(event) =>
                                            handleFlashcardChange(
                                                flashcard.clientId,
                                                'front',
                                                event.target.value
                                            )
                                        }
                                    />
                                    <input
                                        type="text"
                                        placeholder={`Tył (${draft.quiz.backLanguage})`}
                                        value={flashcard.back}
                                        onChange={(event) =>
                                            handleFlashcardChange(
                                                flashcard.clientId,
                                                'back',
                                                event.target.value
                                            )
                                        }
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleFlashcardRemove(
                                                flashcard.clientId
                                            )
                                        }
                                        className={styles.RemoveButton}
                                    >
                                        Usuń
                                    </button>
                                </div>
                            ))}
                        </section>

                        {saveError && (
                            <div className={styles.ErrorText}>{saveError}</div>
                        )}
                        {saveMessage && (
                            <div className={styles.SuccessText}>
                                {saveMessage}
                            </div>
                        )}

                        <div className={styles.FormActions}>
                            <button type="submit" disabled={isSaving}>
                                {isSaving ? 'Zapisywanie...' : 'Zapisz'}
                            </button>
                        </div>
                    </form>
                )}
            </main>
            <ButtonTop />
        </>
    )
}