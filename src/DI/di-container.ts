// import { Container, injectable } from 'inversify'
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
import { DependencyToken, ServiceDependencyKey as ServiceDependencyKeyCustom, FeatureDependencyKey as FeatureDependencyKeyCustom } from './tokens'
// import { createApp } from './create-app'
import { AppConfig, createConfig } from './create-config'
import { createApp } from './create-app-with-my-DI'
// import { useDIFeature } from './experiments/classes-di-container'

interface TempFeature {
    some: string
}

// @injectable()
class TempFeatureImpl implements TempFeature {
    some = ''
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
}


type CustomAppConfig = AppConfig<ServiceDependencyKeyCustom, FeatureDependencyKeyCustom, DependenciesMapCustom>;

const newConfig: CustomAppConfig = {
    services: {
        ErrorsStore: TaskServiceImpl,
        TaskStore: TaskServiceImpl,
        TaskService: TaskServiceImpl,
    },
    features: {
        [DependencyToken.TaskManagerFeature]: TaskManagerFeatureImpl,
        [DependencyToken.TempFeature]: TempFeatureImpl,
    },
    tokens: DependencyToken,
}

const someConfig: CustomAppConfig = {
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
};

const config = createConfig<DependenciesMapCustom>(
    { [DependencyToken.TaskService]: TaskServiceImpl,
        [DependencyToken.ErrorsStore]: ErrorsStoreImpl,
        [DependencyToken.TaskStore]: TaskStoreImpl},
        {
            [DependencyToken.TaskManagerFeature]: TaskManagerFeatureImpl,
            [DependencyToken.TempFeature]: TempFeatureImpl,
        },
        DependencyToken,
);

const {useDIFeature, useAllFeatures} = createApp()


export {useDIFeature, useAllFeatures};

const consoleObservable = (...args: any[]) => console.log(...toJS(args))
