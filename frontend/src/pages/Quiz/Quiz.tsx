import Person from '@/components/Person'
import Container from '@/components/Container'
import AttachedFlashcardsMode from '@/components/AttachedFlashcardsMode'
import ButtonTop from '@/components/ButtonTop'
// import ToolBar from '@/components/ToolBar'
import styles from './Quiz.module.scss'
import { useParams } from 'react-router'
import ListedFlashcards from '@/components/ListedFlashcards'
import { useAuth } from '@/context/AuthContext.tsx'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useQuizData } from '@/hooks/useQuizData.ts'

export default function Quiz() {
    const id: number = parseInt(useParams().id as string)
    const { data, isLoading, isError, error } = useQuizData(id)
    console.log(data, isLoading, isError, error)

    let isUserAuthor = false

    const authInfo = useAuth()

    const isLoggedIn = !!authInfo.token
    if (isLoggedIn && authInfo.user != null && data != undefined) {
        isUserAuthor = authInfo.user.id == data.quiz.authorId
    }

    return (
        <>
            <main className={styles.Main}>
                {/*{isLoggedIn && (<ToolBar />)}*/}
                {isError && <div>wystąpił błąd</div>}
                {isLoading && <LoadingSpinner />}
                {!isLoading && !isError && data && (
                    <div className={styles.MainRight}>
                        <h1>{data.quiz.name || 'Nazwa quizu'}</h1>
                        {data.quiz.description && (
                            <p>{data.quiz.description}</p>
                        )}
                        <Container
                            cssClassName={'container-borderless ' + styles.MainOptions}
                        >
                            <button>eksport do pliku</button>
                            <button>udostępnij</button>

                            {isLoggedIn && (
                                <>
                                    <button>zapisz</button>
                                    <button>kopiuj</button>
                                </>
                            )}
                            {isUserAuthor && (
                                <>
                                    <button>edytuj</button>
                                    <button>usuń</button>
                                </>
                            )}
                        </Container>
                        <Container
                            cssClassName={'container-borderless ' + styles.MainLearnOptions}
                        >
                            <button>ucz się</button>
                            <button>dopasowania</button>
                        </Container>
                        <Container>
                            <AttachedFlashcardsMode
                                flashcards={data.flashcards.map((flashcard) => {
                                    return {
                                        front: flashcard.side1,
                                        back: flashcard.side2,
                                        langFront: flashcard.language1,
                                        langBack: flashcard.language2
                                    }
                                })}
                            />
                        </Container>
                        <Container
                            cssClassName={'container-vertical-borderless'}
                        >
                            <Person name={'John doe'} title={'author'} />
                            <button>like</button>
                            <button>dislike</button>
                        </Container>
                        <ListedFlashcards
                            flashcards={data.flashcards.map((flashcard) => {
                                return {
                                    database_id: flashcard.id,
                                    langFront: flashcard.language1,
                                    langBack: flashcard.language2,
                                    front: flashcard.side1,
                                    back: flashcard.side2,
                                    isStarred: false
                                }
                            })}
                            // flashcards={[
                            //     {
                            //         database_id: 1,
                            //         front: 'front',
                            //         back: 'back',
                            //         langFront: 'english',
                            //         langBack: 'english',
                            //         isStarred: true
                            //     }
                            // ]}
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
