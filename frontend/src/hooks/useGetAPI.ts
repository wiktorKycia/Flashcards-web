import { useQuery } from '@tanstack/react-query'

const getData = async (url: string) => {
    const response = await fetch(url, {
        method: 'GET'
    })

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
    }

    return response.json()
}

export const useGetAPI = (url: string) => {
    return useQuery({
        queryKey: ['data', url],
        queryFn: () => getData(url)
    })
}
