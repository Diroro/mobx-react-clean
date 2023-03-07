import { Container } from 'inversify'
import { TaskServiceImpl } from '../data/services/task.service'
import { ErrorsStoreImpl } from '../data/stores/errors.store'
import { TaskStoreImpl } from '../data/stores/task.store'
import {
    type TaskManagerFeature,
  TaskManagerFeatureImpl,
} from '../domain/features/task-manager.feature'
import { type TaskService } from '../domain/feature-dependencies/services/task.service.dependency'
import { type ErrorsStore } from '../domain/feature-dependencies/stores/errors-store.dependency'
import { type TaskStore } from '../domain/feature-dependencies/stores/task-store.dependency'
import { makeAutoObservable, toJS } from 'mobx'
import 'reflect-metadata'
import { DependencyToken, ServiceDependencyKey, FeatureDependencyKey } from './tokens'
// import { useDIFeature } from './experiments/classes-di-container'

interface TempFeature {
  some: string
}

class TempFeatureImpl implements TempFeature {
  some = ''
}

type KlassType<Result> = { new (...variables: any[]): Result }

type DependenciesMapGeneral<
  ServiceDependencyKey extends string,
  FeatureDependencyKey extends string
> = {
  services: Record<ServiceDependencyKey, unknown>
  features: Record<FeatureDependencyKey, unknown>
//   servicesImpl: Record<ServiceDependencyKey, unknown>
//   featuresImpl: Record<FeatureDependencyKey, unknown>
}

type DependenciesMapCustom = {
    services: {
        [DependencyToken.TaskService]: TaskService,
        [DependencyToken.ErrorsStore]: ErrorsStore,
        [DependencyToken.TaskStore]: TaskStore,
      },
      features: {
        [DependencyToken.TaskManagerFeature]: TaskManagerFeature,
        [DependencyToken.TempFeature]: TempFeature,
      }
//   servicesImpl: {
//     TaskService: TaskServiceImpl
//     ErrorsStore: ErrorsStoreImpl
//     TaskStore: TaskStoreImpl
//   }
//   featuresImpl: {
//     TaskManagerFeature: TaskManagerFeatureImpl
//     TempFeature: TempFeatureImpl
//   }
}

type AppConfig<
  ServiceDependencyKey extends string,
  FeatureDependencyKey extends string,
  DependenciesMap extends DependenciesMapGeneral<
    ServiceDependencyKey,
    FeatureDependencyKey
  >
> = {
  readonly services: Record<
    ServiceDependencyKey,
    KlassType<DependenciesMap['services'][ServiceDependencyKey]>
  >
  readonly features: Record<
    FeatureDependencyKey,
    KlassType<DependenciesMap['features'][FeatureDependencyKey]>
  >
//   readonly servicesImpl: Record<
//   ServiceDependencyKey,
//   KlassType<DependenciesMap['services']>
// >
// readonly featuresImpl: Record<
//   FeatureDependencyKey,
//   KlassType<DependenciesMap['features']>
// >
  readonly tokens: Record<ServiceDependencyKey | FeatureDependencyKey, string>
}

// const dependenciesMap: Record<Dependency, KlassType> = {
//     TaskService: TaskServiceImpl,
//     ErrorsStore: ErrorsStoreImpl,
//     TasksStore: TaskStoreImpl,
// }

// type ServiceDependencyKeyCustom =typeof DependencyToken.TaskService |typeof  DependencyToken.TaskStore | typeof DependencyToken.ErrorsStore
// type FeatureDependencyKeyCustom = typeof DependencyToken.TaskManagerFeature | typeof DependencyToken.TempFeature;



const createApp = <
  BaseDependencyKey extends string,
  FeatureDependencyKey extends string,
  DependenciesMap extends DependenciesMapGeneral<BaseDependencyKey, FeatureDependencyKey>,
>(
  config: AppConfig<
  BaseDependencyKey,
  FeatureDependencyKey,
  DependenciesMap
>,
) => {
  type DependencyKey = BaseDependencyKey | FeatureDependencyKey

  const containerDI = new Container({
    autoBindInjectable: true,
    defaultScope: 'Singleton',
  })
  const { services, features, tokens } = config

  const allDependencies = ({ ...services, ...features } as unknown) as Record<
    DependencyKey,
    KlassType<DependencyKey>
  >

  Object.entries(allDependencies).forEach(([key, dep]) => {
    const depKey = key as unknown as DependencyKey
    const dependency = dep as any
    containerDI.bind(tokens[depKey]).to(dependency).onActivation((_, injectable) => {
        makeAutoObservable(injectable as object);
        return injectable;
    });
  })

  type FeatureDependency<Key extends FeatureDependencyKey> = DependenciesMap['features'][Key];

  const useDIFeature = <Key extends FeatureDependencyKey>(token: Key): FeatureDependency<Key> => {
    const feature = containerDI.get<FeatureDependency<Key>>(
        token,
    );

    return feature
  }

  return { useDIFeature }
}

type CustomAppConfig = AppConfig<
  ServiceDependencyKey,
  FeatureDependencyKey,
  DependenciesMapCustom
>

// createConfig?
const someConfig = {
  services: {
    [DependencyToken.TaskService]: TaskServiceImpl,
    [DependencyToken.ErrorsStore]: ErrorsStoreImpl,
    [DependencyToken.TaskStore]: TaskStoreImpl,
  },
  features: {
    [DependencyToken.TaskManagerFeature]: TaskManagerFeatureImpl,
    [DependencyToken.TempFeature]: TempFeatureImpl,
  },
  tokens: DependencyToken,
} as const;


const app = createApp<ServiceDependencyKey, FeatureDependencyKey, DependenciesMapCustom>(someConfig)
export const useDIFeature = app.useDIFeature;

// export {useDIFeature}
// export const useDIFeature = app.useDIFeature

// @TODO Check how 'autoBindInjectable' works

// const feature = useDIFeature('TaskManagerFeature')



// const useSomeFeature = () => useFeature('TaskManagerFeature');

const consoleObservable = (...args: any[]) => console.log(...toJS(args))
