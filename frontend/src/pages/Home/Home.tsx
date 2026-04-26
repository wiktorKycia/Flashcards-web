import {useGetAPI} from "../../hooks/useGetAPI.ts";
import Header from '../../components/Header'

export default function Home()
{
    const {data, isLoading, isError} = useGetAPI('http://localhost:3000/')

    console.log(data)

    return (
        <>
            <Header/>
            {isLoading && (
                <div>Loading</div>
            )}
            {isError && (
                <div>Error</div>
            )}
            {!isLoading && !isError && data && (
                <div>{data.content}</div>
            )}
        </>

    )
}