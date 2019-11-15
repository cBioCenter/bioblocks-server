import { Map, Set } from 'immutable';
import { RESIDUE_TYPE } from '../data';
export declare type LockedResiduePair = Record<string, RESIDUE_TYPE[]>;
export interface IResiduePairReducerState {
    candidates: Set<RESIDUE_TYPE>;
    hovered: Set<RESIDUE_TYPE>;
    locked: Map<string, Set<RESIDUE_TYPE>>;
}
export declare const RESIDUE_PAIR_DATASET_NAME = "residuePair";
export declare const ResiduePairReducer: (namespace?: string) => import("redux").Reducer<{
    candidates: any;
    hovered: any;
    locked: any;
}, import("redux").AnyAction>;
export declare const createResiduePairReducer: (namespace?: string) => void;
