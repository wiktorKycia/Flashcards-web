import BigFlashcard from '../BigFlashcard'
import { useState } from 'react'
import type Flashcard from '../../types/Flashcard.ts'
import { useAuth } from '@/context/AuthContext.tsx'
import styles from './AttachedFlashcardsMode.module.scss'
import Container from '@/components/Container'

interface AttachedFlashcardsModeProps {
    flashcards: Flashcard[]
}

export default function AttachedFlashcardsMode(
    props: AttachedFlashcardsModeProps
) {
    const [isTrackingProgress, setIsCheckingProgress] = useState<boolean>(false)
    const [flashcardsIterator, setFlashcardsIterator] = useState<number>(0)

    const [flashcards, setFlashcards] = useState<Array<Flashcard>>(
        props.flashcards
    )

    function handleShuffle() {
        const array = [...flashcards]
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[array[i], array[j]] = [array[j], array[i]]
        }
        setFlashcards(array)
        setFlashcardsIterator(0)
    }

    function handleIncrement() {
        if (flashcardsIterator < flashcards.length - 1) {
            setFlashcardsIterator((prevState) => prevState + 1)
        }
    }
    function handleDecrement() {
        if (flashcardsIterator > 0) {
            setFlashcardsIterator((prevState) => prevState - 1)
        }
    }

    const authInfo = useAuth()

    const isLoggedIn = !!authInfo.token

    return (
        <>
            <div>
                <BigFlashcard
                    front={flashcards[flashcardsIterator].front}
                    back={flashcards[flashcardsIterator].back}
                />
                {/* oddzielny komponent na wielką fiszkę */}
            </div>
            <div className={styles.Options}>
                <Container cssClassName={'container-positioner ' + styles.OptionsArrowsContainer}>
                    <button onClick={handleDecrement}>←</button>
                    <div className={styles.OptionsArrowsContainerIterator}>
                        {flashcardsIterator + 1} / {flashcards.length}
                    </div>
                    <button onClick={handleIncrement}>→</button>
                </Container>

                <Container cssClassName={'container-positioner ' + styles.OptionsContainer}>
                    {isLoggedIn && (
                        <div className={styles.TrackProgress}>
                            <label htmlFor="track_progress">Śledź postępy</label>
                            {/*tylko dla użytkowników zalogowanych*/}
                            <input
                                type="checkbox"
                                name="track_progress"
                                id="track_progress"
                                checked={isTrackingProgress}
                                onClick={() =>
                                    setIsCheckingProgress((prevState) => !prevState)
                                }
                            />
                        </div>
                    )}

                    {isTrackingProgress && (
                        <button className={styles.ButtonPrev}>previous</button> //*tylko jak checkbox ze śledzeniem postępów jest zaznaczony*/}
                    )}
                    <button onClick={handleShuffle} className={styles.ButtonShuffle}>change order</button>
                    {/*takie tasowanie*/}
                    <button className={styles.ButtonSettings}>settings</button>
                    <button className={styles.ButtonFullScreen}>full screeen</button>
                </Container>
            </div>
        </>
    )
}
