import { injectable } from "inversify";
import { ErrorsStore } from "../../domain/ports/stores/errors-store.port";

@injectable()
export class ErrorsStoreImpl implements ErrorsStore {
    handleError = (key: string) => (error?: Error) => {
        // doing something - e.g. saving for showing notification
    }

    // clearError = (key: string) => {}
}