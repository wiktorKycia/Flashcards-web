import { createContext, useState, useContext, type ReactNode } from 'react'
import type LoggedInUser from '@/types/LoggedInUser.ts'

interface AuthContextType {
    token: string | null
    login: (token: string, user: LoggedInUser) => void
    logout: () => void
    user: LoggedInUser | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export default function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState(localStorage.getItem('token'))

    let u: LoggedInUser | null = null
    if (
        localStorage.getItem('userId') != null &&
        localStorage.getItem('userName') != null
    ) {
        u = {
            id: parseInt(localStorage.getItem('userId') as string),
            name: localStorage.getItem('userName') as string
        }
    }
    const [user, setUser] = useState<LoggedInUser | null>(u)

    function login(newToken: string, user: LoggedInUser) {
        localStorage.setItem('token', newToken)
        localStorage.setItem('userId', user.id as unknown as string)
        localStorage.setItem('userName', user.name)
        setToken(newToken)
        setUser(user)
    }

    function logout() {
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        localStorage.removeItem('userName')
        setToken(null)
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ token, login, logout, user }}>
            {children}
        </AuthContext.Provider>
    )
}
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
    return ctx
}
