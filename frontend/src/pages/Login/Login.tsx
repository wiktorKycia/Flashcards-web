import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useAuth} from '@/context/AuthContext'
import { useLogin } from '@/hooks/useLogin.ts'

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
        <form onSubmit={handleSubmit}>
            <input type="text" onChange={e => setForm({...form, login: e.target.value})}/>
            <input type="password" onChange={e => setForm({...form, password: e.target.value})}/>
            <button type="submit">Login</button>
        </form>
    )
}