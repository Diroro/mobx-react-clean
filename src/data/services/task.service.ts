import { Task, TaskId } from "../../domain/models/task.model";
import { TaskService } from "../../domain/ports/services/task-service.port";
import { createTask, TaskDTO } from "../api-models/task.api-model";
import {v4 as uuidv4} from 'uuid';
import { injectable } from "inversify";

let tasksList: TaskDTO[] = [];

@injectable()
export class TaskServiceImpl implements TaskService {
    getTasks = async () => {
        return tasksList;
    }

    addTask =  async (title: string): Promise<Task> => {
        const id = uuidv4();

        const newTask: TaskDTO = {
            id,
            title,
            completed: false,
        };
        tasksList.push(newTask);

        return createTask(newTask);
    };

    removeTask = async (id: TaskId): Promise<TaskId> => {
        tasksList = tasksList.filter(task => task.id !== id);
        return id;
    }

    toggleCompleteTask = async (id: TaskId, completed: boolean): Promise<Task> => {
        const foundTask = tasksList.find(task => task.id === id);

        if (foundTask) {
            foundTask.completed = completed;
            return createTask(foundTask);
        }
        throw new Error('Task not found');
    }

   editTaskTitle = async (id: string, newTitle: string): Promise<Task> => {
        const index = tasksList.findIndex(task => task.id === id);

        if (index === -1) {
            throw new Error('Task not found');
        }

        const task = tasksList[index];
        task.title = newTitle;
        return createTask(task);
    }
}