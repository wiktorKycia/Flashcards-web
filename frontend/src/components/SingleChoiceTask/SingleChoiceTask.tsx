type TaskData = {
    task: {
        sentence: string
        phrase1: string
        phrase2: string
        phrase3: string
        correctAnswer: string
    }
    taskId: string
}

export default function SingleChoiceTask({ task, taskId }: TaskData) {
    return(
        <div>
            <p>
                {task.sentence.split(/_+/)[0]}
                <span />
                {task.sentence.split(/_+/)[1]}
            </p>

            <div>
                <label>
                    <input
                        type="radio"
                        name={`options-${taskId}`}
                        value={task.phrase1}
                    />
                    {task.phrase1}
                </label>

                <label>
                    <input
                        type="radio"
                        name={`options-${taskId}`}
                        value={task.phrase2}
                    />
                    {task.phrase2}
                </label>

                <label>
                    <input
                        type="radio"
                        name={`options-${taskId}`}
                        value={task.phrase2}
                    />
                    {task.phrase2}
                </label>
            </div>
        </div>
    )
}