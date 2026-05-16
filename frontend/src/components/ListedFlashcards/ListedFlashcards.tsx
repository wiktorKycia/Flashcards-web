import styles from './ListedFlashcards.module.scss'
import Container from '../Container'
import EditableFlashcard from '../EditableFlashcard'
import FlashcardsFilter from '../FlashcardsFilter'
import type FlashcardWithStar from '../../types/FlashcardWithStar'
import { useState } from 'react'

interface ListedFlashcardsProps {
    flashcards: FlashcardWithStar[]
    isUserLoggedIn: boolean
    isUserAuthor: boolean
}

export default function ListedFlashcards(props: ListedFlashcardsProps) {
    const [isStarredOnly, setIsStarredOnly] = useState<boolean>(false)

    function toggleIsStarred() {
        setIsStarredOnly((prevState) => !prevState)
    }

    function resetFilters() {
        setIsStarredOnly(false)
    }

    return (
        <div className={styles.ListedFlashcards}>
            <h2 className={styles.ListedFlashcardsHeading}>Flashcards</h2>
            <Container cssClassName={'container-borderless ' + styles.ListedFlashcardsFiltersContainer}>
                <FlashcardsFilter
                    buttonText={'Only starred'}
                    isSelected={isStarredOnly}
                    toggleFn={toggleIsStarred}
                />
                <button onClick={resetFilters}>Reset filters</button>
            </Container>
            <Container cssClassName={'container-vertical-borderless ' + styles.ListedFlashcardsFlashcardsContainer}>
                {props.flashcards.map((flashcard) => {
                    if (isStarredOnly && flashcard.isStarred)
                        return (
                            <EditableFlashcard
                                key={flashcard.database_id}
                                front={flashcard.front}
                                back={flashcard.back}
                                isStarred={flashcard.isStarred} // tu zawsze będzie true
                                isUserAuthor={props.isUserAuthor}
                                isUserLoggedIn={props.isUserLoggedIn}
                            />
                        )
                    else if (!isStarredOnly)
                        return (
                            <EditableFlashcard
                                key={flashcard.database_id}
                                front={flashcard.front}
                                back={flashcard.back}
                                isStarred={flashcard.isStarred}
                                isUserAuthor={props.isUserAuthor}
                                isUserLoggedIn={props.isUserLoggedIn}
                            />
                        )
                })}
            </Container>
        </div>
    )
}
