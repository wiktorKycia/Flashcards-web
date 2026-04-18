import { useMutation } from '@tanstack/react-query'

interface RegisterVariables {
    password: string
    name: string
    email: string
}

const register = async ({ password, name, email }: RegisterVariables) => {
    const response = await fetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({name: name, email: email, password: password}),
        headers: {
            "Content-Type": "application/json"
        }
    })

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
    }

    return response.json()
}

export const useRegister = () => {
    return useMutation({
        mutationFn: register
    })
}