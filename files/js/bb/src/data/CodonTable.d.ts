/**
 * Codon tables based on those from the NCBI.
 * Inspired from BioPython IUPACData.py:
 *     https://github.com/biopython/biopython/blob/master/Bio/Data/CodonTable.py
 *     which is under the BSD 3-Clause License with Copyright 2000 Andrew Dalke
 *
 * Note: only implemented a very small subset of BioPython functionality.
 */
export declare class CodonTable {
    readonly id: number;
    readonly name: string;
    readonly altName: string;
    readonly table: Record<string, string>;
    readonly startCodons: string[];
    readonly stopCodons: string[];
    static rnaTableFromDNACodonTable(id: number, name: string, altName: string, dnaCodonTable: CodonTable): CodonTable;
    constructor(id: number, name: string, altName: string, table: Record<string, string>, // { [key: string]: string }, //{ [key: string]: string },
    startCodons: string[], stopCodons: string[]);
}
export declare const standardDnaCodonTable: CodonTable;
export declare const standardRnaCodonTable: CodonTable;
