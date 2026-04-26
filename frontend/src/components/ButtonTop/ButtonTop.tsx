import styles from './ButtonTop.module.scss'

export default function ButtonTop() {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <button className={styles.ButtonTop} onClick={scrollToTop} aria-label="Scroll to top">
            ↑
        </button>
    )
}

