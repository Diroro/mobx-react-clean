import { makeObservable, observable } from "mobx";
import { type Task } from "../../domain/models/task.model";

// @TODO think how to call
export interface TaskApiModel {
    id: string;
    title: string;
    completed: boolean;
}

export const createTask = (rawTask: TaskApiModel): Task => {
    // creating dates, 
    return observable({
        ...rawTask,
    });
};