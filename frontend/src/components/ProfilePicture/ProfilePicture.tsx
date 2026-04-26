import {Link} from 'react-router'

export default function ProfilePicture() {
    return (
        <Link to={"/profile/"}>
            <img src="../../assets/placeholder-profile-picture-1.jpg" alt="profile picture" />
        </Link>
    )
}