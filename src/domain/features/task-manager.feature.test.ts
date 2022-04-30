import { TaskService } from "../ports/services/task-service.port";
import { ErrorsStore } from "../ports/stores/errors-store.port";
import { TaskStore } from "../ports/stores/task-store.port";
import { TaskManagerFeatureImpl } from "./task-manager.feature";

const taskStoreMock = {} as TaskStore;
const taskServiceMock = {} as TaskService;
const errorStoreMock = {} as ErrorsStore;

describe('task-manager', () => {
    it('should get tasks', () => {
        const feature = new TaskManagerFeatureImpl(taskServiceMock, taskStoreMock, errorStoreMock);
        feature.requestTasks();
        expect(feature.tasksList).toEqual([]);
    })
});