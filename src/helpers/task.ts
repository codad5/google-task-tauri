import { readTextFile, writeTextFile } from "@tauri-apps/api/fs";
import axios from "axios";
import { task, taskCategory } from "../types/taskapi";
import { BaseDirectory } from "@tauri-apps/api/fs";
const DEFAULT_DIRECTORY = BaseDirectory.Download;
export class Task {
    readonly accessToken: string;
    baseUrl = "https://tasks.googleapis.com/tasks/v1";
    tasks: taskCategory[] = [];
    constructor(accessToken: string) {
        this.accessToken = accessToken;
    }
    async getTaskCategories() {
        try {
            let tasks = null;
            // check if online and get tasks from api
            if (navigator.onLine) {
                tasks = await this.getTasksFromApi(this.accessToken);
            } else {
                // get tasks from file
                tasks = await this.getTasksFromFile();
            }
            this.tasks = tasks;
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
        await this.saveTasksToFile(taskCategories);
        return taskCategories;
    }

    async saveTasksToFile(taskCategories ?: taskCategory[]) {
        const tasks = JSON.stringify(taskCategories || this.tasks);
        await writeTextFile("tasks.json", tasks, { dir: DEFAULT_DIRECTORY });
    }

    async getTasksFromFile(): Promise<taskCategory[]> {
        const tasks = await readTextFile("tasks.json", { dir: DEFAULT_DIRECTORY });
        return JSON.parse(tasks);
    }

    async getTasksByCategoryPosition(position: number) {
        try {
            let tasks = null;
            // check if online and get tasks from api
            if (navigator.onLine) {
                tasks = await this.getTasksByCategoryPositionFromApi(position);
            } else {
                // get tasks from file
                tasks = await this.getTasksByCategoryPositionFromFile(position);
            }
            console.log(tasks);
            this.tasks[position] = { ...this.tasks[position], tasks };
            console.log(this.tasks);
            await this.saveTasksToFile();
            return tasks;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async getTasksByCategoryPositionFromApi(position: number): Promise<task[]> {
        console.log("task from api");
        const taskCategory = this.tasks[position]
        if (!taskCategory) return [];
        const url = `${this.baseUrl}/lists/${taskCategory.id}/tasks`;
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
            },
        });
        console.log(response.data);
        const tasks: task[] = response.data.items.map((item: any) => {
            return {
                id: item.id,
                name: item.title,
                description: item.notes,
                dueDate: item.due,
                completed: item.status === "completed",
            };
        });
        return tasks;
    }

    async getTasksByCategoryPositionFromFile(position: number): Promise<task[]> {
        const tasks = await readTextFile(`tasks.json`, { dir: DEFAULT_DIRECTORY });
        const taskCategories = JSON.parse(tasks);
        return taskCategories[position].tasks;
    }

    async getTaskById(categoryID: string) {
        try {
            let task : task[] = []
            // check if online and get tasks from api
            if (navigator.onLine) {
                task = await this.getTaskByIdFromApi(categoryID);
            } else {
                // get tasks from file
                task = await this.getTaskByIdFromFile(categoryID);
            }
            let newTask = this.tasks.map((taskCategory) => {
                if (taskCategory.id === categoryID) {
                    taskCategory.tasks = task;
                }
                return taskCategory;
            });
            this.tasks = newTask;
            await this.saveTasksToFile();
            return task;
        } catch (error) {
            console.error(error);
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
        return tasks;
    }

    async getTaskByIdFromFile(categoryID: string): Promise<task[]> {
        const tasks = await readTextFile(`tasks.json`, { dir: DEFAULT_DIRECTORY });
        const taskCategories = JSON.parse(tasks);
        return taskCategories.find((taskCategory: taskCategory) => taskCategory.id === categoryID).tasks;
    }

    async markTask(task: task, categoryID : string){
        console.log(task.completed, "mark task");
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
        console.log(response.data, "mark task");
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
        console.log(response.data, "add task");
        return response.data;
    }
}