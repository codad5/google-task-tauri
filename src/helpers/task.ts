import { readTextFile, writeTextFile } from "@tauri-apps/api/fs";
import axios from "axios";
import { task, taskCategory } from "../types/taskapi";
import { GlobalCacheManager } from "./cacher";
import settings from "../config/settings";
const DEFAULT_DIRECTORY = settings.fs.DEFAULT_DIRECTORY;
const TASKS_FILE = settings.storage.paths.tasks;
const TASK_ENDPOINT = settings.api.endpoints.TASKS;





/**
 * This is a class that helps to manage the cache of the task categories
 */
class TaskCategoryCacheManager extends GlobalCacheManager<taskCategory[]> {
    /**
     * This is a object that stores the last update of the tasks by position or category id
     */
    private tasklastUpdate: GlobalCacheManager<{ [key: string]: Date }> = new GlobalCacheManager<{ [key: string]: Date }>("tasklastUpdate");
    constructor() {
        super("taskCategoryList");
    }

    /**
     * This is a getter for the taskCategoryList
     * @returns taskCategory[]
     * @memberof TaskCategoryCacheManager 
     * @override
     */
    get() : taskCategory[] {
        return super.get() || [];
    }

    /**
     * This is a setter for the taskCategoryList
     * @param {taskCategory[]} value
     * @memberof TaskCategoryCacheManager 
     * @override
     */
    set(value: taskCategory[]) {
        super.set(value);
    }

    /**
     * This is a updater for the taskCategoryList
     * @param {taskCategory[]} value
     * @memberof TaskCategoryCacheManager 
     * @override
     */

    update(value: taskCategory[]) {
        super.update(value);
    }

    /**
     * This is a setter for the taskCategoryList
     * @param {taskCategory[]} value
     * @memberof TaskCategoryCacheManager 
     * @override
     */

    setTaskLastUpdate(positionOrCategoryID: number|string, date: Date) {
        const tasklastUpdate = { ...this.tasklastUpdate.get() , [positionOrCategoryID]: date };
        this.tasklastUpdate.update(tasklastUpdate);
    }

    /**
     * This is a getter for the taskCategoryList
     * @param {number|string} positionOrCategoryID
     * @returns Date | null
     * @memberof TaskCategoryCacheManager 
     * @override
     */

    getTaskLastUpdate(positionOrCategoryID: number|string) {
        return this.tasklastUpdate.get()?.[positionOrCategoryID] ?? null;
    }

    /**
     * This is a getter to get the last update of the taskCategoryList
     * @returns Date | null
     * @memberof TaskCategoryCacheManager 
     * @override
     */
    lastUpdate() {
        return super.lastUpdate();
    }

    /**
     * This is a method to clear the cache of the taskCategoryList
     * @param {number|string} positionOrCategoryID
     * @memberof TaskCategoryCacheManager 
     * @override
     */

    clearCache(positionOrCategoryID?: number | string) {
        if (positionOrCategoryID !== undefined) {
            const tasklastUpdate = this.tasklastUpdate.get();
            console.log(tasklastUpdate, "tasklastUpdate", positionOrCategoryID);
            delete tasklastUpdate[positionOrCategoryID];
            this.tasklastUpdate.update(tasklastUpdate);
        } else {
            super.clearCache();
            this.tasklastUpdate.clearCache();
        }
    }
}

/**
 * This is a instance of the TaskCategoryCacheManager 
 * @type {TaskCategoryCacheManager }
 */
const cacheManager = new TaskCategoryCacheManager();



/**
 * This is a class that helps to manage the tasks
 * @export
 * @class Task
 */
export class Task {
    /**
     * This is the access token of the user
     * @type {string}
     * @memberof Task
     * @private
     * @readonly
     * @default null
     * @todo make this private
     */
    accessToken?: string;
    /**
     * This is the base url of the api
     * @type {string}
     * @memberof Task
     * @private
     * @readonly
     * @default "https://tasks.googleapis.com/tasks/v1"
     * @todo make this private
     */
    baseUrl: string = TASK_ENDPOINT;
    /**
     * This is a object that stores the last update of the tasks by position or category id
     * @type {TaskCategoryCacheManager}
     * @memberof Task
     * @private
     * @readonly
     * @todo make this private
     */
    private tasksCategoryList: TaskCategoryCacheManager = cacheManager;

    private errorHandler: (error: Error) => void = () => {};
    // lastUpdate: { [key: number|string]: Date } = {};

    constructor(accessToken ?: string) {
        this.accessToken = accessToken;
    }


    /**
     * This is a setter for the error handler
     * @param {(error: Error) => void} errorHandler
     */

    setErrorHandler(errorHandler: (error: Error) => void) {
        this.errorHandler = errorHandler;
    }

    /**
     * This is a setter for the access token
     * @param {string} accessToken
     */

    setAccessToken(accessToken: string) {
        this.accessToken = accessToken;
    }

    /**
     * This is a to get the task categories
     * @returns {taskCategory[]}
     */

