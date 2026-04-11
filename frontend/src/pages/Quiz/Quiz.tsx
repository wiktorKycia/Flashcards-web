import Header from '../../components/Header'
import Person from "../../components/Person";
import Container from '../../components/Container'
import AttachedFlashcardsMode from "../../components/AttachedFlashcardsMode";
import EditableFlashcard from "../../components/EditableFlashcard";
import ButtonTop from "../../components/ButtonTop";
import ToolBar from "../../components/ToolBar";
import styles from './Quiz.module.scss'

export default function Quiz() {
    return (
        <>
            <Header/>
            <main className={styles.Main}>
                <ToolBar/>
                <div className={styles.MainRight}>
                    <h1>Nazwa quizu</h1>
                    <Container cssClassName={"container-vertical-borderless"}>
                        <button>zapisz</button>
                        <button>udostępnij</button>
                        <button>edytuj</button>
                        <button>kopiuj</button>
                        <button>eksport do pliku</button>
                        <button>usuń</button>
                        {/* tutaj opcje: edytuj (twórca), kopiuj (zalogowany), eksport (wszyscy), usuń (twórca) */}
                    </Container>
                    <Container cssClassName={"container-vertical-borderless"}>
                        <button>fiszki</button>
                        <button>ucz się  </button>
                        <button>test</button>
                        <button>dopasowania</button>
                    </Container>
                    <Container>
                        <AttachedFlashcardsMode/>
                    </Container>
                    <Container cssClassName={"container-vertical-borderless"}>
                        <Person name={"John doe"} title={"author"}/>
                        <button>like</button>
                        <button>dislike</button>
                    </Container>
                    <Container>
                        <h2>Flashcards</h2>
                        <div>filters</div>
                    </Container>
                    <Container>
                        <EditableFlashcard side1={"hello"} side2={"world"} isStarred={false} isUserAuthor={true} isUserLoggedIn={true}/>
                    </Container>
                </div>
            </main>
            <ButtonTop/>
        </>
    )
}