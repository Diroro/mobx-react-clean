import {type TaskService } from "../feature-dependencies/services/task.service.dependency";
import { type ErrorsStore } from "../feature-dependencies/stores/errors-store.dependency";
import { type TaskStore } from "../feature-dependencies/stores/task-store.dependency";
import { TaskManagerFeatureImpl } from "./task-manager.feature";

const taskStoreMock = {} as TaskStore;
const taskServiceMock = {} as TaskService;
const errorStoreMock = {} as ErrorsStore;

describe('task-manager', () => {
    it('should get tasks', () => {
        // const feature = new TaskManagerFeatureImpl(taskServiceMock, taskStoreMock, errorStoreMock);
        // const feature = new TaskManagerFeatureImpl();
        // feature.requestTasks();
        // expect(feature.tasksList).toEqual([]);
    })
});