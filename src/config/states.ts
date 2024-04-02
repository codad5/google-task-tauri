import { atom, selector } from 'recoil';
import { UserProfile } from '../types/googleapis';
import { Task } from '../helpers/task';
import { task, taskCategory } from '../types/taskapi';
import { SettingsStore } from '../helpers/DBStores';
import settings from './settings';
import { get_access_token } from '../helpers/invoker';


// const loggedInState = atom({
//     key: 'loggedInState',
//     default: false,
// });

const attemptLoginState = atom({
    key: 'attemptLoginState',
    default: false,
});

const attemptLogoutState = atom({
    key: 'attemptLogoutState',
    default: false,
});
    
const userProfileState = atom<UserProfile | null>({
    key: 'userProfileState',
    default: null,
});

const accessTokenState = atom<string | null>({
    key: 'accessTokenState',
    default: get_access_token().then(value => value?.access_token ?? null).catch((err) => {
        console.error("accessTokenState error", err)
        return null
    })
});

const taskObjectState = atom<Task>({
    key: 'taskObjectState',
    default:  new Task(),
});

const activeTaskCategoryState = atom<number>({
    key: 'activeTaskCategoryState',
    default: SettingsStore.get<number>(settings.storage.constants.last_active_category).then(value => value ?? -1).catch(err => {
        console.error("activeTaskCategoryState error", err)
        return -1
    })
});

const activeCategoryTasksState = atom<task[]>({
    key: 'activeCategoryTasksState',
    default: [],
});

const taskCategoriesListState = atom<taskCategory[]>({
    key: 'taskCategoriesListState',
    default: [],
});

const messageState = atom<{ title: string, body?: string , type: "info" | "warning" | "success" | "error" | "loading" } | null>({
    key: 'messageState',
    default: null,
});
    
const authLoadingState = atom<boolean>({
    key: 'authLoading',
    default: false,
});

const isOnlineState = atom<boolean>({
    key: 'isOnlineStae', 
    default : navigator.onLine
})

const isOnlineSelector = selector({
    key: 'isOnlineSelector',
    get: () => navigator.onLine,
    set : ({set}) => set(isOnlineState, navigator.onLine)
})

const authLoadingSelector = selector({
    key: 'authLoadingSelector',
    get: ({ get }) => {
        const loading = get(authLoadingState);
        return loading;
    },
});


const loggedInSelector = selector({
    key: 'loggedInSelector',
    get: ({ get }) => {
        const loggedIn = get(userProfileState);
        const accessToken = get(accessTokenState);
        return loggedIn && loggedIn.email != null && loggedIn.email != "" && accessToken;
    },
});


const attemptLoginSelector = selector({
    key: 'attemptLoginSelector',
    get: ({ get }) => {
        const attemptLogin = get(attemptLoginState);
        return attemptLogin;
    },
});

const attemptLogoutSelector = selector({
    key: 'attemptLogoutSelector',
    get: ({ get }) => {
        const attemptLogout = get(attemptLogoutState);
        return attemptLogout;
    },
});

const userProfileSelector = selector({
    key: 'userSelector',
    get: ({ get }) => {
        const loggedIn = get(loggedInSelector);
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

const messageSelector = selector({
    key: 'messageSelector',
    get: ({ get }) => {
        const message = get(messageState);
        return message;
    },
});



export {
    // loggedInState,
    userProfileState,
    loggedInSelector,
    userProfileSelector,
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
    attemptLoginState,
    attemptLoginSelector,
    attemptLogoutState,
    attemptLogoutSelector,
    messageState,
    messageSelector,
    authLoadingState, 
    authLoadingSelector,
    isOnlineState,
    isOnlineSelector,
};