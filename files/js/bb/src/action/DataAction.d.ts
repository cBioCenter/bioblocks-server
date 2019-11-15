import { Dispatch } from 'redux';
export declare const createDataActions: <T>(datasetName: string, namespace?: string) => import("typesafe-actions/dist/create-async-action").AsyncActionBuilder<string, string, string, void, T, Error>;
export declare const fetchDataset: <T>(datasetName: string, fetchFn: () => Promise<T>, namespace?: string) => (dispatch: Dispatch<import("redux").AnyAction>) => Promise<void>;
