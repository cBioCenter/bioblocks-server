import * as NGL from 'ngl';
import { CouplingContainer, IContactMapData, ISecondaryStructureData, ISpringGraphData, VIZ_TYPE } from '../data';
import { IResidueMapping } from './';
export declare const fetchAppropriateData: (viz: VIZ_TYPE, dataDir: string) => Promise<number[][] | IContactMapData | ISpringGraphData | NGL.Structure>;
export declare const fetchAppropriateDataFromFile: (viz: VIZ_TYPE, file: File) => Promise<NGL.Structure | {
    couplingScores: CouplingContainer;
}>;
export declare const fetchSpringData: (dataDir: string) => Promise<ISpringGraphData>;
export declare const fetchSpringCoordinateData: (file: string) => Promise<number[][]>;
export declare const fetchMatrixData: (filePath: string) => Promise<number[][]>;
export declare const fetchTSneCoordinateData: (dataDir: string) => Promise<number[][]>;
export declare const fetchTensorTSneCoordinateDataFromFile: (fileLocation: string) => Promise<number[][]>;
export declare const fetchTensorTSneCoordinateData: (dataDir: string) => Promise<number[][]>;
export declare const fetchGraphData: (file: string) => Promise<ISpringGraphData>;
export declare const fetchNGLDataFromDirectory: (dir: string) => Promise<NGL.Structure>;
export declare const fetchNGLDataFromFile: (file: NGL.ILoaderInput, params?: Partial<NGL.ILoaderParameters>) => Promise<NGL.Structure>;
export declare const fetchContactMapData: (dir: string, knownOrPredicted?: "predicted" | "known") => Promise<IContactMapData>;
/**
 * Parses a coupling_scores.csv file to generate the appropriate data structure.
 *
 * !Important!
 * Currently 12 fields are assumed to be part of a single coupling score.
 * As such, any rows with less will be ignored.
 *
 * @param line The csv file as a single string.
 * @param residueMapping Maps the coupling_score.csv residue number to the residue number for the PDB.
 * @returns Array of CouplingScores suitable for bioblocks-viz consumption.
 */
export declare const getCouplingScoresData: (line: string, residueMapping?: IResidueMapping[]) => CouplingContainer;
export declare const augmentCouplingScoresWithResidueMapping: (couplingScores: CouplingContainer, residueMapping?: IResidueMapping[]) => CouplingContainer;
/**
 * Parses a distance_map.csv file to generate the appropriate secondary structure mapping.
 *
 * !Important!
 * The first line in the csv will be ignored as it is assumed to be a csv header.
 *
 * !Important!
 * Currently 3 fields are assumed to be part of a single entry, with the second and third actually being relevant.
 * As such, any other rows will be ignored.
 *
 * @param line The csv file as a single string.
 * @returns Array of SecondaryStructure mappings suitable for bioblocks-viz consumption.
 */
export declare const getSecondaryStructureData: (line: string) => ISecondaryStructureData[];
/**
 * Randomly select and return "n" objects or indices (if returnIndices==true) and return
 * in a new array.
 *
 * If "n" is larger than the array, return the array directly or all the indices in the
 * array (if returnIndices==true).
 *
 * No duplicates are returned
 */
export declare function subsample<T, U extends boolean>(arr: T[], n: number, returnIndices?: boolean): Array<T | number>;
