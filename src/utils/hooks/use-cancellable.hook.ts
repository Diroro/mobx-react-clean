import {useCallback, useEffect} from 'react';
import { useTaskManagerFeature } from '../../DI/use-feature';
import { type Cancellable} from '../handle-request.utils';
 
type CancellableRequest = () => Cancellable;

/**
 * can be used for cancelling request before sending a new one.
 * Important to note, that not every request should be cancelled!
 * If we should be able to make several same requests at one moment, like when we edit comments, do not use this!
 * @param request request to make and cancel
 * @param deps dependencies list which should be followed for cancelling and making new request
 * @Example
 * const ExapmleComponent = () => {
 *   const {requestComments} = useCommentsFeature();
 *    // do request when leadMock is changed. Cancel the previous request if not finished.
 *    useCancellableRequest(() => requestComments(leadMock), [leadMock]);
 * };
 */
export const useCancellableRequest = (request: CancellableRequest, deps: unknown[] = []) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const callback = useCallback(request, deps);
    // this callback will be changed only if one of passed dependencies is changed
    // and in the same moment it will run this useEffect
    useEffect(() => {
        const handler = callback();
        // what to do on effect disposion, i.e. on unmounting or getting new value of deps
        return () => {
            handler.cancel();
        };
    }, [callback]);
};

export const Exapmle = () => {
    const {requestTasksCancellable} = useTaskManagerFeature();

    useCancellableRequest(() => requestTasksCancellable(), []);

};