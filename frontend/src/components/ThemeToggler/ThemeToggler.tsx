import styles from './ThemeToggler.module.scss'

interface ThemeTogglerProps
{
    toggleFn: () => void
    isLight: boolean
}

export default function ThemeToggler(props: ThemeTogglerProps) {
    return (
        <button
            className={`${styles.ThemeToggler} ${props.isLight ? styles.light : styles.dark}`}
            onClick={props.toggleFn}
        >
            <div className={`${styles.dot} ${props.isLight ? styles.dotLeft : styles.dotRight}`} />
        </button>
    )
}

