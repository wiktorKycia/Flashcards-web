import {useGetAPI} from "../../hooks/useGetAPI.ts";

export default function Home()
{
    const {data} = useGetAPI('/')

    return (
        <div>{data}</div>
    )
}