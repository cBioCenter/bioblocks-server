import { AminoAcid, COUPLING_SCORE_SOURCE, ICouplingScore, ICouplingScoreFilter } from './';
/**
 * A CouplingContainer provides access to the coupling information of residue pairs.
 *
 * Behind the scenes, it is backed by a sparse 2D array to avoid data duplication and provide O(1) access.
 *
 * @export
 */
export declare class CouplingContainer implements IterableIterator<ICouplingScore> {
    readonly scoreSource: COUPLING_SCORE_SOURCE;
    static fromJSON(other: object): CouplingContainer & object;
    protected static getScore(couplingScore: ICouplingScore, scoreSource: COUPLING_SCORE_SOURCE): number | undefined;
    protected contacts: ICouplingScore[][];
    protected indexRange: {
        max: number;
        min: number;
    };
    isDerivedFromCouplingScores: boolean;
    /** How many distinct contacts are currently stored. */
    protected totalStoredContacts: number;
    private derivedFromCouplingScoresFlag;
    /** Used for iterator access. */
    private rowCounter;
    /** Used for iterator access. */
    private colCounter;
    constructor(scores?: ICouplingScore[], scoreSource?: COUPLING_SCORE_SOURCE);
    readonly allContacts: ICouplingScore[][];
    readonly chainLength: number;
    readonly rankedContacts: ICouplingScore[];
    readonly residueIndexRange: {
        max: number;
        min: number;
    };
    readonly sequence: string;
    readonly totalContacts: number;
    [Symbol.iterator](): IterableIterator<ICouplingScore>;
    /**
     * Add a coupling score to this collection. If there is already an entry for this (i,j) contact, it will be overridden!
     *
     * @param score A Coupling Score to add to the collection.
     */
    addCouplingScore(score: ICouplingScore): void;
    getAminoAcidOfContact(resno: number): AminoAcid | undefined;
    /**
     * Determine which contacts in this coupling container are observed.
     *
     * @param [distFilter=10] - For each score, if dist <= distFilter, it is considered observed.
     * @returns Contacts that should be considered observed in the current data set.
     */
    getObservedContacts(distFilter?: number): ICouplingScore[];
    /**
     * Determine which contacts in this coupling container are both predicted and correct.
     *
     * @param totalPredictionsToShow How many predictions, max, to return.
     * @param [linearDistFilter=5] For each score, if |i - j| >= linearDistFilter, it will be a candidate for being correct/incorrect.
     * @param [measuredContactDistFilter=5]  If the dist for the contact is less than predictionCutoffDist, it is considered correct.
     * @returns An object containing 2 array fields: correct and predicted.
     */
    getPredictedContacts(totalPredictionsToShow: number, measuredContactDistFilter?: number, filters?: ICouplingScoreFilter[]): {
        correct: ICouplingScore[];
        predicted: ICouplingScore[];
    };
    /**
     * Primary interface for getting a coupling score, provides access to the same data object regardless of order of (firstRes, secondRes).
     */
    getCouplingScore: (firstRes: number, secondRes: number) => ICouplingScore | undefined;
    includes: (firstRes: number, secondRes: number) => boolean;
    next(): IteratorResult<ICouplingScore>;
    updateContact(i: number, j: number, couplingScore: Partial<Omit<ICouplingScore, 'i' | 'j'>>): void;
}
