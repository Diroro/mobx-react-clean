import {buildUrl} from '../../utils/url.utils';
import {getCookie} from '../../utils/cookie.utils';

/**
 * string[][] is required in following example
 * [
 *  [ 'param1', value1 ],
 *  [ 'param1', value2 ],
 *  [ 'param1', value3 ],
 * ]
 * Record wouldn't allow you to have several values for the same key
 * { param1: value1 }
 */
export type QueryParams = Record<string, string> | string[][];

export interface ApiRequest {
    url: string;
    query?: QueryParams;
    headers?: object;
    body?: object;
    signal: AbortSignal;
    isBodyJson?: boolean;
}

export type FullApiRequest = ApiRequest & {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
};

/**
 * API client which allow us to make and cancel requests
 */
export interface ApiClient {
    request: <R>(request: FullApiRequest) => Promise<R>;
    get: <R>(request: ApiRequest) => Promise<R>;
    post: <R>(request: ApiRequest) => Promise<R>;
    delete: <R>(request: ApiRequest) => Promise<R>;
    put: <R>(request: ApiRequest) => Promise<R>;
}

const isErrorResponse = ({status}: {status: number}): boolean => {
    return status >= 400;
};

export const createApiClient = (baseHref: string, extraHeaders?: object): ApiClient => {
    const request = async <R = never>(request: FullApiRequest): Promise<R> => {
        const url = `${baseHref}${buildUrl(request.url, request.query)}`;
        const body = JSON.stringify(request.body);

        const init: RequestInit = {
            method: request.method,
            headers: {
                'Content-Type': 'application/json',
                ...extraHeaders,
                ...request.headers,
            },
            signal: request.signal,
            body,
        };

        const response = await fetch(url, init);

		if (response.status === 401) {
			throw new Error('Unauthorized');
		}

		// probably to this on every not handled requests, non 4xx;
		if (isErrorResponse(response)) {
			throw new Error(response.statusText);
		}
		return response.json();
    };

    const get = <R = never>(apiRequest: ApiRequest): Promise<R> =>
        request({
            ...apiRequest,
            method: 'GET',
        });

    const post = <R = never>(apiRequest: ApiRequest): Promise<R> =>
        request({
            ...apiRequest,
            headers: apiRequest.headers ?? {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            },
            method: 'POST',
        });

    const deleteRequest = <R = never>(apiRequest: ApiRequest): Promise<R> =>
        request({
            ...apiRequest,
            method: 'DELETE',
        });

    const put = <R = never>(apiRequest: ApiRequest): Promise<R> =>
        request({
            ...apiRequest,
            headers: apiRequest.headers ?? {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            },
            method: 'PUT',
        });

    return {
        request,
        get,
        post,
        put,
        delete: deleteRequest,
    };
};