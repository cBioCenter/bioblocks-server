import * as NGL from 'ngl';
import { Bioblocks1DSection, CONTACT_DISTANCE_PROXIMITY, CouplingContainer, ICouplingScore, IResidueMismatchResult, ISecondaryStructureData, SECONDARY_STRUCTURE_SECTION } from './';
/**
 * A BioblocksPDB instance provides an API to interact with a loaded PDB file while hiding the implementation details of how it is loaded.
 *
 * @export
 */
export declare class BioblocksPDB {
    readonly contactInformation: CouplingContainer;
    readonly name: string;
    readonly nglStructure: NGL.Structure;
    readonly rank: string;
    readonly secondaryStructure: ISecondaryStructureData[];
    readonly secondaryStructureSections: SECONDARY_STRUCTURE_SECTION[][];
    readonly sequence: string;
    readonly source: string;
    static readonly NGL_C_ALPHA_INDEX = "CA|C";
    static createEmptyPDB(): BioblocksPDB;
    /**
     * Creates an instance of BioblocksPDB with PDB data.
     *
     * !IMPORTANT! Since fetching the data is an asynchronous action, this must be used to create a new instance!
     */
    static createPDB(file?: File | string): Promise<BioblocksPDB>;
    static createPDBFromNGLData(nglData: NGL.Structure): BioblocksPDB;
    protected contactInfo?: CouplingContainer;
    protected fileName: string;
    protected nglData: NGL.Structure;
    private constructor();
    eachResidue(callback: (residue: NGL.ResidueProxy) => void): void;
    /**
     * Given some existing coupling scores, a new CouplingContainer will be created with data augmented with info derived from this PDB.
     *
     * @param couplingScores A collection of coupling scores to be augmented.
     * @param measuredProximity How to calculate the distance between two residues.
     * @returns A CouplingContainer with contact information from both the original array and this PDB file.
     */
    amendPDBWithCouplingScores(couplingScores: ICouplingScore[], measuredProximity: CONTACT_DISTANCE_PROXIMITY): CouplingContainer;
    /**
     * Find the index of the c-alpha atom for a given residue.
     *
     * @param residueIndex Index of the residue to find the c-alpha atom for.
     * @param alphaId Index that determines if an atom is a c-alpha.
     * @returns Index of the c-alpha atom with respect to the array of all of the atoms.
     */
    getCAlphaAtomIndexFromResidue(residueIndex: number, alphaId: number): number;
    /**
     * Helper function to find the smallest possible distance between two residues via their atoms.
     *
     * @param resnoI The first residue.
     * @param resnoJ The second residue.
     * @returns Shortest distance between the two residues in ångströms.
     */
    getMinDistBetweenResidues(resnoI: number, resnoJ: number): {
        atomIndexI: number;
        atomIndexJ: number;
        dist: number;
    };
    getResidueNumberingMismatches(contacts: CouplingContainer): IResidueMismatchResult[];
    getTrimmedName(separator?: string, wordsToTrim?: number, direction?: 'front' | 'back'): string;
    /**
     * Helper function to find the smallest possible distance between two residues via their atoms.
     *
     * @param indexI Index of the first residue with respect to the array of all residues.
     * @param indexJ Index of the second residue with respect to the array of all residues.
     * @returns Shortest distance between the two residues in ångströms.
     */
    protected getMinDistBetweenResidueIndices(indexI: number, indexJ: number): {
        atomIndexI: number;
        atomIndexJ: number;
        dist: number;
    };
    protected getSecStructFromNGLResidue: (residue: NGL.ResidueProxy, result: Bioblocks1DSection<"G" | "H" | "I" | "T" | "E" | "B" | "S" | "C">[][]) => void;
}
