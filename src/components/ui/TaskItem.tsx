import { DeleteIcon } from "@chakra-ui/icons";
import { Box, Checkbox, Flex, IconButton, Spinner } from "@chakra-ui/react";
import { task, taskCategory } from "../../types/taskapi";
import { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { taskObjectState, taskCategoriesListSelector, activeTaskCategorySelector, activeCategoryTasksState, messageState } from "../../config/states";


export default function TaskItem({ task }: { task: task }) {
    const [isHovered, setIsHovered] = useState(false);
    const Taskobject = useRecoilValue(taskObjectState) 
    const taskCategoryList: taskCategory[] = useRecoilValue<taskCategory[]>(taskCategoriesListSelector)
    const activeTaskCategory = useRecoilValue<number>(activeTaskCategorySelector)
    const setActiveCategoryTasks = useSetRecoilState(activeCategoryTasksState)
    const setToastMessage = useSetRecoilState(messageState)
    const [deleteIsClicked, setDeleteIsClicked] = useState(false)
    


    const handleTaskCheck = (task: task) => {
        Taskobject.markTask({ ...task, completed: !task.completed }, taskCategoryList[activeTaskCategory].id).then((d) => {
            if(!d) return console.log('task not updated')
            setToastMessage({title: !task.completed == true ? 'Task completed' : "Task Unchecked", type: !task.completed == true ? 'success' : 'info'});
            Taskobject.getTasksByCategoryPosition(activeTaskCategory).then(() => {
                setActiveCategoryTasks(active => {
                    return active.map((t) => {
                        if (t.id === task.id) return { ...t, completed: !t.completed }
                        return t
                    })
                })
            })
        }).finally(() => { Taskobject.clearPositionCache(activeTaskCategory) })
    }

    const handleTaskDelete = (task: task) => {
        setDeleteIsClicked(true)
        Taskobject.deleteTask(task, taskCategoryList[activeTaskCategory].id).then((d) => {
            if(d == null) throw new Error("Task not deleted")
            Taskobject.getTasksByCategoryPosition(activeTaskCategory).then(() => {
                setActiveCategoryTasks(active => {
                    return active.filter((t) => {
                        if (t.id != task.id) return t
                    })
                })
            })
        }).then(() => {
            Taskobject.clearPositionCache(activeTaskCategory)
            setToastMessage({
                title: "Task Deleted",
                type : "warning",
            })
        }).catch((err) => {
            setToastMessage({
                title: "Error",
                body:(err as Error).message,
                type : "warning",
            })
        }).finally(() => {
            setDeleteIsClicked(false)
        })
    }
        
    return (
        <Box p="2"  onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <Flex >
                <Checkbox isChecked={task.completed} onChange={() => handleTaskCheck(task)} paddingRight="1">
                    <Box w="90%" as="span" textDecoration={task.completed ? "line-through" : "none"}>
                        {task.name}
                    </Box>
                </Checkbox>
                <Box w="10%" as="span">
                    {deleteIsClicked ? <Spinner size={'sm'} /> : isHovered && (<IconButton
                        size='xs'
                        variant='outline'
                        ml="2"
                        aria-label="Delete task"
                        icon={<DeleteIcon />}
                        onClick={() => handleTaskDelete(task)}
                    />)
                    }
                </Box>
            </Flex> 
        </Box>
    )
}