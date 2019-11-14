import { Reducer } from 'redux';
export declare type IDataReducerState<T> = T;
export declare const DataReducer: <T>(dataset: string, initialState: T, namespace?: string) => Reducer<any, import("redux").AnyAction>;
export declare const createDataReducer: <T>(dataset: string, initialState: T, namespace?: string) => void;
