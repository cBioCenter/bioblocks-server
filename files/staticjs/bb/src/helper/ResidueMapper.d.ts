import { AMINO_ACID_1LETTER_CODE } from '../data';
export interface IResidueMapping {
    /** Name of the residue in the PDB file. */
    pdbResCode: AMINO_ACID_1LETTER_CODE;
    /** Number of the residue in the PDB file. */
    pdbResno: number;
    /** Number of the residue from CouplingScores file. */
    couplingsResno: number;
    /** Single letter code of the residue from CouplingScores file. */
    couplingsResCode: AMINO_ACID_1LETTER_CODE;
}
/**
 * Determines the mapping of residues from a UniProt file to a PDB, given a indextableplus file.
 *
 * @description This file is, semantically, a csv with 4 headers:
 *
 * up_index - UniProt residue number.
 *
 * up_residue - UniProt residue name.
 *
 * pdb_index - PDB residue number.
 *
 * pdb_residue - PDB residue name.
 *
 * @param text The contents of a indextableplus file.
 * @returns Array of all residue mappings.
 */
export declare const generateResidueMapping: (text: string) => IResidueMapping[];
