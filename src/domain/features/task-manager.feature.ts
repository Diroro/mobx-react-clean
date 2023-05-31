import { Token } from "../../DI/tokens";
import { isNonNullable } from "../../utils/non-nullable.utils";
import { type Task, type TaskId } from "../models/task.model";
import { type TaskService } from "../feature-dependencies/services/task.service.dependency";
import { type ErrorsStore } from "../feature-dependencies/stores/errors-store.dependency";
import { type TaskStore } from "../feature-dependencies/stores/task-store.dependency";
import { type Cancellable, handleRequest } from "../../utils/handle-request.utils";
import { Injectable, Inject } from "../../lib/my-di";

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

@Injectable(Token.taskManagerFeature)
export class TaskManagerFeatureImpl implements TaskManagerFeature {
    tasksLoading: boolean = false;

    private setTasksLoading = (flag: boolean) => {
        this.tasksLoading = flag;
    } 
    
    constructor(
        @Inject(Token.taskService) public taskService: TaskService,
        @Inject(Token.taskStore) public taskStore: TaskStore,
        @Inject(Token.errorsStore) public errorsStore: ErrorsStore,
    ) {
    }

    get tasksList() {
        return this.taskStore.taskIds
            .map(id => this.taskStore.tasksMap.get(id))
            .filter(isNonNullable);
    };
 
    saveTask = (task: Task) => {
        this.taskStore.saveTask(task);
    }

    setLoading = (flag: boolean) => {
        this.taskStore.isLoading = flag;
    }

    get activeCount() {
       return this.tasksList.filter((task) => !task.completed).length
    }

    get completedCount() {
        return this.tasksList.filter((task) => task.completed).length;
    }

    requestTasks = (): void => {
        this.setTasksLoading(true);
        this.taskService.getTasks()
            .then(this.taskStore.saveTasksList)
            .catch(this.errorsStore.handleError('get-tasks'))
            .finally(() => this.setTasksLoading(false));
    };

    requestTasksCancellable = (): Cancellable => {
        return handleRequest(
            this.taskService.getTasks,
            {}, 
            this.taskStore.saveTasksList,
            this.setTasksLoading,
            this.errorsStore.handleError('get-tasks')
        );
    };
 
    addTask = (title: string) => {
        console.log('ADD TASK: ', title);
        this.taskService.addTask(title)
            .then(this.taskStore.addTask)
            .catch(this.errorsStore.handleError('add-task'))
    }
   
    removeTask = (id: TaskId) => {
        this.taskService.removeTask(id)
            .then(this.taskStore.removeTask)
            .catch(this.errorsStore.handleError('add-task'))
    }

    renameTask = (id: TaskId, newTitle: string) => {
        this.taskService.editTaskTitle(id, newTitle)
            .then(this.taskStore.saveTask)
            .catch(this.errorsStore.handleError('rename-task'))
    }

    toggleCompleteTask = (id: TaskId, completed: boolean) => {
        this.taskService.toggleCompleteTask(id, completed)
            .then(this.taskStore.saveTask)
            .catch(this.errorsStore.handleError('complete-task'))
    }
}
