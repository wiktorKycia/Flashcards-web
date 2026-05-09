import { Link } from 'react-router'
import profileLogo from '@/assets/placeholder-profile-picture-1.png'
import styles from './ProfilePicture.module.scss'

export default function ProfilePicture() {
    return (
        <Link to={'/user/'} className={styles.ProfilePicture}>
            <img
                className={styles.ProfilePicture}
                src={profileLogo}
                alt="profile picture"
            />
        </Link>
    )
}

