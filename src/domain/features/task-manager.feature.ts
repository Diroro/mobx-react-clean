import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { DEPS } from "../../DI/di-container";
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
}

@injectable()
export class TaskManagerFeatureImpl implements TaskManagerFeature {

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

    constructor(
        @inject(DEPS.TaskService) private taskService: TaskService, 
        @inject(DEPS.TaskStore) private tasksStore: TaskStore,
        @inject(DEPS.ErrorsStore) private errorsStore: ErrorsStore
    ) {
        makeAutoObservable(this);
    }

    requestTasks = () => {
        this.taskService.getTasks()
            .then(this.tasksStore.saveTasksList)
            .catch(this.errorsStore.handleError('get-tasks'));
    };
 
    addTask = (title: string) => {
        this.taskService.addTask(title)
            .then(this.saveTask)
            .catch(this.errorsStore.handleError('add-task'))
    }

   
    removeTask = (id: TaskId) => {
        this.taskService.removeTask(id)
            .then(this.tasksStore.removeTask)
            .catch(this.errorsStore.handleError('add-task'))
    }

    renameTask = (id: TaskId, newTitle: string) => {
        this.taskService.editTaskTitle(id, newTitle)
            .then(this.saveTask)
            .catch(this.errorsStore.handleError('rename-task'))
    }

    toggleCompleteTask = (id: TaskId, completed: boolean) => {
        this.taskService.toggleCompleteTask(id, completed)
            .then(this.saveTask)
            .catch(this.errorsStore.handleError('complete-task'))
    }



}
