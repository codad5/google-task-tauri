import { useRecoilState, useRecoilValue } from "recoil"
import { activeCategoryTasksState, activeTaskCategorySelector, taskCategoriesListSelector, taskObjectState } from "../../config/states"
import { DeleteIcon } from "@chakra-ui/icons"
import { Box, Checkbox } from "@chakra-ui/react"
import { task, taskCategory } from "../../types/taskapi"
import TaskItem from "./TaskItem"

export default function TaskList() {
    const Taskobject = useRecoilValue(taskObjectState) 
    const taskCategoryList = useRecoilValue<taskCategory[]>(taskCategoriesListSelector)
    const activeTaskCategory = useRecoilValue<number>(activeTaskCategorySelector)
    const [activeCategoryTasks, setActiveCategoryTasks] = useRecoilState<task[]>(activeCategoryTasksState)


    return (
        <div>
          {activeCategoryTasks.map((task, key) => <TaskItem key={key} task={task}  />)}
        </div>
    )
}