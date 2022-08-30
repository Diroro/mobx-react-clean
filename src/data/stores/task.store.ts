import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { Task, TaskId } from "../../domain/models/task.model";
import { TaskStore } from "../../domain/feature-dependencies/stores/task-store.dependency";


@injectable()
export class TaskStoreImpl implements TaskStore {
    taskIds: TaskId[] = [];
    tasksMap: Map<TaskId, Task> = new Map();
    isLoading: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }
    saveTask = (task: Task) => {
        this.tasksMap.set(task.id, task);
    };
    
    addTask = (task: Task) => {
        this.tasksMap.set(task.id, task);
        this.taskIds.push(task.id);
    }

    saveTasksList = (tasks: Task[]) => {
        tasks.forEach(task => {
            this.taskIds.push(task.id);
            this.saveTask(task);
        })
    }

    removeTask = (id: TaskId) => {
        this.taskIds = this.taskIds.filter(taskId => taskId !== id);
        this.tasksMap.delete(id);
    }
}