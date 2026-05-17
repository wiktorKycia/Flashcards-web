import { Link, useParams } from 'react-router'
import { useUserInfo } from '@/hooks/useUserInfo.ts'
import Container from '@/components/Container'
import styles from './UserProfile.module.scss'
import { useSavedQuizzes } from '@/hooks/useSavedQuizzes.ts'
import { useAuth } from '@/context/AuthContext.tsx'
import LoadingSpinner from '@/components/LoadingSpinner'


export default function UserProfile() {
    useLoggedInOnly()

    const auth = useAuth()

    const userId: number = parseInt(useParams().id as string)

    const auth = useAuth()

    const userInfo = useUserInfo(userId)
    console.log(userInfo);
    

    // const { data, isLoading, isError } = useSavedQuizzes(
    //     auth.user?.id as number
    // )

    return (
        <div className={styles.UserProfile}>
            Hello world from user profile!
            visiting user id: {auth.user?.id}
            {/* {data && <h1>{data.name}</h1>}
            {data &&
                data.createdQuizzes.map((quiz) => (
                    <Container key={quiz.id}>
                        <div className={styles.QuizItem}>
                            <h2>{quiz.name}</h2>
                            <p>{quiz.description}</p>
                            <p>ID: {quiz.id}</p>
                        </div>
                    </Container>
                ))}
            


            {isError && <p style={{ color: 'var(--color-accent2)' }}>wystąpił błąd</p>}
            {isLoading && <LoadingSpinner />}
            {data && data.map((quiz) => (
                <Container key={quiz.id}>
                    <Link to={`/quiz/${quiz.id}`} className={styles.QuizItem}>
                        <h2>{quiz.name}</h2>
                        <p>{quiz.description}</p>
                    </Link>
                </Container>
            ))} */}

        </div>
    )
}
