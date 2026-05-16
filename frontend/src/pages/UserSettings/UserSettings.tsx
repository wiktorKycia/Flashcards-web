import styles from './UserSettings.module.scss'
import { useAuth } from '@/context/AuthContext.tsx'
import Container from '@/components/Container'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useSavedQuizzes } from '@/hooks/useSavedQuizzes.ts'
import { Link } from 'react-router'
import { useLoggedInOnly } from '@/hooks/useLoggedInOnly.ts'
import FieldGroup from '@/components/FieldGroup'
import type { ChangeEvent } from 'react'

export default function UserSettings() {
    useLoggedInOnly()

    const auth = useAuth()

    const { data, isLoading, isError } = useSavedQuizzes(
        auth.user?.id as number
    )
    console.log(data)

    return (
        <main className={styles.UserSettings}>
            <h1>Ustawienia użytkownika</h1>
            {auth.user?.name ? (
                <section className={styles.UserSettingsSection}>
                    <Container cssClassName={styles.UserSettingsLeft}>
                        <h2>Dane</h2>

                        <form>
                            <FieldGroup
                                labelText="Nazwa użytkownika"
                                inputHTMLId="input_username"
                                inputType="text"
                                inputValue={auth.user.name}
                                onInputChange={(event: ChangeEvent) => {
                                    console.log(event.target)}
                                }
                                isVertical={false}
                            />

                            <FieldGroup
                                labelText="Email"
                                inputHTMLId="input_email"
                                inputType="text"
                                inputValue={"email"}
                                onInputChange={(event: ChangeEvent) => {
                                    console.log(event.target)
                                }}
                                isVertical={false}
                            />
                        </form>
                    </Container>

                    <Container cssClassName={styles.UserSettingsRight}>
                        <h2>Akcje</h2>
                        <button onClick={auth.logout}>Wyloguj</button>
                        <button>Resetuj hasło</button>
                    </Container>
                </section>
            ):(
                <LoadingSpinner />
            )}
            {/*Move it to the user profile*/}
            {isError && <p style={{ color: 'var(--color-accent2)' }}>wystąpił błąd</p>}
            {isLoading && <LoadingSpinner />}
            {data && data.map((quiz) => (
                <Container key={quiz.id}>
                    <Link to={`/quiz/${quiz.id}`} className={styles.QuizItem}>
                        <h2>{quiz.name}</h2>
                        <p>{quiz.description}</p>
                    </Link>
                </Container>
            ))}

        </main>
    )
}