    get getTasksCategoryList() {
        return this.tasksCategoryList.get();
    }

    async getTaskCategories() {
        try {
            if (!this.accessToken) throw new Error("Access token not found");
            let tasks = navigator.onLine ? await this.getTasksFromApi(this.accessToken) : await this.getTasksFromFile();
            if (!tasks) tasks = []
            this.tasksCategoryList.set(tasks.map((taskCategory) => {
                // if category with same id exists, merge them
                const existingCategory = this.tasksCategoryList.get()?.find((category) => category?.id === taskCategory?.id);
                if (existingCategory) {
                    taskCategory.tasks = [...existingCategory.tasks || [], ...taskCategory.tasks || []];
                }
                return taskCategory;
            }))
            return tasks;
        } catch (error) {
            console.error("Error getting tasks:", error);
            this.errorHandler(error as Error);
            return [];
        }
    }

    async getTasksFromApi(accessToken: string) : Promise<taskCategory[]> {
        const url = `${this.baseUrl}/users/@me/lists`;
        if(!navigator.onLine) throw new Error("No internet connection");
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const taskCategories: taskCategory[] = response.data.items.map((item: any) => {
            return {
                id: item.id,
                name: item.title,
            };
        });
        return taskCategories;
    }

    async saveTasksToFile(taskCategories?: taskCategory[]) {
        const tobeSaved = taskCategories || this.tasksCategoryList.get();
        const tasks = JSON.stringify(tobeSaved);
        await writeTextFile(TASKS_FILE, tasks, { dir: DEFAULT_DIRECTORY });
    }

    async getTasksFromFile(): Promise<taskCategory[]> {
        const tasks = await readTextFile(TASKS_FILE, { dir: DEFAULT_DIRECTORY });
        // check if a valid json
        try {
            return JSON.parse(tasks);
        } catch (error) {
            console.error("Error parsing tasks:", error);
            return [];
        }
    }

    /// newly refactored 
    async getTasksByCategoryPosition(position: number) {
        try {
            const tasks = await this.retrieveTasksByCategoryPosition(position);
            this.updateTaskCategoryList(position, tasks);
            await this.saveTasksToFileIfNeeded(tasks?.length > 0);
            return tasks;
        } catch (error) {
            console.error("Error getting tasks by category position:", (error as Error).message);
            this.errorHandler(error as Error);
            return [];
        }
    }

    /**
     * Updates the task category list with the retrieved tasks for a specific position.
     * @param {number} position - The position of the category.
     * @param {task[]} tasks - The list of tasks.
     */
    updateTaskCategoryList(position: number, tasks: task[]) {
        const currentTaskList = this.tasksCategoryList.get();
        currentTaskList[position] = { ...currentTaskList[position], tasks };
        this.tasksCategoryList.update(currentTaskList);
    }

    /**
     * Saves tasks to the local file if needed.
     * @param {boolean} condition - The condition to determine if saving is needed.
     */
    async saveTasksToFileIfNeeded(condition: boolean) {
        if (condition) {
            await this.saveTasksToFile();
        }
    }



    /**
     * Retrieves tasks by category position from either the API or the local file.
     * @param {number} position - The position of the category.
     * @returns {task[]} - The list of tasks.
     */
    async retrieveTasksByCategoryPosition(position: number): Promise<task[]> {
        const cacheLastUpdate = this.tasksCategoryList.getTaskLastUpdate(position);
        const isCacheValid = cacheLastUpdate && ((new Date().getTime() - cacheLastUpdate.getTime()) < (45 * 1000)) || !navigator.onLine;

        if (isCacheValid) {
            return await this.getTasksByCategoryPositionFromFile(position);
        } else if (navigator.onLine) {
            return await this.getTasksByCategoryPositionFromApi(position);
        } else {
            return await this.getTasksByCategoryPositionFromFile(position);
        }
    }

    /**
     * Retrieves tasks by category ID from either the API or the local file.
     * @param {string} categoryID - The ID of the category.
     * @returns {task[]} - The list of tasks.
     */
    async retrieveTasksByCategoryID(categoryID: string): Promise<task[]> {
        const cacheLastUpdate = this.tasksCategoryList.getTaskLastUpdate(categoryID);
        const isCacheValid = cacheLastUpdate && ((new Date().getTime() - cacheLastUpdate.getTime()) < (45 * 1000) || !navigator.onLine);

        if (isCacheValid) {
            return await this.getTaskByIdFromFile(categoryID);
        } else if (navigator.onLine) {
            return await this.getTaskByIdFromApi(categoryID);
        } else {
            return await this.getTaskByIdFromFile(categoryID);
        }
    }


