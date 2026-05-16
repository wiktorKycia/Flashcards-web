import { Link } from 'react-router'
import logo from '@/assets/lingoSpark-logo.svg'
import styles from './Logo.module.scss'

export default function Logo() {
    return (
        <Link to={'/'} className={styles.Logo}>
            <img src={logo} alt="logo" />
        </Link>
    )
}
