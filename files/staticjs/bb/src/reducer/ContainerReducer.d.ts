import { Set } from 'immutable';
import { Reducer } from 'redux';
export declare type IContainerReducerState<T> = Set<T>;
export declare const ContainerReducer: <T>(dataset: string, namespace?: string) => Reducer<any, import("redux").AnyAction>;
export declare const createContainerReducer: <T>(dataset: string, namespace?: string) => void;
