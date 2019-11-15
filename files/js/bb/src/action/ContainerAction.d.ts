export declare const createContainerActions: <T>(datasetName: string, namespace?: string) => {
    add: import("typesafe-actions/dist/types").Box<T> extends import("typesafe-actions/dist/types").Box<void> ? () => {
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
    addMultiple: (payload: T[]) => {
        type: string;
    } & {
        meta: string;
        payload: T[];
    };
    clear: import("typesafe-actions/dist/types").NoArgCreator<string>;
    remove: import("typesafe-actions/dist/types").Box<T> extends import("typesafe-actions/dist/types").Box<void> ? () => {
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
    removeMultiple: (payload: T[]) => {
        type: string;
    } & {
        meta: string;
        payload: T[];
    };
    set: (payload: T[]) => {
        type: string;
    } & {
        meta: string;
        payload: T[];
    };
};
