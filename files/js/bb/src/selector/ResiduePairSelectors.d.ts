import { Map, Set } from 'immutable';
import { IResiduePairReducerState } from '../reducer';
export declare const getResiduePairs: (state: {
    [x: string]: any;
}, namespace?: string) => IResiduePairReducerState;
export declare const getCandidates: (state: {
    [x: string]: any;
}, namespace?: string) => Set<number>;
export declare const getHovered: (state: {
    [x: string]: any;
}, namespace?: string) => Set<number>;
export declare const getLocked: (state: {
    [x: string]: any;
}, namespace?: string) => Map<string, Set<number>>;
