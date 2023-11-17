import { useRecoilValue } from "recoil"
import { activeCategoryTasksSelector } from "../../config/states"
import { task } from "../../types/taskapi"
import TaskItem from "./TaskItem"

export default function TaskList() {
    const activeCategoryTasks = useRecoilValue<task[]>(activeCategoryTasksSelector)


    return (
        <div>
          {activeCategoryTasks.map((task, key) => <TaskItem key={key} task={task}  />)}
        </div>
    )
}