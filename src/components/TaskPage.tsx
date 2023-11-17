import { useState , useEffect, useRef} from "react";
import { Tabs, TabList, TabPanels, Tab, Box, Checkbox, Input, IconButton, Wrap, WrapItem, Spinner} from '@chakra-ui/react'
import { CheckIcon } from "@chakra-ui/icons";
import { taskCategory, task } from "../types/taskapi";
import { Task } from "../helpers/task";


const Taskobject = new Task('')
export default function TaskPage({access_token}: {access_token?: string}) {
  const [taskCategoryList, setTaskCategoryList] = useState<taskCategory[]>([])
  const [activeTaskCategory, setActiveTaskCategory] = useState<number>(-1)
  const TitleinputRef = useRef<HTMLInputElement>(null)
  const DescriptionInputRef = useRef<HTMLInputElement>(null)
  const [activeCategoryTasks, setActiveCategoryTasks] = useState<task[]>([])
  const [loading, setloading] = useState(true)
  
  useEffect(() => {
    Taskobject.setAccessToken(access_token || '')
    Taskobject.getTaskCategories().then((data) => {
      setTaskCategoryList(data)
      if (data.length > 0) setActiveTaskCategory(0)
      return data
    }).then(() => {
      Taskobject.getTasksByCategoryPosition(activeTaskCategory >= 0 ? activeTaskCategory : 0).then((data) => {
        setActiveCategoryTasks(data)
        setloading(false)
      })
    })

  }, []) 

  useEffect(() => {
    setloading(true)
    if (activeTaskCategory < 0) return;
    Taskobject.getTasksByCategoryPosition(activeTaskCategory).then((data) => {
      setActiveCategoryTasks(data)
      setloading(false)
    })
  }, [activeTaskCategory])

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

  const handleAddTask = async (e : React.FormEvent<HTMLFormElement>) => {
    console.log('adding task')
    e.preventDefault();
    if (!TitleinputRef.current) return;
    console.log(TitleinputRef.current.value)
    if (TitleinputRef.current.value === '') return;
    console.log('adding task 2' , activeTaskCategory)
    if (activeTaskCategory < 0) return;
    const newTask : task = {
            id: (activeCategoryTasks?.length ?? 0) + 1,
            name: TitleinputRef.current?.value || '',
            description: DescriptionInputRef.current?.value || '',
            dueDate: new Date(),
            completed: false
    }
    // preupdate the task state to reflect the change
    setActiveCategoryTasks(active => [newTask, ...active])
    clearInput()
    Taskobject.addToTask(newTask, taskCategoryList[activeTaskCategory].id)
      .then(() => { Taskobject.clearPositionCache(activeTaskCategory) })
      .then(() => {
      Taskobject.getTasksByCategoryPosition(activeTaskCategory).then((data) => {
        setActiveCategoryTasks(data)
      })
        .finally(() => {
          console.log('done adding')
        })
    })
        
  }

  function clearInput() {
    TitleinputRef.current!.value = ''
  }

  return (
    <div className="">
        <Tabs variant='soft-rounded' colorScheme='green' h='80%'>
          <TabList w="100%" overflowX="auto">
            {taskCategoryList.map((taskCategory, key) => (
              <Tab key={key} onClick={() => setActiveTaskCategory(key)}>
                {taskCategory?.name}
              </Tab>
            ))}
        </TabList>
        {
          loading ? <Box p={4} h='90%' display='flex' justifyContent='center' alignItems='center'>
            <Spinner size='xl' /> 
          </Box> : (
          <Box p={4} h='90%'>
            <TabPanels>
              {activeCategoryTasks.map((task, key) => (
                  <Box p="2" key={key}>
                    <Checkbox isChecked={task.completed} onChange={() => handleTaskCheck(task)}>{task.name}</Checkbox>
                  </Box>
              ))}
            { taskCategoryList.length > 0 && activeTaskCategory >= 0 &&
             (
                <form onSubmit={handleAddTask} >
                  <Wrap p="2" spacing="30px">
                      <WrapItem>         
                          <Input
                              w='auto'
                              display='inline-flex'
                              ref={TitleinputRef}
                              placeholder="Title"
                              />
                    </WrapItem>
                    {/* the description
                    <WrapItem>
                      <Input
                        w='auto'
                        display='inline-flex'
                        ref={DescriptionInputRef}
                        placeholder="Description"
                      />
                    </WrapItem> */}
                      {/* the due date */}
                      <WrapItem>           
                          <IconButton
                          isRound={true}
                          variant="solid"
                          colorScheme="teal"
                          aria-label="Done"
                          fontSize="20px"
                          icon={<CheckIcon />}
                          type='submit'
                          />
                      </WrapItem>
                  </Wrap>
                </form>
              )
            }
            </TabPanels>
            </Box>
          )
        }
        </Tabs>
    </div>
  );
}

