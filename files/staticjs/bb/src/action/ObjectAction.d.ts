export declare const createObjectActions: <T>(datasetName: string, namespace?: string) => {
    add: (payload: {
        [key: string]: T;
    }) => {
        type: string;
    } & {
        meta: string;
        payload: {
            [key: string]: T;
        };
    };
    clear: import("typesafe-actions/dist/types").NoArgCreator<string>;
    remove: (payload: string) => {
        type: string;
    } & {
        meta: string;
        payload: string;
    };
    removeMultiple: (payload: string[]) => {
        type: string;
    } & {
        meta: string;
        payload: string[];
    };
    set: (payload: {
        [key: string]: T;
    }) => {
        type: string;
    } & {
        meta: string;
        payload: {
            [key: string]: T;
        };
    };
    toggle: (payload: {
        [key: string]: T;
    }) => {
        type: string;
    } & {
        meta: string;
        payload: {
            [key: string]: T;
        };
    };
};
