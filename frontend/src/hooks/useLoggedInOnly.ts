import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { NavigateFunction } from 'react-router'
import { useAuth } from '@/context/AuthContext.tsx'

export function useLoggedInOnly() {
    const navigate: NavigateFunction = useNavigate()
    const { token } = useAuth()

    useEffect(() => {
        if (!token) {
            navigate('/login')
        }
    }, [token, navigate])
}