import { Task, TaskId } from "../../models/task.model";

export interface TaskService {
    getTasks: () => Promise<Task[]>;
    addTask: (title: string) => Promise<Task>;
    removeTask: (id: TaskId) => Promise<TaskId>;
    editTaskTitle: (id: TaskId, newTitle: string) => Promise<Task>
    toggleCompleteTask: (id: TaskId, completed: boolean) => Promise<Task>
}