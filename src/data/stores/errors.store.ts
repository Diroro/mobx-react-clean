import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { ErrorsStore } from "../../domain/feature-dependencies/stores/errors-store.dependency";

@injectable()
export class ErrorsStoreImpl implements ErrorsStore {

    constructor() {
        makeAutoObservable(this);
    }
    
    handleError = (key: string) => (error?: Error) => {
        // doing something - e.g. saving for showing notification
    }
}