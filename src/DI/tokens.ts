export type ServiceDependencyKey = 'TaskService' | 'ErrorsStore' | 'TaskStore'
export type FeatureDependencyKey = 'TaskManagerFeature'

export const Token = {
  taskService: 'TaskService',
  errorsStore: 'ErrorsStore',
  taskStore: 'TaskStore',
  taskManagerFeature: 'TaskManagerFeature',
} as const
