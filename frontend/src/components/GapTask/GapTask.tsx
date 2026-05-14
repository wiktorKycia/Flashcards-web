type TaskData = {
    task: {
        sentence: string
        phrase: string
    }
    taskId: string
}

export default function GapTask({ task, taskId }: TaskData) {
    const parts = task.sentence.split(/_+/)

    return (
        <div>
            <label
                htmlFor={`${taskId}-gap`}
            >
                Fill the gap
            </label>

            <p>
                {parts[0]}
                <input
                    id={`${taskId}-gap`}
                    type="text"
                />
                {parts[1]}
            </p>
        </div>
    )
}