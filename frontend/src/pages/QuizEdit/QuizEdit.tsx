import styles from './QuizEdit.module.scss'
import ButtonTop from '@/components/ButtonTop'
import { useLoggedInOnly } from '@/hooks/useLoggedInOnly.ts'
import { useAuth } from '@/context/AuthContext.tsx'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router'
import { useQuizData } from '@/hooks/useQuizData.ts'
import { useEffect, useState } from 'react'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function QuizEdit(){
    useLoggedInOnly()
    const auth = useAuth()
    const navigate = useNavigate()

    const id: number = parseInt(useParams().id as string)
    const { data, isLoading, isError } = useQuizData(id)

    const [quizData, setQuizData] = useState(null)

    useEffect(() => {
        if (isLoading || isError) return
        if (!data?.quiz) return

        if (auth.user?.id !== data.quiz.authorId)
        {
            navigate(-1) // go back by one page
        }
        console.log(data)

        // localStorage.setItem("currentEditedQuiz", )
        if (!quizData) {
            setQuizData({
                flashcards: data.flashcards,
                quiz: data.quiz
            })
        }
    }, [auth.user?.id, data?.quiz, isLoading, isError, navigate, data])



    function handleButtonSave()
    {

    }

    return (
        <>
            <main className={styles.QuizCreate}>
                {isError && <div>wystąpił błąd</div>}
                {isLoading && <LoadingSpinner />}
                {!isError && !isLoading && data && (
                    <form className={styles.MainWrapper} onSubmit={handleButtonSave}>
                        <label htmlFor="quiz_name">Nazwa quizu:</label>
                        <input id="quiz_name" type="text" placeholder="Angielski, dział 2, lekcja 1" defaultValue={data.quiz.name}/>

                        <label htmlFor="quiz_description">Opis:</label>
                        <textarea id="quiz_description" defaultValue={data.quiz.description ?? ""} />


                    </form>
                )}
            </main>
            <ButtonTop/>
        </>
    )
}