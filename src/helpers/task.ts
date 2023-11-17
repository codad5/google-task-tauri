import { readTextFile, writeTextFile } from "@tauri-apps/api/fs";
import axios from "axios";
import { task, taskCategory } from "../types/taskapi";
import { BaseDirectory } from "@tauri-apps/api/fs";
const DEFAULT_DIRECTORY = BaseDirectory.AppLocalData
class Task {
    accessToken ?: string;
    baseUrl = "https://tasks.googleapis.com/tasks/v1";
    private tasksCategoryList: taskCategory[] = [];
    lastUpdate: { [key: number|string]: Date } = {};

    constructor(accessToken ?: string) {
        this.accessToken = accessToken;
    }
    setAccessToken(accessToken: string) {
        this.accessToken = accessToken;
    }

    get getTasksCategoryList() {
        return this.tasksCategoryList;
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
                this.tasksCategoryList = tasks.map((taskCategory) => {
                    // if category with same id exists, merge them
                    const existingCategory = this.tasksCategoryList.find((category) => category.id === taskCategory.id);
                    if (existingCategory) {
                        taskCategory.tasks = [...existingCategory.tasks!, ...taskCategory.tasks!];
                    }
                    return taskCategory;
                });
            }
            return tasks;
        } catch (error) {
            // console.error(error);
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
        const tobeSaved = taskCategories || this.tasksCategoryList;
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
            if (this.lastUpdate[position] && (new Date().getTime() - this.lastUpdate[position].getTime()) < (45 * 1000)) {
                tasks = await this.getTasksByCategoryPositionFromFile(position);
                readfromfile = true;
            }
            else if (navigator.onLine) {
                tasks = await this.getTasksByCategoryPositionFromApi(position);
            } else {
                tasks = await this.getTasksByCategoryPositionFromFile(position);
                readfromfile = true;
            }
            this.tasksCategoryList[position] = { ...this.tasksCategoryList[position], tasks };
            console.log(this.tasksCategoryList, "this.tasks", "after if");
            if(!readfromfile) await this.saveTasksToFile();
            return tasks;
        } catch (error) {
            return [];
        }
    }

    async getTasksByCategoryPositionFromApi(position: number): Promise<task[]> {
        const taskCategory = this.tasksCategoryList[position]
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
        this.lastUpdate[position] = new Date();
        return tasks;
    }

    async getTasksByCategoryPositionFromFile(position: number): Promise<task[]> {
        const tasks = await readTextFile(`tasks.json`, { dir: DEFAULT_DIRECTORY });
        const taskCategories = JSON.parse(tasks);
        return taskCategories[position].tasks;
    }

    async getTaskById(categoryID: string) {
        try {
            let task: task[] = []
            let readfromfile = false;
            
            // if the lastTaskCategoryByPosition is less than 2 minutes, return the tasks
            if (this.lastUpdate[categoryID] && (new Date().getTime() - this.lastUpdate[categoryID].getTime()) < 45 * 1000) {
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
            let newTask = this.tasksCategoryList.map((taskCategory) => {
                if (taskCategory.id === categoryID) {
                    taskCategory.tasks = task;
                }
                return taskCategory;
            });
            this.tasksCategoryList = newTask;
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
        this.lastUpdate[categoryID] = new Date();
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

    async clearPositionCache(positionOrCategoryID: number|string) {
        this.lastUpdate[positionOrCategoryID] = new Date(0);
        return this
    }
}



const taskObject = new Task();

export { taskObject, Task };