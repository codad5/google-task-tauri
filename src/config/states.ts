import { atom, selector } from 'recoil';
import { UserProfile } from '../types/googleapis';
import { Task } from '../helpers/task';
import { task, taskCategory } from '../types/taskapi';

const loggedInState = atom({
    key: 'loggedInState',
    default: false,
});
    
const userProfileState = atom<UserProfile | null>({
    key: 'userState',
    default: null,
});

const accessTokenState = atom<string | null>({
    key: 'accessTokenState',
    default: null,
});

const taskObjectState = atom<Task>({
    key: 'taskObjectState',
    default:  new Task(),
});

const activeTaskCategoryState = atom<number>({
    key: 'activeTaskCategoryState',
    default: -1,
});

const activeCategoryTasksState = atom<task[]>({
    key: 'activeCategoryTasksState',
    default: [],
});

const taskCategoriesListState = atom<taskCategory[]>({
    key: 'taskCategoriesListState',
    default: [],
});



const loggedInSelector = selector({
    key: 'loggedInSelector',
    get: ({ get }) => {
        const loggedIn = get(loggedInState);
        return loggedIn;
    },
});

const userSelector = selector({
    key: 'userSelector',
    get: ({ get }) => {
        const loggedIn = get(loggedInState);
        const user = get(userProfileState);
        return loggedIn && user;
    },
});


const accessTokenSelector = selector({
    key: 'accessTokenSelector',
    get: ({ get }) => {
        const accessToken = get(accessTokenState);
        return accessToken;
    },
});


const taskObjectSelector = selector({
    key: 'taskObjectSelector',
    get: ({ get }) => {
        const taskObject = get(taskObjectState);
        const accessToken = get(accessTokenState);
        taskObject.setAccessToken(accessToken!);
        return taskObject;
    },
});

const activeTaskCategorySelector = selector({
    key: 'activeTaskCategorySelector',
    get: ({ get }) => {
        const activeTaskCategory = get(activeTaskCategoryState);
        return activeTaskCategory;
    },
});

const activeCategoryTasksSelector = selector({
    key: 'activeCategoryTasksSelector',
    get: ({ get }) => {
        const activeCategoryTasks = get(activeCategoryTasksState);
        return activeCategoryTasks;
    },
});

const taskCategoriesListSelector = selector({
    key: 'taskCategoriesListSelector',
    get: ({ get }) => {
        const taskCategoriesList = get(taskCategoriesListState);
        return taskCategoriesList;
    },
});


export {
    loggedInState,
    userProfileState,
    loggedInSelector,
    userSelector,
    accessTokenState,
    accessTokenSelector,
    taskObjectState,
    taskObjectSelector,
    activeTaskCategoryState,
    activeTaskCategorySelector,
    activeCategoryTasksState,
    activeCategoryTasksSelector,
    taskCategoriesListState,
    taskCategoriesListSelector,

};