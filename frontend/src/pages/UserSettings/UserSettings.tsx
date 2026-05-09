import styles from './UserSettings.module.scss'
import { useAuth } from '@/context/AuthContext.tsx'
import { useNavigate } from 'react-router-dom'
import Container from '@/components/Container'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useSavedQuizzes } from '@/hooks/useSavedQuizzes.ts'
import { useEffect } from 'react'

export default function UserSettings() {
    const navigate = useNavigate()
    const auth = useAuth()

    const isLoggedIn = !!auth.token
    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login')
        }
    }, [isLoggedIn, navigate])

    const { data, isLoading, isError } = useSavedQuizzes(
        auth.user?.id as number
    )
    console.log(data)

    return (
        <div className={styles.UserSettings}>
            <h1>Hello {auth.user?.name}</h1>

            <div className={styles.ButtonGroup}>
                <button onClick={auth.logout}>Logout</button>
                <button>Reset password</button>
                <button>Edit username</button>
            </div>

            {isError && <p style={{ color: 'var(--color-accent2)' }}>wystąpił błąd</p>}
            {isLoading && <LoadingSpinner />}
            {data ? data.map((quiz) => (
                <Container key={quiz.id}>
                    <div className={styles.QuizItem}>
                        <h2>{quiz.name}</h2>
                        <p>{quiz.description}</p>
                    </div>
                </Container>
            )):null}
        </div>
    )
}
