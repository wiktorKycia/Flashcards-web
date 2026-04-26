import ProfilePicture from "../ProfilePicture/ProfilePicture.tsx";
import {Link} from "react-router";
import type DisplayedPerson from '../../types/DisplayedPerson/DisplayedPerson.ts'
import styles from './Person.module.scss'

export default function Person(props: DisplayedPerson){
    return (
        <div className={styles.Person}>
            <div className={styles.PersonIcon}><ProfilePicture/></div>
            <div className={styles.PersonDescription}>
                <Link to={'/profile/'}><h3>{props.name}</h3></Link>
                {props.title && (
                    <p>{props.title}</p>
                )}
            </div>
        </div>
    )
}