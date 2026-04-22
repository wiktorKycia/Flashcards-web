import Header from '@/components/Header'
import Person from "@/components/Person";
import Container from '@/components/Container'
import AttachedFlashcardsMode from "@/components/AttachedFlashcardsMode";
import ButtonTop from "@/components/ButtonTop";
import ToolBar from "@/components/ToolBar";
import styles from './Quiz.module.scss'
import {useParams} from "react-router";
import ListedFlashcards from '@/components/ListedFlashcards'
import { useAuth } from '@/context/AuthContext.tsx'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useQuizData } from '@/hooks/useQuizData.ts'

export default function Quiz() {
    const id: number = parseInt(useParams().id as string)
    const { data, isLoading, isError } = useQuizData(id)
    console.log(data, isLoading, isError)

    let isUserAuthor = false

    const authInfo = useAuth()

    const isLoggedIn = !!authInfo.token
    if (isLoggedIn && authInfo.user != null && data != undefined)
    {
        isUserAuthor = authInfo.user.id == data.quiz.authorId
    }

    return (
        <>
            <Header />
            <main className={styles.Main}>
                <ToolBar />
                {isError && (
                    <div>wystąpił błąd</div>
                )}
                {isLoading && (
                    <LoadingSpinner/>
                )}
                {!isLoading && !isError && data && (
                    <div className={styles.MainRight}>
                        <h1>{data.quiz.name || 'Nazwa quizu'}</h1>
                        {data.quiz.description && (
                            <p>{data.quiz.description}</p>
                        )}
                        <Container cssClassName={'container-vertical-borderless'}>
                            <button>eksport do pliku</button>
                            <button>udostępnij</button>

                            {isLoggedIn && (
                                <>
                                    <button>zapisz</button>
                                    <button>kopiuj</button>
                                </>)
                            }
                            {isUserAuthor && (
                                <>
                                    <button>edytuj</button>
                                    <button>usuń</button>
                                </>
                            )}
                        </Container>
                        <Container cssClassName={'container-vertical-borderless'}>
                            <button>ucz się</button>
                            <button>dopasowania</button>
                        </Container>
                        <Container>
                            <AttachedFlashcardsMode />
                        </Container>
                        <Container cssClassName={'container-vertical-borderless'}>
                            <Person name={'John doe'} title={'author'} />
                            <button>like</button>
                            <button>dislike</button>
                        </Container>
                        <ListedFlashcards
                            flashcards={[
                                {
                                    database_id: 1,
                                    front: 'front',
                                    back: 'back',
                                    langFront: 'english',
                                    langBack: 'english',
                                    isStarred: true
                                }
                            ]}
                            isUserLoggedIn={isLoggedIn}
                            isUserAuthor={isUserAuthor}
                        />
                    </div>
                )}
            </main>
            <ButtonTop />
        </>
    )
}