import { Set } from 'immutable';
export declare const selectCurrentItems: <T>(state: {
    [x: string]: any;
}, dataset: string, namespace?: string) => Set<T>;
