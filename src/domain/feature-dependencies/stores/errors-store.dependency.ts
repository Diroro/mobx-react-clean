// @TODO add error key as enum

export interface ErrorsStore {
    handleError: (key: string) => (error?: Error) => void;
}