import { AuxiliaryAxis } from './';
import { IPlotlyData, SECONDARY_STRUCTURE, SECONDARY_STRUCTURE_KEYS } from '../../data';
import { ColorMapper } from '../../helper';
/**
 * Class to represent the x and y axis for a secondary structure on a Plotly graph.
 *
 * @export
 */
export declare class SecondaryStructureAxis extends AuxiliaryAxis<SECONDARY_STRUCTURE_KEYS> {
    readonly sections: SECONDARY_STRUCTURE;
    readonly minimumRequiredResidues: number;
    readonly axisIndex: number;
    readonly colorMap: ColorMapper<"G" | "H" | "I" | "T" | "E" | "B" | "S" | "C">;
    readonly dataTransformFn: {
        C: (section: import("../../data").Bioblocks1DSection<"G" | "H" | "I" | "T" | "E" | "B" | "S" | "C">, index: number) => {
            main: number;
            opposite: number;
        };
        E: (section: import("../../data").Bioblocks1DSection<"G" | "H" | "I" | "T" | "E" | "B" | "S" | "C">, index: number) => {
            main: number;
            opposite: number;
        };
        H: (section: import("../../data").Bioblocks1DSection<"G" | "H" | "I" | "T" | "E" | "B" | "S" | "C">, index: number) => {
            main: number;
            opposite: number;
        };
    };
    readonly filterFn: (section: import("../../data").Bioblocks1DSection<"G" | "H" | "I" | "T" | "E" | "B" | "S" | "C">) => boolean;
    protected static centerSectionPositionFn: (section: import("../../data").Bioblocks1DSection<"G" | "H" | "I" | "T" | "E" | "B" | "S" | "C">, index: number) => {
        main: number;
        opposite: number;
    };
    constructor(sections: SECONDARY_STRUCTURE, minimumRequiredResidues?: number, axisIndex?: number, colorMap?: ColorMapper<"G" | "H" | "I" | "T" | "E" | "B" | "S" | "C">, dataTransformFn?: {
        C: (section: import("../../data").Bioblocks1DSection<"G" | "H" | "I" | "T" | "E" | "B" | "S" | "C">, index: number) => {
            main: number;
            opposite: number;
        };
        E: (section: import("../../data").Bioblocks1DSection<"G" | "H" | "I" | "T" | "E" | "B" | "S" | "C">, index: number) => {
            main: number;
            opposite: number;
        };
        H: (section: import("../../data").Bioblocks1DSection<"G" | "H" | "I" | "T" | "E" | "B" | "S" | "C">, index: number) => {
            main: number;
            opposite: number;
        };
    }, filterFn?: (section: import("../../data").Bioblocks1DSection<"G" | "H" | "I" | "T" | "E" | "B" | "S" | "C">) => boolean);
    protected setupAuxiliaryAxis(): void;
    /**
     * Generate the Plotly layout specific to beta sheet representation.
     *
     * @param data Data for this axis.
     * @param symbols The symbols that make up this axis. Should be an array of empty lines with an arrow at the end.
     * @returns Plotly layout specific to beta sheet representation.
     */
    protected generateBetaSheetStyle(data: Partial<IPlotlyData>, symbols: string[]): Partial<IPlotlyData>;
}
