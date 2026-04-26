import styles from './ButtonAdd.module.scss'

export default function ButtonAdd() {
    return (
        <button className={styles.ButtonAdd}>
            +
            <span className={styles.TooltipText}>Add new quiz</span>
        </button>
    )
}