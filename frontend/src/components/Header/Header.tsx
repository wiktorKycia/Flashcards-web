import HamburgerButton from "../HamburgerButton/HamburgerButton.tsx"
import Logo from '../Logo/Logo.tsx'
import SearchBar from '../SearchBar/SearchBar.tsx'
import ButtonAdd from '../ButtonAdd/ButtonAdd.tsx'
import ProfilePicture from "../ProfilePicture/ProfilePicture.tsx"

import styles from './Header.module.scss'

export default function Header() {


    return (
        <header className={styles.Header}>
            <div>
                <HamburgerButton/>
                <Logo/>
            </div>
            <SearchBar/>
            <div>
                <ButtonAdd/>
                <ProfilePicture/>
            </div>
        </header>
    )
}