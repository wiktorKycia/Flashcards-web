import Person from '@/components/Person'
import Container from '@/components/Container'
import AttachedFlashcardsMode from '@/components/AttachedFlashcardsMode'
import ButtonTop from '@/components/ButtonTop'
import styles from './Quiz.module.scss'
import { useParams } from 'react-router'
import { useNavigate } from 'react-router-dom'
import ListedFlashcards from '@/components/ListedFlashcards'
import { useAuth } from '@/context/AuthContext.tsx'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useQuizData } from '@/hooks/useQuizData.ts'
import { useCheckIfLoggedIn } from '@/hooks/useCheckIfLoggedIn.ts'
import { useDeleteQuiz } from '@/hooks/useDeleteQuiz.ts'

export default function Quiz() {
    const id: number = parseInt(useParams().id as string)
    const navigate = useNavigate()
    const { data, isLoading, isError, error } = useQuizData(id)
    console.log(data, isLoading, isError, error)

    let isUserAuthor = true

    const auth = useAuth()
    const isLoggedIn = useCheckIfLoggedIn()
    const { isDeleting, deleteError, handleDeleteQuiz } = useDeleteQuiz()

    if (isLoggedIn && auth.user != null && data != undefined) {
        isUserAuthor = auth.user.id == data.quiz.authorId
    }

    async function handleDeleteQuizClick() {
        await handleDeleteQuiz({
            id,
            onSuccess: () => navigate('/')
        })
    }

    return (
        <>
            <main className={styles.Main}>
                {/*{isLoggedIn && (<ToolBar />)}*/}
                {isError && <div>wystąpił błąd</div>}
                {isLoading && <LoadingSpinner />}
                {!isLoading && !isError && data && (
                    <div className={styles.MainWrapper}>
                        <Container
                            cssClassName={'container-borderless ' + styles.MainTitleContainer}
                        >
                            <h1>{data.quiz.name || 'Quiz bez nazwy'}</h1>
                            {data.quiz.description && (
                                <p>{data.quiz.description}</p>
                            )}
                        </Container>
                        <Container cssClassName={'container-positioner ' + styles.MainOptionsContaier}>
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
                                        <button onClick={() => navigate(`/quiz/${id}/edit`)}>edytuj</button>
                                        <button onClick={handleDeleteQuizClick} disabled={isDeleting}>
                                            {isDeleting ? 'Usuwanie...' : 'usuń'}
                                        </button>
                                    </>
                                )}
                            </Container>
                            {deleteError && (
                                <div className={styles.StatusText}>{deleteError}</div>
                            )}
                            <Container
                                cssClassName={'container-borderless ' + styles.MainLearnOptions}
                            >
                                <button>ucz się</button>
                                <button>dopasowania</button>
                            </Container>
                        </Container>
                        <Container cssClassName={'container-borderless'}>
                            <AttachedFlashcardsMode
                                flashcards={data.flashcards.map((flashcard) => {
                                    return {
                                        front: flashcard.front,
                                        back: flashcard.back,
                                        langFront: data.quiz.frontLanguage,
                                        langBack: data.quiz.backLanguage
                                    }
                                })}
                            />
                        </Container>
                        <Container
                            cssClassName={'container-borderless ' + styles.MainAuthor}
                        >
                            <Person id={1} name={'John doe'} title={'author'} />
                            <Container cssClassName={'container-positioner ' + styles.MainAuthorLikeContainer}>
                                <button>like</button>
                                <button>dislike</button>
                            </Container>
                        </Container>
                        <ListedFlashcards
                            flashcards={data.flashcards.map((flashcard) => {
                                return {
                                    database_id: flashcard.id,
                                    langFront: data.quiz.frontLanguage,
                                    langBack: data.quiz.backLanguage,
                                    front: flashcard.front,
                                    back: flashcard.back,
                                    isStarred: false
                                }
                            })}
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
