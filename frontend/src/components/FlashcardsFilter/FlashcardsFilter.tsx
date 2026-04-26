import styles from './FlashcardsFilter.module.scss'

interface FlashcardsFilterProps {
    buttonText: string
    isSelected: boolean,
    toggleFn: () => void // typ przyjmujący 0 parametrów i zwracający void (czyli nic)
}

export default function FlashcardsFilter(props: FlashcardsFilterProps) {

    return (
        <div className={styles.FlashcardsFilter}>
            <button
                onClick={()=>props.toggleFn()}
                className={props.isSelected ? styles.selected: styles.notSelected}
            >
                {props.buttonText}
            </button>
        </div>
    )
}

