import type {ReactNode} from "react";
import styles from './Container.module.scss'

export default function Container({children, cssClassName}: { children: ReactNode, cssClassName?: string}) {
    return (
        <div className={cssClassName || styles.Container}>
            {children}
        </div>
    )
}