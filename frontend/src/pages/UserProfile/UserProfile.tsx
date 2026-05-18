import { Link, useParams } from 'react-router'
import styles from './UserProfile.module.scss'
// import { useSavedQuizzes } from '@/hooks/useSavedQuizzes.ts'
import { useAuth } from '@/context/AuthContext.tsx'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useLoggedInOnly } from '@/hooks/useLoggedInOnly'
import {useUserProfile} from "@/hooks/useUserProfile.ts";
import Container from "@/components/Container";


export default function UserProfile() {
    useLoggedInOnly()

    const userId: number = parseInt(useParams().id as string)

    const auth = useAuth()

    const isVisitingSelf = auth.user ? userId === auth.user.id : false
    const { data, isLoading, isError } = useUserProfile(userId, isVisitingSelf)
    console.log(data, isLoading, isError)

    if (!auth.user)
    {
        return <LoadingSpinner/>
    }

    return (
        <main className={styles.UserProfile}>
            {isError && <p style={{ color: 'var(--color-accent2)' }}>wystąpił błąd</p>}
            {isLoading && <LoadingSpinner />}

            {data && (
                <>
                    <h1>Profil użytkownika {data.name}</h1>
                    <h2>Utworzone quizy</h2>
                    <Container cssClassName={` ${styles.QuizContainer}`}>
                        {data.createdQuizzes.map((quiz) => (
                            <Link to={`/quiz/${quiz.id}`} key={quiz.id} className={styles.QuizItem}>
                                <h2>{quiz.name}</h2>
                                <p>{quiz.description}</p>
                            </Link>
                        ))}
                    </Container>

                    {isVisitingSelf && data.savedQuizzes &&(
                        <>
                            <h2>Zapisane quizy</h2>
                            <Container cssClassName={` ${styles.QuizContainer}`}>
                                {data.savedQuizzes.map((quiz) => (
                                    <Link to={`/quiz/${quiz.id}`} key={quiz.id} className={styles.QuizItem}>
                                        <h2>{quiz.name}</h2>
                                        <p>{quiz.description}</p>
                                    </Link>
                                ))}
                            </Container>
                        </>
                    )}
                </>
            )}
        </main>
    )
}
