type QueryParams = Record<string, string> | string[][];

/**
 * create url from path and query
 * @param url
 * @param query
 */
 export const buildUrl = (url: string, query?: QueryParams): string => {
    const searchParams = new URLSearchParams(query);
    return `${url}${query ? '?' + searchParams.toString() : ''}`;
};
