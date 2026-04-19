import { useMutation } from '@tanstack/react-query'

interface LoginVariables {
    password: string
    login: string
}

const login = async ({ login, password }: LoginVariables) => {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({login: login, password: password}),
        headers: {
            "Content-Type": "application/json"
        }
    })

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
    }

    return response.json()
}

export const useLogin = () => {
    return useMutation({
        mutationFn: login
    })
}