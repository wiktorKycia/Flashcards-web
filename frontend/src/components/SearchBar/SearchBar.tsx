import styles from './SearchBar.module.scss'

export default function SearchBar() {
    return (
        <div className={styles.SearchBar}>
            <input type="text" placeholder="Search for quizzez..." className={styles.SearchBarInput}/>
        </div>
    )
}