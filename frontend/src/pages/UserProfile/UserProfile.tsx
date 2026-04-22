import styles from './UserProfile.module.scss'
import { useParams } from 'react-router'
// import { useAuth } from '@/context/AuthContext.tsx'

export default function UserProfile() {
    // const isLoggedIn = !!useAuth().token
    const userId: number = parseInt(useParams().id as string)

    return (
        <div className={styles.UserProfile}>information about the user {userId}</div>
    )
}