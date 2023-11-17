import { readTextFile, writeTextFile } from "@tauri-apps/api/fs";
import axios from "axios";
import { task, taskCategory } from "../types/taskapi";
import { BaseDirectory } from "@tauri-apps/api/fs";
import { GlobalCacheManager } from "./cacher";
const DEFAULT_DIRECTORY = BaseDirectory.AppLocalData





class taskCategoryCacheManager extends GlobalCacheManager<taskCategory[]> {
    private tasklastUpdate: GlobalCacheManager<{ [key: string]: Date }> = new GlobalCacheManager<{ [key: string]: Date }>("tasklastUpdate");
    constructor() {
        super("taskCategoryList");
    }

    get() : taskCategory[] {
        return super.get() || [];
    }

    set(value: taskCategory[]) {
        super.set(value);
    }

    update(value: taskCategory[]) {
        super.update(value);
    }

    setTaskLastUpdate(positionOrCategoryID: number|string, date: Date) {
        const tasklastUpdate = { ...this.tasklastUpdate.get() , [positionOrCategoryID]: date };
        this.tasklastUpdate.update(tasklastUpdate);
    }

    getTaskLastUpdate(positionOrCategoryID: number|string) {
        return this.tasklastUpdate.get()?.[positionOrCategoryID] ?? null;
    }

    lastUpdate() {
        return super.lastUpdate();
    }

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

const cacheManager = new taskCategoryCacheManager();




export class Task {
    accessToken ?: string;
    baseUrl = "https://tasks.googleapis.com/tasks/v1";
    private tasksCategoryList: taskCategoryCacheManager = cacheManager;
    // lastUpdate: { [key: number|string]: Date } = {};

    constructor(accessToken ?: string) {
        this.accessToken = accessToken;
    }
    setAccessToken(accessToken: string) {
        this.accessToken = accessToken;
    }

    get getTasksCategoryList() {
        return this.tasksCategoryList.get();
    }

    async getTaskCategories() {
        try {
            if (!this.accessToken) throw new Error("Access token not found");
            let tasks = null;
            // check if online and get tasks from api
            if (navigator.onLine) {
                tasks = await this.getTasksFromApi(this.accessToken);
            } else {
                // get tasks from file
                tasks = await this.getTasksFromFile();
            }
            if (tasks) {
                this.tasksCategoryList.set(tasks.map((taskCategory) => {
                    // if category with same id exists, merge them
                    const existingCategory = this.tasksCategoryList.get()?.find((category) => category.id === taskCategory.id);
                    if (existingCategory) {
                        taskCategory.tasks = [...existingCategory.tasks || [], ...taskCategory.tasks || []];
                    }
                    return taskCategory;
                }))
            }
            return tasks;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async getTasksFromApi(accessToken: string) : Promise<taskCategory[]> {
        const url = `${this.baseUrl}/users/@me/lists`;
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
        await writeTextFile("tasks.json", tasks, { dir: DEFAULT_DIRECTORY });
    }

    async getTasksFromFile(): Promise<taskCategory[]> {
        const tasks = await readTextFile("tasks.json", { dir: DEFAULT_DIRECTORY });
        return JSON.parse(tasks);
    }

    async getTasksByCategoryPosition(position: number) {
        try {
            let tasks = null;
            let readfromfile = false;
            // if the lastTaskCategoryByPosition is less than 2 minutes, return the tasks
            let cacheLastUpdate = this.tasksCategoryList.getTaskLastUpdate(position);
            if (cacheLastUpdate && (new Date().getTime() - cacheLastUpdate.getTime()) < (45 * 1000)) {
            // if (this.lastUpdate[position] && (new Date().getTime() - this.lastUpdate[position].getTime()) < (45 * 1000)) {
                tasks = await this.getTasksByCategoryPositionFromFile(position);
                readfromfile = true;
            }
            else if (navigator.onLine) {
                tasks = await this.getTasksByCategoryPositionFromApi(position);
            } else {
                tasks = await this.getTasksByCategoryPositionFromFile(position);
                readfromfile = true;
            }
            // this.tasksCategoryList[position] = { ...this.tasksCategoryList[position], tasks };
            let newTask = this.tasksCategoryList.get();
            newTask[position] = { ...newTask[position], tasks };
            this.tasksCategoryList.update(newTask);
            console.log(this.tasksCategoryList, "this.tasks", "after if");
            if(!readfromfile) await this.saveTasksToFile();
            return tasks;
        } catch (error) {
            console.error("Error getting tasks by category position:", error);
            return [];
        }
    }

    async getTasksByCategoryPositionFromApi(position: number): Promise<task[]> {
        const taskCategory = this.tasksCategoryList.get()[position];
        if (!taskCategory) return [];
        const url = `${this.baseUrl}/lists/${taskCategory.id}/tasks`;
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
                completed: item.status === "completed",
            };
        });
        this.tasksCategoryList.setTaskLastUpdate(position, new Date());
        return tasks;
    }

    async getTasksByCategoryPositionFromFile(position: number): Promise<task[]> {
        const tasks = await readTextFile(`tasks.json`, { dir: DEFAULT_DIRECTORY });
        const taskCategories = JSON.parse(tasks);
        console.log(taskCategories, "taskCategories");
        return taskCategories[position].tasks;
    }

    async getTaskById(categoryID: string) {
        try {
            let task: task[] = []
            let readfromfile = false;
            
            // if the lastTaskCategoryByPosition is less than 2 minutes, return the tasks
            let cacheLastUpdate = this.tasksCategoryList.getTaskLastUpdate(categoryID);
            if (cacheLastUpdate && (new Date().getTime() - cacheLastUpdate.getTime()) < (45 * 1000)) { 
                task = await this.getTaskByIdFromFile(categoryID);
                readfromfile = true;
                // console.log("from file", task);
            }
            // check if online and get tasks from api
            else if (navigator.onLine) {
                task = await this.getTaskByIdFromApi(categoryID);
            } else {
                task = await this.getTaskByIdFromFile(categoryID);
                readfromfile = true;
            }
            let newTask = this.tasksCategoryList.get().map((taskCategory) => {
                if (taskCategory.id === categoryID) {
                    taskCategory.tasks = task;
                }
                return taskCategory;
            });
            this.tasksCategoryList.update(newTask);
            if(!readfromfile) await this.saveTasksToFile();
            return task;
        } catch (error) {
            // console.error(error);
            return null;
        }
    }

    async getTaskByIdFromApi(categoryID: string): Promise<task[]> {
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
        const tasks = await readTextFile(`tasks.json`, { dir: DEFAULT_DIRECTORY });
        const taskCategories = JSON.parse(tasks);
        return taskCategories.find((taskCategory: taskCategory) => taskCategory.id === categoryID).tasks;
    }

    async markTask(task: task, categoryID : string){
        // console.log(task.completed, "mark task");
        const url = `https://tasks.googleapis.com/tasks/v1/lists/${categoryID}/tasks/${task.id}`
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

    }

    async addToTask(task: task, categoryID: string) {
        const url = `https://tasks.googleapis.com/tasks/v1/lists/${categoryID}/tasks`
        const response = await axios.post(url, {
            title: task.name,
        }, {
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
            },
        });
        // console.log(response.data, "add task");
        return response.data;
    }

    async clearPositionCache(position: number) {
        console.log("clearing cache", position);
        this.tasksCategoryList.clearCache(position);
        return this
    }
}
