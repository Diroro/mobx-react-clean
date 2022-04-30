import { Task } from "../../domain/models/task.model";

// @TODO rename the file... think how to call
export interface TaskDTO {
    id: string;
    title: string;
    completed: boolean;
}

export const createTask = (rawTask: TaskDTO): Task => {
    return {
        ...rawTask,
    }
}