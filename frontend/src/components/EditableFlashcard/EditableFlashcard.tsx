import styles from './EditableFlashcard.module.scss'
import { useState } from 'react'
import Container from '@/components/Container'

interface EditableFlashcardProps {
    front: string
    back: string
    isStarred: boolean
    isUserLoggedIn: boolean
    isUserAuthor: boolean
}

export default function EditableFlashcard(props: EditableFlashcardProps) {
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [isStarred, setIsStarred] = useState<boolean>(props.isStarred)

    const [text1, setText1] = useState<string>(props.front)
    const [text2, setText2] = useState<string>(props.back)

    return (
        <Container>
            {isEditing ? (
                <input
                    type="text"
                    value={text1}
                    onChange={(event) => setText1(event.target.value)}
                />
            ) : (
                <div>{text1}</div>
            )}

            {isEditing ? (
                <input
                    type="text"
                    value={text2}
                    onChange={(event) => setText2(event.target.value)}
                />
            ) : (
                <div>{text2}</div>
            )}

            {props.isUserLoggedIn && (
                <button onClick={() => setIsStarred((prevState) => !prevState)}>
                    {isStarred ? '*' : '-'}
                </button>
            )}

            {props.isUserLoggedIn && props.isUserAuthor && (
                <button onClick={() => setIsEditing((prevState) => !prevState)}>
                    {isEditing ? 'Save' : 'Edit'}
                </button>
            )}
        </Container>
    )
}
