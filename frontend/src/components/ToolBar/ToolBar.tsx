import styles from './ToolBar.module.scss'
import {Link} from "react-router";
import Container from "../Container";

export default function ToolBar() {
    return (
        <aside className={styles.ToolBar}>
            <h3><Link to={'/'}>Strona główna</Link></h3>
            <h3>Zasoby</h3>
            <h3>Ostatnie quizy</h3>
            <Container>
                <div>quiz1</div>
            </Container>
            <h3>Ostatnie foldery</h3>
            <Container>
                <div>folder1</div>
            </Container>
        </aside>
    )
}

