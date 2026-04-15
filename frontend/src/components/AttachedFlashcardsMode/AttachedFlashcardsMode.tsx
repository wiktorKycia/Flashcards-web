import BigFlashcard from "../BigFlashcard"

export default function AttachedFlashcardsMode() {
    return (
        <>
            <div>
                <BigFlashcard front="Front" back="Back"/> {/* oddzielny komponent na wielką fiszkę */}
            </div>
            <div>
                <label htmlFor="track_progress">Śledź postępy</label> {/*tylko dla użytkowników zalogowanych*/}
                <input type="checkbox" name="" id="track_progress"/>

                <button>left icon</button>
                <div>1 / 30</div>
                <button>right icon</button>

                <button>back</button> {/*tylko jak checkbox ze śledzeniem postępów jest zaznaczony*/}

                <button>change order</button> {/*takie tasowanie*/}
                <button>settings</button>
                <button>full screeen</button>
            </div>
        </>
    )
}