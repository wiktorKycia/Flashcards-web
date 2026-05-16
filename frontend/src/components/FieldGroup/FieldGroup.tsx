import styles from './FieldGroup.module.scss'
import type { ChangeEvent } from 'react'

interface FieldGroupProps {
    labelText: string,
    inputHTMLId: string,
    inputType: string,
    inputPlaceholder?: string,
    inputValue: string,
    onInputChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
    isVertical: boolean,
    useTextarea?: boolean
}


export default function FieldGroup(props: FieldGroupProps) {
    return (
        <div className={props.isVertical ? styles.FieldGroupVertical : styles.FieldGroupHorizontal}>
            <label htmlFor={props.inputHTMLId}>{props.labelText}</label>
            {props.useTextarea ? (
                <textarea
                    id={props.inputHTMLId}
                    placeholder={props.inputPlaceholder ?? ""}
                    onChange={props.onInputChange}
                >
                    {props.inputValue}
                </textarea>
                ) : (
                <input
                    id={props.inputHTMLId}
                    type={props.inputType}
                    placeholder={props.inputPlaceholder ?? ""}
                    value={props.inputValue}
                    onChange={props.onInputChange}
                />
            )}
        </div>
    )
}

