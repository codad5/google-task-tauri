import { useState , useEffect, useRef} from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { Tabs, TabList, TabPanels, Tab, Box, Checkbox, Input, IconButton, Wrap, WrapItem} from '@chakra-ui/react'
import { CheckIcon } from "@chakra-ui/icons";


type task = {
  id:number,
  name: string,
  description: string,
  dueDate: Date,
  done: boolean
}
type taskCategory = {
  id:number,
  name: string,
  tasks: task[]
}

const sampleTaskCategories: taskCategory[] = [
  {
    id:1,
    name: 'Category 1',
    tasks: [
      {
        id:1,
        name: 'Task 1',
        description: 'This is task 1',
        dueDate: new Date(),
        done: false
      },
      {
        id:2,
        name: 'Task 2',
        description: 'This is task 2',
        dueDate: new Date(),
        done: false
      }
    ]
  },
  {
    id:2,
    name: 'Category 2',
    tasks: [
      {
        id:1,
        name: 'Task 1',
        description: 'This is task 1',
        dueDate: new Date(),
        done: false
      },
      {
        id:2,
        name: 'Task 2',
        description: 'This is task 2',
        dueDate: new Date(),
        done: false
      }
    ]
  }
]

export default function TaskPage() {
  const [taskCategories, setTaskCategories] = useState<taskCategory[]>([])
  const [activeTaskCategory, setActiveTaskCategory] = useState<number>(sampleTaskCategories[0].id)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setTaskCategories(sampleTaskCategories)
  }, [])

  //  on a task check update the current active task category and update the task
  const handleTaskCheck = (task: task) => {
    if (activeTaskCategory < 0) return;
    const old = taskCategories
    const newTaskCategory = old[activeTaskCategory]
    delete taskCategories[activeTaskCategory];
      const newTasks = newTaskCategory.tasks.map((t) => {
        if (t.id === task.id) {
          t.done = !t.done
        }
        return t
      })
    newTaskCategory.tasks = newTasks;
    old[activeTaskCategory] = newTaskCategory
    setTaskCategories([...old])
    setActiveTaskCategory(old => old)
  }

  const handleAddTask = (e) => {
    console.log("test");
        e.preventDefault();
        if (!inputRef.current) return;
        if (inputRef.current.value === '') return;
        if (activeTaskCategory < 0) return;
        const old = taskCategories
        const newTaskCategory = old[activeTaskCategory]
        delete taskCategories[activeTaskCategory];
    newTaskCategory.tasks.push({
            id: newTaskCategory.tasks.length + 1,
            name: inputRef.current?.value || '',
            description: '',
            dueDate: new Date(),
            done: false
        })
        old[activeTaskCategory] = newTaskCategory
        setTaskCategories([...old])
        setActiveTaskCategory(old => old)
    }

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    // setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <div className="">
        <Tabs variant='soft-rounded' colorScheme='green' h='80%'>
          <TabList w="100%" overflowX="auto">
            {taskCategories.map((taskCategory, key) => (
              <Tab key={key} onClick={() => setActiveTaskCategory(key)}>
                {taskCategory.name}
              </Tab>
            ))}
          </TabList>
          <Box p={4} h='90%'>
            <TabPanels>
              {taskCategories.length > 0 && taskCategories[activeTaskCategory].tasks.map((task) => (
                  <Box p="2">
                    <Checkbox isChecked={task.done} onChange={() => handleTaskCheck(task)}>{task.name}</Checkbox>
                  </Box>
              ))}
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
            </TabPanels>
          </Box>
        </Tabs>
    </div>
  );
}

