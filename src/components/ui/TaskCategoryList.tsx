import { Tab, TabList } from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import { activeTaskCategoryState, taskCategoriesListSelector } from "../../config/states";
import { taskCategory } from "../../types/taskapi";

export default function TaskCategoryList() {
    const [activeTaskCategory, setActiveTaskCategory] = useRecoilState<number>(activeTaskCategoryState)
    const taskCategoryList = useRecoilValue<taskCategory[]>(taskCategoriesListSelector)
    return (
        <TabList w="100%" overflowX="auto" gap={2} px={2} py={1}  borderRadius="md" scrollBehavior="smooth" >
            {taskCategoryList.map((taskCategory, key) => (
              <Tab key={key} onClick={() => setActiveTaskCategory(key)} px={2} minW="100px" textAlign="center" py={0}  >
                {taskCategory?.name}
              </Tab>
            ))}
        </TabList>
    )
}