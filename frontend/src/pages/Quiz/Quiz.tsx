import Header from '../../components/Header'
import Person from "../../components/Person";
import Container from '../../components/Container'
import AttachedFlashcardsMode from "../../components/AttachedFlashcardsMode";

export default function Quiz() {
    return (
        <>
            <Header/>
            <main>
                <aside>To jest tylko dla zalogowanych</aside>
                <div>
                    <Container>
                        <h1>Nazwa quizu</h1>
                        <button>save</button>
                        <button>share</button>
                        <button>more options</button>
                        {/* tutaj opcje: edytuj (twórca), kopiuj (zalogowany), eksport (wszyscy), usuń (twórca) */}
                    </Container>
                    <Container>
                        <button>fiszki</button>
                        <button>ucz sie</button>
                        <button>test</button>
                        <button>dopasowania</button>
                    </Container>
                    <Container>
                        <AttachedFlashcardsMode/>
                    </Container>
                    <Container>
                        <Person name={"John doe"} title={"author"}/>
                        <button>like</button>
                        <button>dislike</button>
                    </Container>
                    <Container>
                        <h2>Flashcards</h2>
                        <div>filters</div>
                    </Container>
                    <Container>
                        <div>
                            <div>lang1</div>
                            <div>lang2</div>
                            <div>star</div> {/*zalogowany*/}
                            <div>edit</div> {/*twórca*/}
                        </div>
                    </Container>
                </div>
            </main>
            <button>go to top</button>
        </>
    )
}