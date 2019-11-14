import { Middleware } from 'redux';
import { RootState } from './';
export interface IBioblocksStateTransformState {
    namespace?: string;
    stateName: string;
}
export interface IBioblocksStateTransform {
    fromState: string | IBioblocksStateTransformState;
    toState: string | IBioblocksStateTransformState;
    fn(state: RootState): any;
}
export declare const BioblocksMiddleware: Middleware;
export declare class BioblocksMiddlewareTransformer {
    readonly requiredDataSubs: string[];
    static transforms: Map<string, <T>(state: {
        [x: string]: any;
    }) => T>;
    static addTransform(transform: IBioblocksStateTransform): void;
    constructor(requiredDataSubs?: string[]);
}
