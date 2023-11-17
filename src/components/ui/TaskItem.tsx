import { DeleteIcon } from "@chakra-ui/icons";
import { Box, Checkbox } from "@chakra-ui/react";
import { task } from "../../types/taskapi";


export default function TaskItem({ task, handleTaskCheck, key }: { task: task, handleTaskCheck: (task: task) => void, key: number }) {
    return (
        <Box p="2" key={key}>
            <Checkbox isChecked={task.completed} onChange={() => handleTaskCheck(task)}>{task.name} <DeleteIcon /></Checkbox>
        </Box>
    )
}