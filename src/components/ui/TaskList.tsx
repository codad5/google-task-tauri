import { useRecoilValue } from "recoil"
import { activeCategoryTasksSelector } from "../../config/states"
import { task } from "../../types/taskapi"
import TaskItem from "./TaskItem"
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Center } from "@chakra-ui/react"

export default function TaskList() {
    const activeCategoryTasks = useRecoilValue<task[]>(activeCategoryTasksSelector)

    const unCompletedTasks = activeCategoryTasks.filter(task => !task.completed)
    const CompletedTasks = activeCategoryTasks.filter(task => task.completed)


  return (
    <Accordion defaultIndex={[0]} allowToggle>
      <AccordionItem>
        <AccordionButton _expanded={{ bg: 'teal', color: 'white' }} >
        <Box as="span" flex='1' textAlign='left'>
          UnCompleted 
        </Box>
        <AccordionIcon />
        </AccordionButton>
        <AccordionPanel pb={4}>
          <Box>
            {unCompletedTasks.length > 0 ? unCompletedTasks.map((task, key) => <TaskItem key={key} task={task} />) : <Center h="40vh">Congrate you completed all your task</Center>}
          </Box>
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem>
        <AccordionButton>
        <Box as="span" flex='1' textAlign='left'>
          Completed 
        </Box>
        <AccordionIcon />
        </AccordionButton>
        <AccordionPanel pb={4}>
          <Box>
          {CompletedTasks.map((task, key) => <TaskItem key={key} task={task} />)}
          </Box>
        </AccordionPanel>
      </AccordionItem>
      </Accordion>
    )
}