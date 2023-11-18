import { useState , useEffect} from "react";
import { Tabs, TabPanels, Box, Spinner} from '@chakra-ui/react'
import { taskCategory, task } from "../types/taskapi";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { accessTokenSelector, activeCategoryTasksState, activeTaskCategoryState, taskObjectState, taskCategoriesListState, messageState } from "../config/states";
import { Task } from "../helpers/task";
import TaskList from "./ui/TaskList";
import AddTaskForm from "./ui/AddTaskForm";
import TaskCategoryList from "./ui/TaskCategoryList";



export default function TaskPage() {
  const [Taskobject, setTaskobject] = useRecoilState(taskObjectState)
  const access_token = useRecoilValue(accessTokenSelector)

  if (!access_token) return <div>Not logged in</div>
  

  const [taskCategoryList, setTaskCategoryList] = useRecoilState<taskCategory[]>(taskCategoriesListState)
  const [activeTaskCategory, setActiveTaskCategory] = useRecoilState<number>(activeTaskCategoryState)
  const setActiveCategoryTasks = useSetRecoilState<task[]>(activeCategoryTasksState)
  const [loading, setloading] = useState(true)
  const [toastMessage, setToastMessage] = useRecoilState(messageState)
  
  useEffect(() => {
    console.log('before task object', Taskobject, access_token)
    const newtaskObject = new Task(access_token)
    newtaskObject.setErrorHandler((err) => {
      console.log('error', err)
      if (toastMessage) return;
      setToastMessage({title: 'Error', body: err.message, type: 'error'})
    })
    setTaskobject(newtaskObject)
  }, [])
  

  useEffect(() => {
    console.log('after task object', Taskobject)
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
  }, [Taskobject])

  useEffect(() => {
    setloading(true)
    if (activeTaskCategory < 0) return;
    Taskobject.getTasksByCategoryPosition(activeTaskCategory).then((data) => {
      setActiveCategoryTasks(data)
      setloading(false)
    })
  }, [activeTaskCategory])


  return (
    <div className="">
        <Tabs variant='soft-rounded' colorScheme='green' h='80%'>
          <TaskCategoryList />
        {
          loading ? <Box p={4} h='90%' display='flex' justifyContent='center' alignItems='center'>
            <Spinner size='xl' /> 
          </Box> : (
          <Box p={4} h='90%'>
            <TabPanels>
              <TaskList />
            { taskCategoryList.length > 0 && activeTaskCategory >= 0 &&
             (
                <AddTaskForm />
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

