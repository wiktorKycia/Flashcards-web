import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useAuth} from '@/context/AuthContext'
import { useLogin } from '@/hooks/useLogin.ts'
import Header from '@/components/Header'
import ToolBar from '@/components/ToolBar'
import styles from './Login.module.scss'

export default function Login() {
    const [form, setForm] = useState({login: '', password: ''})
    const {login} = useAuth()
    const navigate = useNavigate()

    const loginMutation = useLogin()
    
    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault()
        loginMutation.mutate({
            login: form.login,
            password: form.password
        }, {
            onSuccess: (data) => {
                console.log(data)
                login(data.token)
                navigate('/')
            }
        })
    }
    
    return (
        <>
            <Header />
            <main className={styles.Main}>
                <ToolBar />
                <div className={styles.MainRight}>
                    <form onSubmit={handleSubmit} className={styles.FormContainer}>
                        <h2>Login</h2>
                        <input type="text" placeholder="login" onChange={e => setForm({...form, login: e.target.value})}/>
                        <input type="password" placeholder="hasło" onChange={e => setForm({...form, password: e.target.value})}/>
                        <button type="submit">Login</button>
                    </form>
                </div>
            </main>
        </>
    )
}