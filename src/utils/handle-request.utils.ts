export interface AbortParams {
    signal: AbortSignal;
}

/**
 * Interface for any async action which could be canceled
 */
 export interface Cancellable {
    cancel: () => void;
}

const CANCEL_ERROR_TEXT = 'The user aborted a request.';

export const emptyCancellable: Cancellable = {cancel: () => {}};

/**
 * Helps to make requests, store errors and loading state
 * @param request
 * @param params
 * @param onResponseHandler
 * @param setLoading
 * @param setError
 * @returns Cancellable object with 'cancel' method to abort request
 */
export const handleRequest = <TParams extends Object, TReturn>(
    request: (params: TParams & AbortParams) => Promise<TReturn>,
    params: TParams,
    onResponseHandler: (value: TReturn) => void,
    setLoading?: (flag: boolean) => void,
    setError?: (error?: Error) => void,
): Cancellable => {
    const abortController = new AbortController();
    setLoading && setLoading(true);
    setError && setError(undefined);

    const catchError = (error: Error) => {
        setError && setError(error);
        if (error.message !== CANCEL_ERROR_TEXT) {
            setLoading && setLoading(false);
        }
    };
    const onResponse = (value: TReturn) => {
        onResponseHandler(value);
        setLoading && setLoading(false);
    };

    request({...params, signal: abortController.signal})
        .then(onResponse)
        .catch(catchError);

    return {
        cancel: () => {
            // we should do this before real abortion
            // otherwise it could be called asynchronically AFTER the next loading is started and overwrite it
            setLoading && setLoading(false);
            abortController.abort();
        },
    };
};