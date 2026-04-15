import BigFlashcard from "../BigFlashcard"
import {useState} from "react";
import type Flashcard from "../../types/Flashcard/Flashcard.ts";

interface AttachedFlashcardsModeProps {
    flashcards: Flashcard[]
}

export default function AttachedFlashcardsMode(props: AttachedFlashcardsModeProps) {
    const [isTrackingProgress, setIsCheckingProgress] = useState<boolean>(false);
    const [flashcardsIterator, setFlashcardsIterator] = useState<number>(0);



    function handleShuffle() {

    }

    return (
        <>
            <div>
                <BigFlashcard front={props.flashcards[flashcardsIterator].front} back={props.flashcards[flashcardsIterator].back}/> {/* oddzielny komponent na wielką fiszkę */}
            </div>
            <div>
                <label htmlFor="track_progress">Śledź postępy</label> {/*tylko dla użytkowników zalogowanych*/}
                <input type="checkbox" name="track_progress" id="track_progress" checked={isTrackingProgress} onClick={() => setIsCheckingProgress((prevState) => !prevState)}/>

                <button onClick={() => setFlashcardsIterator((prevState) => prevState+1)}>←</button>
                <div>{flashcardsIterator+1} / {props.flashcards.length}</div>
                <button onClick={() => setFlashcardsIterator((prevState) => prevState-1)}>→</button>

                {isTrackingProgress && (
                    <button>previous</button> //*tylko jak checkbox ze śledzeniem postępów jest zaznaczony*/}
                )}


                <button onClick={handleShuffle}>change order</button> {/*takie tasowanie*/}
                <button>settings</button>
                <button>full screeen</button>
            </div>
        </>
    )
}