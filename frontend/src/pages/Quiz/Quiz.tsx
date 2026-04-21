import Header from '@/components/Header'
import Person from "@/components/Person";
import Container from '@/components/Container'
import AttachedFlashcardsMode from "@/components/AttachedFlashcardsMode";
import ButtonTop from "@/components/ButtonTop";
import ToolBar from "@/components/ToolBar";
import styles from './Quiz.module.scss'
import {useParams} from "react-router";
import {useGetAPI} from '@/hooks/useGetAPI.ts';
import ListedFlashcards from '@/components/ListedFlashcards'
import { useAuth } from '@/context/AuthContext.tsx'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function Quiz() {
    const id: number = parseInt(useParams().id as string)
    const {data, isLoading, isError} = useGetAPI(`/api/quizzes/${id}`)
    console.log(data, isLoading, isError)

    let isUserAuthor = false

    const isLoggedIn = !!useAuth().token
    if (isLoggedIn)
    {
        isUserAuthor = true; // tutaj w przyszłości dorobić zapytanie do backendu
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
                        <h1>{data.quizName || 'Nazwa quizu'}</h1>
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

                            {/* tutaj opcje: edytuj (twórca), kopiuj (zalogowany), eksport (wszyscy), usuń (twórca) */}
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
                            isUserLoggedIn={false}
                            isUserAuthor={false}
                        />
                    </div>
                )}
            </main>
            <ButtonTop />
        </>
    )
}