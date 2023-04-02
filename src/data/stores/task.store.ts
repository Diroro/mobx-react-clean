import { makeAutoObservable } from "mobx";
import type { Task, TaskId } from "../../domain/models/task.model";
import { type TaskStore } from "../../domain/feature-dependencies/stores/task-store.dependency";
import { MakeInjectable } from "../../DI/my-di/decorators";
import { DependencyToken } from "../../DI/tokens";


@MakeInjectable(DependencyToken.TaskStore)
export class TaskStoreImpl implements TaskStore {
    taskIds: TaskId[] = [];
    tasksMap: Map<TaskId, Task> = new Map();
    isLoading: boolean = false;

    constructor() {
        // makeAutoObservable(this);
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