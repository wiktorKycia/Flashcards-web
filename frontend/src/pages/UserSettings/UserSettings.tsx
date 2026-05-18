import styles from './UserSettings.module.scss'
import { useAuth } from '@/context/AuthContext.tsx'
import Container from '@/components/Container'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useLoggedInOnly } from '@/hooks/useLoggedInOnly.ts'
import FieldGroup from '@/components/FieldGroup'
import type { ChangeEvent } from 'react'
import { useNavigate } from 'react-router'

export default function UserSettings() {
    useLoggedInOnly()

    const navigate = useNavigate()

    const auth = useAuth()
    const user = auth.user

    if (!user)
    {
        return <LoadingSpinner/>
    }

    return (
        <main className={styles.UserSettings}>
            <h1>Ustawienia użytkownika</h1>
            <section className={styles.UserSettingsSection}>
                <Container cssClassName={styles.UserSettingsLeft}>
                    <h2>Dane</h2>

                    <form>
                        <FieldGroup
                            labelText="Nazwa użytkownika"
                            inputHTMLId="input_username"
                            inputType="text"
                            inputValue={user.name}
                            onInputChange={(event: ChangeEvent) => {
                                console.log(event.target)
                            }}
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
                    {user.id && (
                        <button onClick={() => navigate(`/user/${user.id}`)}>Zobacz profil</button>
                    )}
                </Container>
            </section>
        </main>
    )
}
