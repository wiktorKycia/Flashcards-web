export default async function resolvePromise<T>(response: Response): Promise<T>
{
    if (!response.ok)
    {
        throw Error(`HTTP ${response.status}`)
    }
    else
    {
        return await response.json() as T
    }
}