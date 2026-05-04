import ProfilePicture from '../ProfilePicture/ProfilePicture.tsx'
import { Link } from 'react-router'
import styles from './Person.module.scss'

interface PersonProps {
    id: number
    name: string
    title: string | null
}

export default function Person(props: PersonProps) {
    return (
        <div className={styles.Person}>
            <ProfilePicture />
            <div className={styles.PersonDescription}>
                <h3>
                    <Link to={`/user/${props.id}`}>{props.name}</Link>
                </h3>
                {props.title && <p>{props.title}</p>}
            </div>
        </div>
    )
}
