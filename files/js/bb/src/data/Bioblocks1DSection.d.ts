/**
 * Class to encapsulate a 1 Dimensional data segment.
 * This is defined as a numerical range with inclusive start, inclusive end, and label associated with it.
 * Additionally, a Section is defined such that [start <= end] - meaning values will be flipped to keep this constraint.
 *
 * @export
 */
export declare class Bioblocks1DSection<T> {
    readonly label: T;
    protected sectionEnd: number;
    protected sectionStart: number;
    readonly end: number;
    readonly length: number;
    readonly start: number;
    constructor(label: T, start: number, end?: number);
    contains(...values: number[]): boolean;
    isEqual(otherSection: Bioblocks1DSection<T>): boolean;
    updateStart(newNum: number): void;
    updateEnd(newNum: number): void;
}
