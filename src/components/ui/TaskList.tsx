import { useRecoilState, useRecoilValue } from "recoil"
import { activeCategoryTasksState, activeTaskCategorySelector, taskCategoriesListSelector, taskObjectState } from "../../config/states"
import { DeleteIcon } from "@chakra-ui/icons"
import { Box, Checkbox } from "@chakra-ui/react"
import { task, taskCategory } from "../../types/taskapi"

export default function TaskList() {
    const Taskobject = useRecoilValue(taskObjectState) 
    const taskCategoryList = useRecoilValue<taskCategory[]>(taskCategoriesListSelector)
    const activeTaskCategory = useRecoilValue<number>(activeTaskCategorySelector)
    const [activeCategoryTasks, setActiveCategoryTasks] = useRecoilState<task[]>(activeCategoryTasksState)


    const handleTaskCheck = (task: task) => {
    Taskobject.markTask({...task, completed: !task.completed}, taskCategoryList[activeTaskCategory].id).then(() => {
      Taskobject.getTasksByCategoryPosition(activeTaskCategory).then(() => {
        setActiveCategoryTasks(active => {
          return active.map((t) => {
            if (t.id === task.id) return {...t, completed: !t.completed}
            return t
          })
        })
      })
    }).finally(() => { Taskobject.clearPositionCache(activeTaskCategory) })
  }

    return (
        <div>
            {activeCategoryTasks.map((task, key) => (
                  <Box p="2" key={key}>
                    <Checkbox isChecked={task.completed} onChange={() => handleTaskCheck(task)}>{task.name} <DeleteIcon /></Checkbox>
                  </Box>
              ))}
        </div>
    )
}