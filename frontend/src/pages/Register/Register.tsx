import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '@/hooks/useRegister.ts'
import Header from '@/components/Header'
import ToolBar from '@/components/ToolBar'
import styles from './Register.module.scss'

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const navigate = useNavigate();

    const registerMutation = useRegister()


    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault()
        registerMutation.mutate({
            password: form.password,
            name: form.name,
            email: form.email
        }, {
            onSuccess: (data) => {
                console.log(data)
                navigate('/login')
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
                        <h2>Register</h2>
                        <input type="text" placeholder="login" onChange={e => setForm({...form, name: e.target.value})}/>
                        <input type="email" placeholder="email" onChange={e => setForm({...form, email: e.target.value})} />
                        <input type="password" placeholder="hasło" onChange={e => setForm({...form, password: e.target.value})} />
                        <button type="submit">Register</button>
                    </form>
                </div>
            </main>
        </>
    );
}