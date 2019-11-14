import { BioblocksPDB, CouplingContainer } from './';
export declare type AMINO_ACID_FULL_NAME = keyof {
    [K in (ReturnType<typeof AminoAcid.ALL_FULL_NAMES>)[number]]: string;
};
export declare type AMINO_ACID_1LETTER_CODE = keyof {
    [K in (ReturnType<typeof AminoAcid.ALL_1LETTER_CODES>)[number]]: string;
};
export declare type AMINO_ACID_3LETTER_CODE = keyof {
    [K in (ReturnType<typeof AminoAcid.ALL_3LETTER_CODES>)[number]]: string;
};
export declare type AMINO_ACID_CODON = keyof {
    [K in (ReturnType<typeof AminoAcid.ALL_CODONS>)[number]]: string[];
};
export declare class AminoAcid {
    readonly fullName: string;
    readonly singleLetterCode: string;
    readonly threeLetterCode: string;
    readonly codons: readonly string[];
    static readonly Alanine: AminoAcid;
    static readonly Arginine: AminoAcid;
    static readonly Asparagine: AminoAcid;
    static readonly AsparticAcid: AminoAcid;
    static readonly Cysteine: AminoAcid;
    static readonly Glutamine: AminoAcid;
    static readonly GlutamicAcid: AminoAcid;
    static readonly Glycine: AminoAcid;
    static readonly Histidine: AminoAcid;
    static readonly Isoleucine: AminoAcid;
    static readonly Leucine: AminoAcid;
    static readonly Lysine: AminoAcid;
    static readonly Methionine: AminoAcid;
    static readonly Phenylalanine: AminoAcid;
    static readonly Proline: AminoAcid;
    static readonly Serine: AminoAcid;
    static readonly Threonine: AminoAcid;
    static readonly Tryptophan: AminoAcid;
    static readonly Tyrosine: AminoAcid;
    static readonly Valine: AminoAcid;
    static ALL_FULL_NAMES: () => string[];
    static ALL_1LETTER_CODES: () => string[];
    static ALL_3LETTER_CODES: () => string[];
    static ALL_CODONS: () => string[];
    static getAllCanonicalAminoAcids(): AminoAcid[];
    static fromSingleLetterCode(code: string): AminoAcid | undefined;
    static fromThreeLetterCode(code: string): AminoAcid | undefined;
    static fromCodon(codon: string): AminoAcid | undefined;
    private constructor();
}
export interface IResidueMismatchResult {
    couplingAminoAcid: AminoAcid;
    resno: number;
    pdbAminoAcid: AminoAcid;
}
export declare const getPDBAndCouplingMismatch: (pdbData: BioblocksPDB, couplingScores: CouplingContainer) => IResidueMismatchResult[];
export declare const getSequenceMismatch: (firstSequence: string, secondSequence: string) => IResidueMismatchResult[];
