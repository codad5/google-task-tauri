import { useState , useEffect, useRef} from "react";
import { Tabs, TabList, TabPanels, Tab, Box, Checkbox, Input, IconButton, Wrap, WrapItem} from '@chakra-ui/react'
import { CheckIcon } from "@chakra-ui/icons";
import { taskCategory, task } from "../types/taskapi";
import { Task } from "../helpers/task";

const Taskobject  = new Task()

export default function TaskPage({access_token}: {access_token?: string}) {
  const [taskCategories, setTaskCategories] = useState<taskCategory[]>([])
  const [activeTaskCategory, setActiveTaskCategory] = useState<number>(0)
  const inputRef = useRef<HTMLInputElement>(null)
  Taskobject.setAccessToken(access_token || '')
  

  useEffect(() => {
    Taskobject.getTaskCategories().then(() => {
        Taskobject.getTasksByCategoryPosition(activeTaskCategory).then(() => {
          setTaskCategories(Taskobject.getTasks)
        })
      })
  console.log(taskCategories[activeTaskCategory], "active task category")
  }, [activeTaskCategory])

  //  on a task check update the current active task category and update the task
  const handleTaskCheck = (task: task) => {
    if (activeTaskCategory < 0) return;
    const old = taskCategories
    const newTaskCategory = old[activeTaskCategory]
    delete taskCategories[activeTaskCategory];
      const newTasks = newTaskCategory.tasks?.map((t) => {
        if (t.id === task.id) {
          t.completed = !t.completed
        }
        return t
      })
    newTaskCategory.tasks = newTasks;
    old[activeTaskCategory] = newTaskCategory
    Taskobject.markTask(task, newTaskCategory.id)
    setTaskCategories([...old])
    setActiveTaskCategory(old => old)
  }

  const handleAddTask = async (e : React.FormEvent<HTMLFormElement>) => {
        console.log('adding task')
        e.preventDefault();
        if (!inputRef.current) return;
        if (inputRef.current.value === '') return;
        if (activeTaskCategory < 0) return;
        const old = taskCategories
        const newTaskCategory = old[activeTaskCategory]
        delete taskCategories[activeTaskCategory];
        const newTask : task = {
            id: (newTaskCategory.tasks?.length ?? 0) + 1,
            name: inputRef.current?.value || '',
            description: '',
            dueDate: new Date(),
            completed: false
        }
        await Taskobject.addToTask(newTask, newTaskCategory.id)
        newTaskCategory.tasks?.push(newTask)
        old[activeTaskCategory] = newTaskCategory
        setTaskCategories([...old])
        setActiveTaskCategory(old => old)
    }



  return (
    <div className="">
        <Tabs variant='soft-rounded' colorScheme='green' h='80%'>
          <TabList w="100%" overflowX="auto">
            {taskCategories.map((taskCategory, key) => (
              <Tab key={key} onClick={() => setActiveTaskCategory(key)}>
                {taskCategory?.name}
              </Tab>
            ))}
          </TabList>
          <Box p={4} h='90%'>
            <TabPanels>
              {taskCategories.length > 0 && taskCategories[activeTaskCategory].tasks?.map((task, key) => (
                  <Box p="2" key={key}>
                    <Checkbox isChecked={task.completed} onChange={() => handleTaskCheck(task)}>{task.name}</Checkbox>
                  </Box>
              ))}
            {
              taskCategories[activeTaskCategory]?.tasks && (
                <form onSubmit={handleAddTask} >
                  <Wrap p="2" spacing="30px">
                      <WrapItem>         
                          <Input
                              w='auto'
                              display='inline-flex'
                              ref={inputRef}
                              />
                      </WrapItem>
                      <WrapItem>           
                          <IconButton
                          isRound={true}
                          variant="solid"
                          colorScheme="teal"
                          aria-label="Done"
                          fontSize="20px"
                          icon={<CheckIcon />}
                          />
                      </WrapItem>
                  </Wrap>
                </form>
              )
            }
            </TabPanels>
          </Box>
        </Tabs>
    </div>
  );
}

