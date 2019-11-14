import { ISeqOpts, Seq } from './';
export interface ISeqRecordOpts {
    annotations: Partial<typeof SeqRecord.DEFAULT_ANNOTATIONS>;
    sequence: ISeqOpts;
}
/**
 * SeqRecord
 * This is a super class that provides additional annotation on top
 * of the standard Seq class.
 *
 * Inspired from BioPython SeqRecord.py:
 *     https://github.com/biopython/biopython/blob/master/Bio/SeqRecord.py
 *     which is under the BSD 3-Clause License
 */
export declare class SeqRecord extends Seq {
    readonly annotations: Partial<typeof SeqRecord.DEFAULT_ANNOTATIONS>;
    static readonly DEFAULT_ANNOTATIONS: {
        dbxrefs: never[];
        description: string;
        id: string;
        letterAnnotations: {};
        metadata: Record<string, string>;
        name: string;
    };
    static fromSeqRecordOpts: (opts: ISeqRecordOpts) => SeqRecord;
    constructor(sequence: Seq, annotations?: Partial<typeof SeqRecord.DEFAULT_ANNOTATIONS>);
}
