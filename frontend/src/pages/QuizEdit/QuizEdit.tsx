import styles from './QuizEdit.module.scss'
import ButtonTop from '@/components/ButtonTop'
import { useLoggedInOnly } from '@/hooks/useLoggedInOnly.ts'
import { useAuth } from '@/context/AuthContext.tsx'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router'
import { useQuizData } from '@/hooks/useQuizData.ts'

export default function QuizEdit(){
    useLoggedInOnly()
    const auth = useAuth()
    const navigate = useNavigate()

    const id: number = parseInt(useParams().id as string)
    const { data, isLoading, isError, error } = useQuizData(id)

    console.log(data, isLoading, isError, error)

    console.log(auth.user?.id, data?.quiz.authorId)
    if (auth.user?.id !== data?.quiz.authorId)
    {
        navigate(-1) // go back by one page
    }

    return (
        <>
            <main className={styles.QuizCreate}>

            </main>
            <ButtonTop/>
        </>
    )
}