import { Container } from "inversify";
import { TaskServiceImpl } from "../data/services/task.service";
import { ErrorsStoreImpl } from "../data/stores/errors.store";
import { TaskStoreImpl } from "../data/stores/task.store";
import { TaskManagerFeature } from "../domain/features/task-manager.feature";
import { TaskService } from "../domain/ports/services/task-service.port";
import { ErrorsStore } from "../domain/ports/stores/errors-store.port";
import { TaskStore } from "../domain/ports/stores/task-store.port";


export const DEPS = {
    TaskService: 'TasKService',
    ErrorsStore: 'ErrorsStore',
    TaskStore: 'TaskSTore',

}

const containerDI = new Container();

containerDI.bind<TaskService>(DEPS.TaskService).to(TaskServiceImpl);
containerDI.bind<TaskStore>(DEPS.TaskStore).to(TaskStoreImpl);
containerDI.bind<ErrorsStore>(DEPS.ErrorsStore).to(ErrorsStoreImpl);


// interface 
// interface AppFeatures {
//     taskManagerFeature: () => Promise<TaskManagerFeature>;
// }
// export const appContext: AppFeatures = {
    // taskManagerFeature: () => import('../domain/features/task-manager.feature').then(feature => new feature.TaskManagerFeatureImpl)
// }
// const featureContext
// const useLazyFeature