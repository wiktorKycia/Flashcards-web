#!/bin/bash

name=$(basename -- "$1")

mkdir -p ./"$name"
# shellcheck disable=SC2164
cd ./"$name"

touch index.ts
echo "export {default} from './$name.tsx'" >> index.ts

touch "$name.module.scss"
echo "
.$name
{

}
" >> "$name.module.scss"

touch "$name.tsx"
echo "
import styles from './$name.module.scss'

export default function $name() {
    return (
        <div className={styles.$name}>

        </div>
    )
}
" >> "$name.tsx"

# shellcheck disable=SC2103
cd ..

if [ "$2" = "-ga" ]; then
    git add "$name/"
    exit 1
fi
