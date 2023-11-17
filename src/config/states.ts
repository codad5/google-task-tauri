import { atom, selector } from 'recoil';
import { UserProfile } from '../types/googleapis';
import { Task, taskObject } from '../helpers/task';

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
    default:  taskObject
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


export {
    loggedInState,
    userProfileState,
    loggedInSelector,
    userSelector,
    accessTokenState,
    accessTokenSelector,
    taskObjectState,
    taskObjectSelector
};