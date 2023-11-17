import { Tab, TabList } from "@chakra-ui/react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { activeTaskCategoryState, taskCategoriesListSelector } from "../../config/states";
import { taskCategory } from "../../types/taskapi";

export default function TaskCategoryList() {
    const setActiveTaskCategory = useSetRecoilState<number>(activeTaskCategoryState)
    const taskCategoryList = useRecoilValue<taskCategory[]>(taskCategoriesListSelector)
    return (
        <TabList w="100%" overflowX="auto">
            {taskCategoryList.map((taskCategory, key) => (
              <Tab key={key} onClick={() => setActiveTaskCategory(key)}>
                {taskCategory?.name}
              </Tab>
            ))}
        </TabList>
    )
}