import type { Task, TaskId } from '../../models/task.model'

export interface TaskStore {
  taskIds: TaskId[]
  tasksMap: Map<TaskId, Task>
  isLoading: boolean
  saveTask: (task: Task) => void
  addTask: (task: Task) => void
  saveTasksList: (tasks: Task[]) => void
  removeTask: (id: TaskId) => void
}
