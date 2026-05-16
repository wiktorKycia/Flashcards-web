import styles from './ButtonAdd.module.scss'
import { Link } from 'react-router'

export default function ButtonAdd() {
    return (
        <>
            <Link to={'/quiz/create'} className={styles.ButtonAdd}> {/* TODO: dorobić stronę do tworzenia quizów */}
                +
            </Link>
            <span className={styles.TooltipText}>Add new quiz</span>
        </>
    )
}
