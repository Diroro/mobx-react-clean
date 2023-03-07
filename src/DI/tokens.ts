export type ServiceDependencyKey = 'TaskService' | 'ErrorsStore' | 'TaskStore'
export type FeatureDependencyKey = 'TaskManagerFeature' | 'TempFeature'

export const DependencyToken = {
  TaskService: 'TaskService',
  ErrorsStore: 'ErrorsStore',
  TaskStore: 'TaskStore',
  TaskManagerFeature: 'TaskManagerFeature',
  TempFeature: 'TempFeature',
} as const
