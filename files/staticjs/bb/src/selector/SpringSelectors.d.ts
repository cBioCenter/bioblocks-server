import { Set } from 'immutable';
import { ISpringReducerState } from '../reducer';
export declare const getSpring: (state: {
    [x: string]: any;
}, namespace?: string) => ISpringReducerState;
export declare const getGraphData: (state: {
    [x: string]: any;
}, namespace?: string) => import("..").ISpringGraphData;
export declare const getCategories: import("reselect").OutputParametricSelector<{
    [x: string]: any;
}, string | undefined, Set<string>, (res: import("..").ISpringGraphData) => Set<string>>;
export declare const getLabels: import("reselect").OutputParametricSelector<{
    [x: string]: any;
}, string | undefined, Set<string>, (res: import("..").ISpringGraphData) => Set<string>>;
