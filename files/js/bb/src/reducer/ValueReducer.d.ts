import { Reducer } from 'redux';
export declare type IValueReducerState<T> = T;
export declare const ValueReducer: <T>(dataset: string, initialState: T, namespace?: string) => Reducer<any, import("redux").AnyAction>;
export declare const createValueReducer: <T>(dataset: string, initialState: T, namespace?: string) => void;
