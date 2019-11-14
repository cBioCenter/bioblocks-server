export declare enum ALPHABET {
    'generic_dna' = "generic_dna",
    'generic_rna' = "generic_rna",
    'generic_protein' = "generic_protein"
}
export interface ISeqOpts {
    alphabet?: ALPHABET;
    ignoredCharacters?: string[];
    sequence: string;
}
/**
 * Seq
 * Provide objects to represent biological sequences with alphabets.
 */
export declare class Seq {
    static fromSeqOpts: (opts: ISeqOpts) => Seq;
    /**
     * checkSequenceValidity
     * This convenience method will check whether a sequence contains only the characters
     * in a particular string. Useful for asking whether a sequence contains only valid
     * amino acids or nucleotides. Case insensitive.
     *
     * @param sequence the sequence to evaluate.
     * @param validSequenceString a string that contains all the valid letters for this
     *                            sequence e.g., IUPACData protein_letters.
     * @param ignoredCharacters a list of characters to ignore in determining whether the
     *                          sequence is valid e.g., a dash that represents a gap.
     */
    private static checkSequenceValidity;
    readonly alphabet: ALPHABET | undefined;
    readonly sequence: string;
    readonly ignoredCharacters: string[];
    /**
     * Create a new Seq object.
     * @param sequence A representation of the sequence as a string.
     * @param alphabet The type of sequence.
     * @param ignoredCharacters Characters that should be ignored in the sequence such
     *                          as a gap "-".
     * @throws an error if the alphabet is declared, but it doesn't match the sequence.
     */
    constructor(sequence: string, alphabet?: ALPHABET, ignoredCharacters?: string[]);
    isValidProtein(ignoredCharacters?: string[]): boolean;
    isValidDNA(ignoredCharacters?: string[]): boolean;
    isValidRNA(ignoredCharacters?: string[]): boolean;
    /**
     * Determine the alphabet of the sequence. If this.alphabet is already set, return
     * it directly, otherwise attempt to predict the alphabet. Not perfect - for example
     * if the sequence only has 'agc' then it returns DNA even though this would
     * be a valid protein or RNA. Preference order is DNA, RNA, then protein.
     * Only canonical nucleotides and protein sequences are evaluated (not ambiguous).
     * @param ignoredCharacters: an array of characters to ignore in the
     *                           assignment. Defaults to dash only (gaps).
     */
    determineAlphabet(ignoredCharacters?: string[]): ALPHABET | undefined;
    /**
     * Test for equality between two sequences - case insensitive. this.ignoredCharacters are
     * not evaluated in the equality comparison.
     * @param seqToCompare the sequence to compare this object to
     * @returns true if the sequences and their alphabets are equal, false otherwise.
     */
    equal(seqToCompare: Seq): boolean;
    /**
     * Returns a binary representation of this sequence.
     *
     * Characters not in the alphabet (20 single letter amino acids and 4 nucleotide
     * characters) or that are not a dash are ignored by default. This means that the
     * array for these positions will be all zeros. Other characters will
     * be included if added to the "additionalAcceptedCharacters" array parameter.
     *
     * @param additionalAcceptedCharacters characters that should be considered valid and
     *                                     included in the return array.
     * @returns a binary array that is a concatenation of each position's individual
     *          binary array:
     *     for proteins - each position is represented by a binary array of length 20 plus
     *                    the number of additional characters (parameter). A single one of
     *                    the indices will be one and the rest zero.
     *     for oligos   - each position is represented by a binary array of length 4 plus
     *                    the number of additional characters (parameter).  A single one of
     *                    the indices will be one and the rest zero.
     *    NOTE: the index that is set to 1 is arbitrary but will be consistent with each
     *          function call - it is set from indexing the strings in IUPACData:
     *          protein_letters, unambiguous_dna_letters and unambiguous_rna_letters
     */
    binaryRepresentation(additionalAcceptedCharacters?: string[]): number[];
    /**
     * integerRepresentation
     * Returns an integer representation of this sequence. Each index in the array
     * represents a single position. ** The values have no meaning other than to check
     * for equality in a custom hamming distance function. **
     *
     * Characters not found will be represented as -1 in the returned array
     *
     * @param additionalAcceptedCharacters characters to consider valid and add to
     *                                     give  returned array.
     */
    integerRepresentation(additionalAcceptedCharacters?: string[]): number[];
    toString(): string;
    upper(): Seq;
    lower(): Seq;
    subSequence(startIdx?: number, endIdx?: number): Seq;
    /**
     * complement()
     * Return the complement sequence by creating a new Seq object.
     * @param reverse if true, will return the sequence reversed
     * @returns a new sequence complemented from this sequence
     * @throws errors if this sequence is not valid DNA or RNA.
     */
    complement(reverse?: boolean): Seq;
    /**
     * reverse_complement()
     * Return the reverse complement sequence by creating a new Seq object.
     */
    reverse_complement(): Seq;
    /**
     * transcribe()
     * Return the RNA sequence from a DNA sequence by creating a new Seq object
     */
    transcribe(): Seq;
    /**
     * back_transcribe()
     * Return the DNA sequence from an RNA sequence by creating a new Seq object
     */
    back_transcribe(): Seq;
    /**
     * translate(table, stop_symbol='*', to_stop=False, cds=False, gap=None)
     * Turn a nucleotide sequence into a protein sequence by creating a new Seq object
     *     TODO: implement "gap" parameter.
     */
    translate(stopSymbol?: string, toStop?: boolean, cds?: boolean): Seq;
}
