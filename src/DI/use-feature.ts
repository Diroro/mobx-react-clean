import {  createContext, useContext } from "react";
import { TaskServiceImpl } from "../data/services/task.service";
import { ErrorsStoreImpl } from "../data/stores/errors.store";
import { TaskStoreImpl } from "../data/stores/task.store";
import { TaskManagerFeature, TaskManagerFeatureImpl } from "../domain/features/task-manager.feature";
import { TaskService } from "../domain/feature-dependencies/services/task.service.depenceny";
import { ErrorsStore } from "../domain/feature-dependencies/stores/errors-store.dependency";
import { TaskStore } from "../domain/feature-dependencies/stores/task-store.dependency";

export type BaseDependency = 'TaskService' | 'ErrorsStore' | 'TasksStore';
export type Feature = 'TaskManager';

export interface DependenciesMap {
    TaskService: TaskService,
    ErrorsStore: ErrorsStore,
    TasksStore: TaskStore,
    TaskManager: TaskManagerFeature,
}

export type AppFeatures = Record<Feature, DependenciesMap[Feature]>;

const taskService = new TaskServiceImpl(); 
const taskStore = new TaskStoreImpl();
const errorsStore = new ErrorsStoreImpl();

const taskManagerFeature = new TaskManagerFeatureImpl(taskService, taskStore, errorsStore);

const features: AppFeatures = {
    TaskManager: taskManagerFeature,
}

const featureContext = createContext<AppFeatures>(features);

export const useAllFeatures = () => useContext(featureContext);
export const useTaskManagerFeature = () => useAllFeatures().TaskManager;