    async getTasksByCategoryPositionFromApi(position: number): Promise<task[]> {
        if(!navigator.onLine) throw new Error("No internet connection");
        const taskCategory = this.tasksCategoryList.get()[position];
        if (!taskCategory) throw new Error("Task category not found");
        const url = `${this.baseUrl}/lists/${taskCategory.id}/tasks`;
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
            },
        });
        const tasks: task[] = this.mapTasksFromApiResponse(response.data.items);
        this.tasksCategoryList.setTaskLastUpdate(position, new Date());
        return tasks;
    }

    /**
     * Maps tasks from API response.
     * @param {object[]} apiResponseItems - The items from the API response.
     * @returns {task[]} - The mapped tasks.
     */
    mapTasksFromApiResponse(apiResponseItems: object[]): task[] {
        return apiResponseItems.map((item: any) => ({
            id: item.id,
            name: item.title,
            description: item.notes,
            dueDate: item.due,
            completed: item.status === "completed",
        }));
    }


    /**
     * Gets tasks by category position from a local file.
     * @param {number} position - The position of the category.
     * @returns {task[]} - The list of tasks.
     */
    async getTasksByCategoryPositionFromFile(position: number): Promise<task[]> {
        const tasks = await readTextFile(TASKS_FILE, { dir: DEFAULT_DIRECTORY });
        const taskCategories = JSON.parse(tasks);
        return taskCategories[position].tasks;
    }

    async getTasksByCategoryID(categoryID: string) {
        try {
            let tasks: task[] = [];
            let readFromFile = false;

            tasks = await this.retrieveTasksByCategoryID(categoryID);

            this.updateTaskCategoryTasks(categoryID, tasks);
            await this.saveTasksToFileIfNeeded(!readFromFile);

            return tasks;
        } catch (error) {
            this.errorHandler(error as Error);
            return [];
        }
    }

    /**
     * Updates the tasks for a specific task category.
     * @param {string} categoryID - The ID of the task category.
     * @param {task[]} tasks - The tasks to update.
     */
    updateTaskCategoryTasks(categoryID: string, tasks: task[]) {
        const updatedTaskCategories = this.tasksCategoryList.get().map((taskCategory) => {
            if (taskCategory.id === categoryID) {
                taskCategory.tasks = tasks;
            }
            return taskCategory;
        });

        this.tasksCategoryList.update(updatedTaskCategories);
    }


    
    /// end of newly refactored


    async getTaskByIdFromApi(categoryID: string): Promise<task[]> {
        if(!navigator.onLine) throw new Error("No internet connection");
        const url = `${this.baseUrl}/lists/${categoryID}/tasks`;
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
            },
        });
        const tasks: task[] = response.data.items.map((item: any) => {
            return {
                id: item.id,
                name: item.title,
                description: item.notes,
                dueDate: item.due,
                completed: item.status !== "needsAction",
            };
        });
        this.tasksCategoryList.setTaskLastUpdate(categoryID, new Date());
        return tasks;
    }

    async getTaskByIdFromFile(categoryID: string): Promise<task[]> {
        const tasks = await readTextFile(TASKS_FILE, { dir: DEFAULT_DIRECTORY });
        const taskCategories = JSON.parse(tasks);
        return taskCategories.find((taskCategory: taskCategory) => taskCategory.id === categoryID).tasks;
    }

    async markTask(task: task, categoryID : string){
        // console.log(task.completed, "mark task");
        try {
            if(!navigator.onLine) throw new Error("No internet connection");
            const url = `${this.baseUrl}/lists/${categoryID}/tasks/${task.id}`
            const response = await axios.put(url, {
                id: task.id,
                title: task.name,
                status: task.completed ? "completed" : "needsAction",
            }, {
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                },
            });
            // console.log(response.data, "mark task");
            return response.data;
        } catch (error) {
            console.error(error);
            this.errorHandler(error as Error);
            return null;
        }

    }

    async addToTask(task: task, categoryID: string) {
        try {
            if(!navigator.onLine) throw new Error("No internet connection");
            const url = `${this.baseUrl}/lists/${categoryID}/tasks`
            const response = await axios.post(url, {
                title: task.name,
            }, {
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                },
            });
            // console.log(response.data, "add task");
            return response.data;
        } catch (error) {
            console.error(error);
            this.errorHandler(error as Error);
            return null;
        }
    }

    async deleteTask(task: task, categoryID: string) {
        try {
            if (!navigator.onLine) throw new Error("No internet connection");
            const url = `${this.baseUrl}/lists/${categoryID}/tasks/${task.id}`
            const response = await axios.delete(url, {
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                },
            });
            // console.log(response.data, "add task");
            return response.data;
        } catch (error) {
            console.error(error);
            this.errorHandler(error as Error);
            return null;
        }
    }

    async addNewTaskCategory(title: string) {
        try {
            if (!navigator.onLine) throw new Error("No internet connection");
            const url = `${this.baseUrl}/users/@me/lists`
            const response = await axios.post(url, {
                title,
            }, {
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                },
            });
            // console.log(response.data, "add task");
            return response.data;
        } catch (error) {
            console.error(error);
            this.errorHandler(error as Error);
            return null;
        }
    }


    async clearPositionCache(position: number) {
        console.log("clearing cache", position);
        this.tasksCategoryList.clearCache(position);
        return this
    }
}
