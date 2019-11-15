import { Reducer } from 'redux';
import { StateType } from 'typesafe-actions';
export interface IReducerMap {
    [key: string]: Reducer;
}
export declare type ReducerRegistryListener = (reducers: IReducerMap) => void;
export declare type RootState = StateType<{
    [key: string]: Reducer;
}>;
/**
 *
 * Based off this post on how Twitter handles redux modules:
 * http://nicolasgallagher.com/redux-modules-and-code-splitting/
 */
declare class ReducerRegistryClass {
    private emitChange;
    private reducers;
    constructor();
    getReducers(): {
        [x: string]: Reducer<any, import("redux").AnyAction>;
    };
    register(name: string, reducer: Reducer): void;
    setChangeListener(listener: ReducerRegistryListener): void;
}
declare const ReducerRegistry: ReducerRegistryClass;
export { ReducerRegistry };
