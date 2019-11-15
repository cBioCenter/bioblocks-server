import { Map } from 'immutable';
import { Reducer } from 'redux';
export declare type IObjectReducerState<T> = Map<string, T>;
export declare const ObjectReducer: <T>(dataset: string, namespace?: string) => Reducer<any, import("redux").AnyAction>;
export declare const createObjectReducer: <T>(dataset: string, namespace?: string) => void;
