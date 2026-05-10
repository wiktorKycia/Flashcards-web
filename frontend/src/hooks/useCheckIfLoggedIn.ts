import { useAuth } from '@/context/AuthContext.tsx'

export function useCheckIfLoggedIn() {
    const { token } = useAuth()
    return !!token
}