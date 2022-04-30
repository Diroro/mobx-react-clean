import { injectable } from "inversify";
import { Task, TaskId } from "../../domain/models/task.model";
import { TaskStore } from "../../domain/ports/stores/task-store.port";

@injectable()
export class TaskStoreImpl implements TaskStore {
    taskIds: TaskId[] = [];
    tasksMap: Map<TaskId, Task> = new Map();
    isLoading: boolean = false;

    saveTask = (task: Task) => {
        this.tasksMap.set(task.id, task);
    };

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