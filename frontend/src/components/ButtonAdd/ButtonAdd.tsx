import styles from './ButtonAdd.module.scss'
import useCreateQuiz from '@/hooks/useCreateQuiz.ts'
import {useAuth} from "@/context/AuthContext.tsx";
import {useNavigate} from "react-router-dom";

export default function ButtonAdd() {
    const navigate = useNavigate()
    const auth = useAuth()
    const createQuiz = useCreateQuiz()

    async function handleButtonOnClick(){
        if(!auth.user)
        {
            navigate('/login')
            return
        }

        const authorId = auth.user.id

        createQuiz.mutate(
            authorId,
            {
                onSuccess: (createdQuiz) => {
                    console.log(createdQuiz)
                    navigate(`/quiz/${createdQuiz.id}/edit`)
                }
            }
        )
    }

    return (
        <>
            <button onClick={handleButtonOnClick} className={styles.ButtonAdd}>
                +
            </button>
            <span className={styles.TooltipText}>Add new quiz</span>
        </>
    )
}
