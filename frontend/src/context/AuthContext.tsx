import { createContext, useState, useContext, type ReactNode } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children } : {children: ReactNode}) {
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
export const useAuth = () => useContext(AuthContext)