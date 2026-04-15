import styles from './BigFlashcard.module.scss'
import {useState} from "react";

interface BigFlashcardProps {
    front: string,
    back: string
}

export default function BigFlashcard(props: BigFlashcardProps) {
    const [isFront, setIsFront] = useState<boolean>(true);

    return (
        <div className={styles.BigFlashcardContainer}>
            <div
                className={`${styles.BigFlashcard} ${!isFront ? styles.flipped : ''}`}
                onClick={() => setIsFront((prevState) => !prevState)}
            >
                <div className={styles.BigFlashcardFront}>
                    {props.front}
                </div>
                <div className={styles.BigFlashcardBack}>
                    {props.back}
                </div>
            </div>
        </div>
    )
}

