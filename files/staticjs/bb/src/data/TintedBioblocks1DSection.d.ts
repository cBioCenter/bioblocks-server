import { Color } from 'plotly.js/lib/index-gl2d';
import { Bioblocks1DSection } from './';
/**
 * Class to encapsulate a 1 Dimensional data segment that has an associated color with it.
 *
 * @export
 * @extends Bioblocks1DSection
 */
export declare class TintedBioblocks1DSection<T> extends Bioblocks1DSection<T> {
    readonly label: T;
    protected sectionColor: Color;
    readonly color: Color;
    constructor(label: T, start: number, end?: number, color?: Color);
    updateColor(color: Color): void;
}
