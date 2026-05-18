import AsyncStorage from '@react-native-async-storage/async-storage'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

export interface LoggedInUser {
    id: number
    name: string
}

interface AuthContextType {
    token: string | null
    user: LoggedInUser | null
    login: (token: string, user: LoggedInUser) => Promise<void>
    logout: () => Promise<void>
    isReady: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEYS = {
    token: 'auth.token',
    userId: 'auth.userId',
    userName: 'auth.userName'
} as const

export default function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null)
    const [user, setUser] = useState<LoggedInUser | null>(null)
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        let isMounted = true

        const load = async () => {
            try {
                const entries = await AsyncStorage.getMany([
                    STORAGE_KEYS.token,
                    STORAGE_KEYS.userId,
                    STORAGE_KEYS.userName
                ])
                const storedToken = entries[STORAGE_KEYS.token] ?? null
                const storedUserId = entries[STORAGE_KEYS.userId]
                const storedUserName = entries[STORAGE_KEYS.userName]

                if (!isMounted) {
                    return
                }

                setToken(storedToken)
                if (storedUserId && storedUserName) {
                    setUser({ id: Number(storedUserId), name: storedUserName })
                } else {
                    setUser(null)
                }
            } finally {
                if (isMounted) {
                    setIsReady(true)
                }
            }
        }

        load()

        return () => {
            isMounted = false
        }
    }, [])

    const login = async (newToken: string, newUser: LoggedInUser) => {
        setToken(newToken)
        setUser(newUser)
        await AsyncStorage.setMany({
            [STORAGE_KEYS.token]: newToken,
            [STORAGE_KEYS.userId]: String(newUser.id),
            [STORAGE_KEYS.userName]: newUser.name
        })
    }

    const logout = async () => {
        setToken(null)
        setUser(null)
        await AsyncStorage.removeMany([
            STORAGE_KEYS.token,
            STORAGE_KEYS.userId,
            STORAGE_KEYS.userName
        ])
    }

    const value = useMemo(
        () => ({ token, user, login, logout, isReady }),
        [token, user, isReady]
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
    const ctx = useContext(AuthContext)
    if (!ctx) {
        throw new Error('useAuth must be used inside AuthProvider')
    }
    return ctx
}
