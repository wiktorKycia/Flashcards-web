import Header from '../../components/Header'
import Person from "../../components/Person";

export default function Quiz() {
    return (
        <>
            <Header/>
            <main>
                <aside>To jest tylko dla zalogowanych</aside>
                <div>
                    <div>
                        <h1>Nazwa quizu</h1>
                        <button>save</button>
                        <button>share</button>
                        <button>more options</button>
                        {/* tutaj opcje: edytuj (twórca), kopiuj (zalogowany), eksport (wszyscy), usuń (twórca) */}
                    </div>
                    <div>
                        <button>fiszki</button>
                        <button>ucz sie</button>
                        <button>test</button>
                        <button>dopasowania</button>
                    </div>
                    <div>
                        <button></button> {/* oddzielny komponent na wielką fiszkę */}
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
                    <div>
                        <Person name={"John doe"} title={"author"}/>
                        <button>like</button>
                        <button>dislike</button>
                    </div>
                    <div>
                        <h2>Flashcards</h2>
                        <div>filters</div>
                    </div>
                    <div> {/*container*/}
                        <div>
                            <div>lang1</div>
                            <div>lang2</div>
                            <div>star</div> {/*zalogowany*/}
                            <div>edit</div> {/*twórca*/}
                        </div>
                    </div>
                </div>
            </main>
            <button>go to top</button>
        </>
    )
}