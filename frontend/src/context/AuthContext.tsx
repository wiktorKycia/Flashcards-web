import { createContext, useState, useContext, type ReactNode } from 'react'

interface AuthContextType {
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export default function AuthProvider({ children } : {children: ReactNode}) {
    const [token, setToken] = useState(localStorage.getItem('token'))

    function login(newToken: string)
    {
        localStorage.setItem('token', newToken)
        setToken(newToken)
    }

    function logout()
    {
        localStorage.removeItem('token')
        setToken(null)
    }

    return (
        <AuthContext.Provider value={{token, login, logout}}>
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