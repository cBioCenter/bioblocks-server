export declare const createValueActions: <T>(datasetName: string, namespace?: string) => {
    clear: import("typesafe-actions/dist/types").NoArgCreator<string>;
    set: import("typesafe-actions/dist/types").Box<T> extends import("typesafe-actions/dist/types").Box<void> ? () => {
        type: string;
    } & {
        meta: string;
        payload: T;
    } : (payload: T) => {
        type: string;
    } & {
        meta: string;
        payload: T;
    };
};
