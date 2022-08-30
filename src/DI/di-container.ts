import { Container } from "inversify";
import { TaskServiceImpl } from "../data/services/task.service";
import { ErrorsStoreImpl } from "../data/stores/errors.store";
import { TaskStoreImpl } from "../data/stores/task.store";
import { TaskManagerFeature, TaskManagerFeatureImpl } from "../domain/features/task-manager.feature";
import { TaskService } from "../domain/feature-dependencies/services/task.service.depenceny";
import { ErrorsStore } from "../domain/feature-dependencies/stores/errors-store.dependency";
import { TaskStore } from "../domain/feature-dependencies/stores/task-store.dependency";

export type BaseDependency = 'TaskService' | 'ErrorsStore' | 'TasksStore' | 'TaskManagerFeature';
export type Feature = 'TaskManagerFeature';

type Dependency = BaseDependency | Feature;

export interface DependenciesMap {
    TaskService: TaskService,
    ErrorsStore: ErrorsStore,
    TasksStore: TaskStore,
    TaskManagerFeature: TaskManagerFeature,
}

export const DependencyToken: Record<Dependency, symbol> = {
    TaskService: Symbol.for('TaskService'),
    ErrorsStore: Symbol.for('ErrorsStore'),
    TasksStore: Symbol.for('TaskStore'),
    TaskManagerFeature: Symbol.for('TaskManagerFeature'),
}


export const containerDI = new Container();

containerDI.bind<TaskService>(DependencyToken.TaskService).to(TaskServiceImpl);
containerDI.bind<TaskStore>(DependencyToken.TasksStore).to(TaskStoreImpl);
containerDI.bind<ErrorsStore>(DependencyToken.ErrorsStore).to(ErrorsStoreImpl);
containerDI.bind<TaskManagerFeature>(DependencyToken.TaskManagerFeature).to(TaskManagerFeatureImpl);


export const useFeature = <T extends Feature>(token: T): DependenciesMap[T] => {
    const tokenSymbol = DependencyToken[token];
    return containerDI.get<DependenciesMap[T]>(tokenSymbol);
}
