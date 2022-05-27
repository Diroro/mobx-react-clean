import { Task, TaskId } from "../../domain/models/task.model";
import { TaskService } from "../../domain/ports/services/task-service.port";
import { createTask, TaskApiModel } from "../api-models/task.api-model";
import {v4 as uuidv4} from 'uuid';
import { injectable } from "inversify";

let tasksList: TaskApiModel[] = [
    
      {
        title: 'React Hooks',
        completed: false,
        id: 'b967afe24b23'
      },
      {
        title: 'Viva la comunidad de Midu ORALE',
        completed: true,
        id: '43286487fhsdjasd'
      },
      {
        title: 'Hooooola Twitch!',
        completed: false,
        id: '54937fhajd'
      },
      {
        title: 'Context',
        completed: true,
        id: '43242341aaaaa'
      },
      {
        title: 'BUA BUA BUA BUA',
        completed: true,
        id: 'b967afe24a13'
      }
];

@injectable()
export class TaskServiceImpl implements TaskService {
    getTasks = async () => {
        return tasksList;
    }

    addTask =  async (title: string): Promise<Task> => {
        const id = uuidv4();

        const newTask: TaskApiModel = {
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