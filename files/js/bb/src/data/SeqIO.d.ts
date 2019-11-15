import { SeqRecord } from './';
export declare enum SEQUENCE_FILE_TYPES {
    'fasta' = "fasta"
}
/**
 * General sequence Input and Output functions
 *
 * @export
 */
export declare class SeqIO {
    static readonly DEFAULT_SEQ_PROPERTIES: {
        alphabet: undefined;
        ignoredCharacters: never[];
    };
    static parseFile(fileText: string, fileType: SEQUENCE_FILE_TYPES, seqProperties?: Partial<typeof SeqIO.DEFAULT_SEQ_PROPERTIES>): SeqRecord[];
    static getRandomSetOfSequences(sequences: SeqRecord[], n: number): SeqRecord[];
}
