import "reflect-metadata"; 
import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { DependencyToken } from "../../DI/di-container";
import { isNonNullable } from "../../utils/non-nullable.utils";
import { Task, TaskId } from "../models/task.model";
import { TaskService } from "../ports/services/task-service.port";
import { ErrorsStore } from "../ports/stores/errors-store.port";
import { TaskStore } from "../ports/stores/task-store.port";

export interface TaskManagerFeature {
    tasksList: Task[];
    requestTasks: () => void;
    addTask: (title: string) => void;
    removeTask: (id: TaskId) => void;
    renameTask: (id: TaskId, newTitle: string) => void;
    toggleCompleteTask: (id: TaskId, completed: boolean) => void;
    activeCount: number;
    completedCount: number;
}

@injectable()
export class TaskManagerFeatureImpl implements TaskManagerFeature {
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

  

    requestTasks = () => {
        console.log('REQUEST TASKS');
        this.taskService.getTasks()
            .then(this.tasksStore.saveTasksList)
            .catch(this.errorsStore.handleError('get-tasks'));
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
