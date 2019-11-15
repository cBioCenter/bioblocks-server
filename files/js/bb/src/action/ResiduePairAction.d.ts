export declare const createResiduePairActions: (namespace?: string) => {
    candidates: {
        add: (payload: number) => {
            type: string;
        } & {
            meta: string;
            payload: number;
        };
        addMultiple: (payload: number[]) => {
            type: string;
        } & {
            meta: string;
            payload: number[];
        };
        clear: import("typesafe-actions/dist/types").NoArgCreator<string>;
        remove: (payload: number) => {
            type: string;
        } & {
            meta: string;
            payload: number;
        };
        removeMultiple: (payload: number[]) => {
            type: string;
        } & {
            meta: string;
            payload: number[];
        };
        set: (payload: number[]) => {
            type: string;
        } & {
            meta: string;
            payload: number[];
        };
    };
    hovered: {
        add: (payload: number) => {
            type: string;
        } & {
            meta: string;
            payload: number;
        };
        addMultiple: (payload: number[]) => {
            type: string;
        } & {
            meta: string;
            payload: number[];
        };
        clear: import("typesafe-actions/dist/types").NoArgCreator<string>;
        remove: (payload: number) => {
            type: string;
        } & {
            meta: string;
            payload: number;
        };
        removeMultiple: (payload: number[]) => {
            type: string;
        } & {
            meta: string;
            payload: number[];
        };
        set: (payload: number[]) => {
            type: string;
        } & {
            meta: string;
            payload: number[];
        };
    };
    locked: {
        add: (payload: {
            [key: string]: number[];
        }) => {
            type: string;
        } & {
            meta: string;
            payload: {
                [key: string]: number[];
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
            [key: string]: number[];
        }) => {
            type: string;
        } & {
            meta: string;
            payload: {
                [key: string]: number[];
            };
        };
        toggle: (payload: {
            [key: string]: number[];
        }) => {
            type: string;
        } & {
            meta: string;
            payload: {
                [key: string]: number[];
            };
        };
    };
};
