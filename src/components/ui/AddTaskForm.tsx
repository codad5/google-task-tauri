
import { CheckIcon } from "@chakra-ui/icons";
import { Wrap, WrapItem, Input, IconButton } from "@chakra-ui/react";
import { useRef } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import { taskObjectState, taskCategoriesListSelector, activeTaskCategorySelector, activeCategoryTasksState } from "../../config/states";
import { taskCategory, task } from "../../types/taskapi";

const AddTaskForm = () => {
    const TitleinputRef = useRef<HTMLInputElement>(null)
    const DescriptionInputRef = useRef<HTMLInputElement>(null)


    const Taskobject = useRecoilValue(taskObjectState) 
    const taskCategoryList = useRecoilValue<taskCategory[]>(taskCategoriesListSelector)
    const activeTaskCategory = useRecoilValue<number>(activeTaskCategorySelector)
    const [activeCategoryTasks, setActiveCategoryTasks] = useRecoilState<task[]>(activeCategoryTasksState)

    const handleAddTask = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!TitleinputRef.current) return;
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
        clearForm()
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

    function clearForm() {
        TitleinputRef.current!.value = '';
        DescriptionInputRef.current!.value = '';
    }
    return (
        <form onSubmit={handleAddTask}>
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
    );
};

export default AddTaskForm;
