import BigFlashcard from "../BigFlashcard"
import {useState} from "react";
import type Flashcard from "../../types/Flashcard/Flashcard.ts";

// interface AttachedFlashcardsModeProps {
//     flashcards: Flashcard[]
// }

export default function AttachedFlashcardsMode() {
    const [isTrackingProgress, setIsCheckingProgress] = useState<boolean>(false);
    const [flashcardsIterator, setFlashcardsIterator] = useState<number>(0);

    const [flashcards, setFlashcards] = useState<Array<Flashcard>>([{
        front: "front",
        back: "back",
        langFront: "english",
        langBack: "english"
    }])

    function handleShuffle() {
        const array = [...flashcards];
        for (let i = array.length -1; i > 0; i--)
        {
            const j = Math.floor(Math.random() * (i+1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        setFlashcards(array);
        setFlashcardsIterator(0)
    }

    return (
        <>
            <div>
                <BigFlashcard front={flashcards[flashcardsIterator].front} back={flashcards[flashcardsIterator].back}/> {/* oddzielny komponent na wielką fiszkę */}
            </div>
            <div>
                <label htmlFor="track_progress">Śledź postępy</label> {/*tylko dla użytkowników zalogowanych*/}
                <input type="checkbox" name="track_progress" id="track_progress" checked={isTrackingProgress} onClick={() => setIsCheckingProgress((prevState) => !prevState)}/>

                <button onClick={() => setFlashcardsIterator((prevState) => prevState+1)}>←</button>
                <div>{flashcardsIterator+1} / {flashcards.length}</div>
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