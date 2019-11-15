import { Set } from 'immutable';
import * as React from 'react';
import { Dataset } from '../data';
export declare const enum BIOBLOCKS_LOADING_STATUS {
    'ERROR' = 0,
    'LOADING' = 1,
    'NOT_STARTED' = 2,
    'READY' = 3
}
export declare type BioblocksHookCallback<T> = () => T;
export interface IBioblocksHookDict {
    [key: string]: BioblocksHookCallback<any>;
}
export declare abstract class BioblocksVisualization<P = any, S = any, SS = any> extends React.Component<P, S, SS> {
    static getActiveBioblocksVisualizations: () => Set<BioblocksVisualization<any, any, any>>;
    private static activeBioblocksVisualizations;
    protected bioblocksHooks: IBioblocksHookDict;
    protected datasets: Set<Dataset>;
    private loadingStatus;
    constructor(props: P);
    abstract setupDataServices(): void;
    componentWillUnmount(): void;
    addBioblocksHook<T>(name: string, cb: () => T): void;
    registerDataset<T>(name: string, defaultValue?: T, namespace?: string): void;
    finishLoading(): void;
    getDatasets(): Set<Dataset>;
    getComponentBioblocksHooks(): IBioblocksHookDict;
    getLoadingStatus(): BIOBLOCKS_LOADING_STATUS;
    teardown(): void;
    protected createReducer<T>(datasetName: string, defaultValue: T, namespace?: string): void;
}
