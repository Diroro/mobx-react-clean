import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { DependencyToken } from "../../DI/di-container";
import { isNonNullable } from "../../utils/non-nullable.utils";
import { Task, TaskId } from "../models/task.model";
import { type TaskService } from "../feature-dependencies/services/task.service.depenceny";
import { type ErrorsStore } from "../feature-dependencies/stores/errors-store.dependency";
import { type TaskStore } from "../feature-dependencies/stores/task-store.dependency";
import { Cancellable, handleRequest } from "../../utils/handle-request.utils";

export interface TaskManagerFeature {
    tasksList: Task[];
    requestTasks: () => void;
    requestTasksCancellable: () => Cancellable;
    addTask: (title: string) => void;
    removeTask: (id: TaskId) => void;
    renameTask: (id: TaskId, newTitle: string) => void;
    toggleCompleteTask: (id: TaskId, completed: boolean) => void;
    activeCount: number;
    completedCount: number;
}

@injectable()
export class TaskManagerFeatureImpl implements TaskManagerFeature {
    tasksLoading: boolean = false;

    private setTasksLoading = (flag: boolean) => {
        this.tasksLoading = flag;
    }

    constructor(
        @inject(DependencyToken.TaskService) private taskService: TaskService, 
        @inject(DependencyToken.TasksStore) private tasksStore: TaskStore,
        @inject(DependencyToken.ErrorsStore) private errorsStore: ErrorsStore
    ) {
        makeAutoObservable(this);
    }
    
    get tasksList() {
        return this.tasksStore.taskIds
            .map(id => this.tasksStore.tasksMap.get(id))
            .filter(isNonNullable);
    };
 
    saveTask = (task: Task) => {
        this.tasksStore.saveTask(task);
    }

    setLoading = (flag: boolean) => {
        this.tasksStore.isLoading = flag;
    }

    get activeCount() {
       return  this.tasksList.filter((task) => !task.completed).length
    }


    get completedCount() {
        return this.tasksList.filter((task) => task.completed).length;
    }

    requestTasks = (): void => {
        this.setTasksLoading(true);
        this.taskService.getTasks()
            .then(this.tasksStore.saveTasksList)
            .catch(this.errorsStore.handleError('get-tasks'))
            .finally(() => this.setTasksLoading(false));
    };

    requestTasksCancellable = (): Cancellable => {
        return handleRequest(this.taskService.getTasks, {}, this.tasksStore.saveTasksList, this.setTasksLoading, this.errorsStore.handleError('get-tasks'));
    };
 
    addTask = (title: string) => {
        this.taskService.addTask(title)
            .then(this.tasksStore.addTask)
            .catch(this.errorsStore.handleError('add-task'))
    }

   
    removeTask = (id: TaskId) => {
        this.taskService.removeTask(id)
            .then(this.tasksStore.removeTask)
            .catch(this.errorsStore.handleError('add-task'))
    }

    renameTask = (id: TaskId, newTitle: string) => {
        this.taskService.editTaskTitle(id, newTitle)
            .then(this.tasksStore.saveTask)
            .catch(this.errorsStore.handleError('rename-task'))
    }

    toggleCompleteTask = (id: TaskId, completed: boolean) => {
        this.taskService.toggleCompleteTask(id, completed)
            .then(this.tasksStore.saveTask)
            .catch(this.errorsStore.handleError('complete-task'))
    }



}
