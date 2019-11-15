import { ISpringGraphData } from '../data';
export interface ISpringReducerState {
    category: string;
    graphData: ISpringGraphData;
}
export declare const SpringReducer: (namespace?: string) => import("redux").Reducer<{
    category: any;
    graphData: any;
}, import("redux").AnyAction>;
export declare const createSpringReducer: (namespace?: string) => void;
