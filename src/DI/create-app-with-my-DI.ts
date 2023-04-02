// import { Container, injectable } from 'inversify'
import { makeAutoObservable } from 'mobx'
import { TaskServiceImpl } from '../data/services/task.service'
import { ErrorsStoreImpl } from '../data/stores/errors.store'
import { TaskStoreImpl } from '../data/stores/task.store'
import { TaskService } from '../domain/feature-dependencies/services/task.service.dependency'
import { ErrorsStore } from '../domain/feature-dependencies/stores/errors-store.dependency'
import { TaskStore } from '../domain/feature-dependencies/stores/task-store.dependency'
import {
  TaskManagerFeature,
  TaskManagerFeatureImpl,
} from '../domain/features/task-manager.feature'
import { DependenciesMapGeneral, AppConfig, KlassType } from './create-config'
import { MakeInjectable } from './my-di/decorators'
import { buildContainer } from './my-di/di-function'
import { DependencyToken, FeatureDependencyKey } from './tokens'

// export const createApp = <DependenciesMap extends DependenciesMapGeneral>(
//   config: AppConfig<DependenciesMap>,
// ) => {
//   // return { useDIFeature, useAllFeatures }
// }
//

// think how to split to features and services

interface TempFeature {
  some: string
}
@MakeInjectable(DependencyToken.TempFeature)
class TempFeatureImpl implements TempFeature {
  some = ''
}

export const createApp = () => {
  const container = buildContainer()
    .bind<typeof DependencyToken.TaskService, TaskService>(
      DependencyToken.TaskService,
      TaskServiceImpl,
    )
    .bind<typeof DependencyToken.TaskStore, TaskStore>(
      DependencyToken.TaskStore,
      TaskStoreImpl,
    )
    .bind<typeof DependencyToken.ErrorsStore, ErrorsStore>(
      DependencyToken.ErrorsStore,
      ErrorsStoreImpl,
    )
    .bind<typeof DependencyToken.TaskManagerFeature, TaskManagerFeature>(
      DependencyToken.TaskManagerFeature,
      TaskManagerFeatureImpl,
    )
    .bind<typeof DependencyToken.TempFeature, TempFeature>(
      DependencyToken.TempFeature,
      TempFeatureImpl,
    )
    .build((map) => {
      map.forEach((value) => {
        makeAutoObservable(value)
      })
    })

  const wholeContainer = container.getContainer()

  const useDIFeature = <Key extends FeatureDependencyKey>(
    token: Key,
  ): typeof wholeContainer[Key] => {
    const feature = wholeContainer[token]

    return feature
  }

  const useAllFeatures = () => {
    return wholeContainer
  }

  return {
    useDIFeature,
    useAllFeatures,
  }
}

// const app = createApp()

// const a = app.useDIFeature('TaskManagerFeature')
export const temp = 1
