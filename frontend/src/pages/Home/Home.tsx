import { useGetAPI } from '../../hooks/useGetAPI.ts'

export default function Home() {
    const { data, isLoading, isError } = useGetAPI('http://localhost:3000/')

    console.log(data)

    return (
        <>
            {isLoading && <div>Loading</div>}
            {isError && <div>Error</div>}
            {!isLoading && !isError && data && <div>{data.content}</div>}
        </>
    )
}
