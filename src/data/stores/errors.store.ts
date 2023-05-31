import { Injectable } from '../../lib/my-di';
import { Token } from '../../DI/tokens';
import { type ErrorsStore } from '../../domain/feature-dependencies/stores/errors-store.dependency';

@Injectable(Token.errorsStore)
export class ErrorsStoreImpl implements ErrorsStore {
	handleError = (key: string) => (error?: Error) => {
		// doing something - e.g. saving for showing notification
	};
}
