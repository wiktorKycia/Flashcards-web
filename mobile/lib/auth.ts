import { Platform } from 'react-native'

export const API_BASE_URL =
    Platform.OS === 'web'
        ? process.env.EXPO_PUBLIC_API_URL_WEB ?? 'http://localhost:3000'
        : process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000'

export interface LoginVariables {
    login: string
    password: string
}

export interface LoginResponse {
    token: string
    user: {
        id: number
        name: string
    }
}

export interface RegisterVariables {
    name: string
    email: string
    password: string
}

export async function loginUser({
    login,
    password
}: LoginVariables): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ login, password })
    })

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
    }

    return response.json() as Promise<LoginResponse>
}

export async function registerUser({
    name,
    email,
    password
}: RegisterVariables) {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
    })

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
    }

    return response.json()
}

