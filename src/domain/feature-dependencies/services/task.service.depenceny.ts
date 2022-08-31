import { Task, TaskId } from "../../models/task.model";

// for simplification can be placed near it's implementation
export interface TaskService {
    getTasks: () => Promise<Task[]>;
    addTask: (title: string) => Promise<Task>;
    removeTask: (id: TaskId) => Promise<TaskId>;
    editTaskTitle: (id: TaskId, newTitle: string) => Promise<Task>
    toggleCompleteTask: (id: TaskId, completed: boolean) => Promise<Task>
}