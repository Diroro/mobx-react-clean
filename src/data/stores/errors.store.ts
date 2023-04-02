import { makeAutoObservable } from "mobx";
import { MakeInjectable } from "../../DI/my-di/decorators";
import { DependencyToken } from "../../DI/tokens";
import { type ErrorsStore } from "../../domain/feature-dependencies/stores/errors-store.dependency";

@MakeInjectable(DependencyToken.ErrorsStore)
export class ErrorsStoreImpl implements ErrorsStore {

    constructor() {
        // makeAutoObservable(this);
    }
    
    handleError = (key: string) => (error?: Error) => {
        // doing something - e.g. saving for showing notification
    }
}