import { Dispatch } from 'redux';
import { ISpringGraphData, SPECIES_TYPE } from '../data';
export declare const fetchSpringGraphData: (fetchFn: () => Promise<ISpringGraphData>, namespace?: string) => (dispatch: Dispatch<import("redux").AnyAction>) => Promise<void>;
export declare const createSpringActions: (namespace?: string) => {
    category: {
        clear: import("typesafe-actions/dist/types").NoArgCreator<string>;
        set: (payload: string) => {
            type: string;
        } & {
            meta: string;
            payload: string;
        };
    };
    graphData: {
        request: import("typesafe-actions/dist/types").NoArgCreator<string>;
        success: import("typesafe-actions/dist/types").PayloadCreator<string, ISpringGraphData>;
        failure: import("typesafe-actions/dist/types").PayloadCreator<string, Error>;
    };
    species: {
        clear: import("typesafe-actions/dist/types").NoArgCreator<string>;
        set: (payload: SPECIES_TYPE) => {
            type: string;
        } & {
            meta: string;
            payload: SPECIES_TYPE;
        };
    };
};
