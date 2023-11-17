import { DeleteIcon } from "@chakra-ui/icons";
import { Box, Checkbox, IconButton } from "@chakra-ui/react";
import { task } from "../../types/taskapi";
import { useState } from "react";


export default function TaskItem({ task, handleTaskCheck, key }: { task: task, handleTaskCheck: (task: task) => void, key: number }) {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <Box p="2" key={key} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <Checkbox isChecked={task.completed} onChange={() => handleTaskCheck(task)}>
                {task.name}
                {isHovered && (
                    <IconButton
                        ml="2"
                        aria-label="Delete task"
                        icon={<DeleteIcon />}
                        onClick={() => {
                        // Handle delete logic here
                        }}
                    />
                )}
            </Checkbox>
        </Box>
    )
}