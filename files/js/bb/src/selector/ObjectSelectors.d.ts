import { Map } from 'immutable';
export declare const selectObject: <T>(state: {
    [x: string]: any;
}, dataset: string, namespace?: string) => Map<string, T>;
