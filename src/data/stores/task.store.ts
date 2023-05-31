import type { Task, TaskId } from '../../domain/models/task.model';
import { type TaskStore } from '../../domain/feature-dependencies/stores/task-store.dependency';
import { Injectable } from '../../lib/my-di';
import { Token } from '../../DI/tokens';

@Injectable(Token.taskStore)
export class TaskStoreImpl implements TaskStore {
	taskIds: TaskId[] = [];
	tasksMap: Map<TaskId, Task> = new Map();
	isLoading: boolean = false;

	saveTask = (task: Task) => {
		this.tasksMap.set(task.id, task);
	};

	addTask = (task: Task) => {
		this.tasksMap.set(task.id, task);
		this.taskIds.push(task.id);
	};

	saveTasksList = (tasks: Task[]) => {
		tasks.forEach((task) => {
			this.taskIds.push(task.id);
			this.saveTask(task);
		});
	};

	removeTask = (id: TaskId) => {
		this.taskIds = this.taskIds.filter((taskId) => taskId !== id);
		this.tasksMap.delete(id);
	};
}
