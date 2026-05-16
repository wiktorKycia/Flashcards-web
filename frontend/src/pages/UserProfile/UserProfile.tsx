import { useParams } from 'react-router'
import { useUserInfo } from '@/hooks/useUserInfo.ts'
import Container from '@/components/Container'
import styles from './UserProfile.module.scss'

export default function UserProfile() {
    const userId: number = parseInt(useParams().id as string)

    const { data } = useUserInfo(userId)

    return (
        <div className={styles.UserProfile}>
            {data && <h1>{data.name}</h1>}
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
        </div>
    )
}
