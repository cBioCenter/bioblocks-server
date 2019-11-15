import { Bioblocks1DSection, BIOBLOCKS_PLOTLY_DATA } from '../../data';
import { ColorMapper } from '../../helper';
/**
 * Shorthand to refer to something with both an x and y axis.
 */
export interface IAxisMapping {
    /** The x axis. */
    x: BIOBLOCKS_PLOTLY_DATA;
    /** The y axis. */
    y: BIOBLOCKS_PLOTLY_DATA;
}
/**
 * Class to represent an extra x and/or y axis for a Plotly chart.
 */
export declare class AuxiliaryAxis<T extends string> {
    readonly sections: Array<Bioblocks1DSection<T>>;
    readonly axisIndex: number;
    readonly colorMap: ColorMapper<T>;
    readonly dataTransformFn?: {
        [key: string]: (section: Bioblocks1DSection<T>, index: number) => {
            main: number;
            opposite: number;
        };
    } | undefined;
    readonly filterFn: (section: Bioblocks1DSection<T>) => boolean;
    protected axes: Map<T, IAxisMapping>;
    protected highlightedAxes: Map<T, IAxisMapping>;
    /**
     * Get all the axis objects belonging to this Auxiliary Axis.
     */
    readonly axis: Map<T, IAxisMapping>;
    /**
     * Get all the x-axis objects belonging to this Auxiliary Axis.
     */
    readonly xAxes: Partial<BIOBLOCKS_PLOTLY_DATA>[];
    /**
     * Get all the highlighted x-axis objects belonging to this Auxiliary Axis.
     */
    readonly highlightedXAxes: Partial<BIOBLOCKS_PLOTLY_DATA>[];
    /**
     * Get all the y-axis objects belonging to this Auxiliary Axis.
     */
    readonly yAxes: Partial<BIOBLOCKS_PLOTLY_DATA>[];
    /**
     * Get all the highlighted y-axis objects belonging to this Auxiliary Axis.
     */
    readonly highlightedYAxes: Partial<BIOBLOCKS_PLOTLY_DATA>[];
    /**
     * Creates an instance of AuxiliaryAxis.
     * @param sections The underlying data to be represented by these axes.
     * @param [axisIndex=2] The index of this axis, if there are multiple auxiliary axes.
     * @param [colorMap] Allows specific data pieces to be colored and provide a default color.
     * @param [dataTransformFn] Determine how a section is to be transformed to the main and opposite axis.
     *  For example, for a sine wave, the main axis increments by 1 but the opposite needs to be increased by a Math.sin() call.
     * @param [filterFn=() => false] Function to allow certain elements to be filtered out and thus not show up on the axis.
     */
    constructor(sections: Array<Bioblocks1DSection<T>>, axisIndex?: number, colorMap?: ColorMapper<T>, dataTransformFn?: {
        [key: string]: (section: Bioblocks1DSection<T>, index: number) => {
            main: number;
            opposite: number;
        };
    } | undefined, filterFn?: (section: Bioblocks1DSection<T>) => boolean);
    getAxisById(id: T): IAxisMapping | undefined;
    /**
     * Create the Auxiliary Axis.
     */
    protected setupAuxiliaryAxis(): void;
    /**
     * Plotly data specific for the x axis.
     *
     * @param key The label for this piece of data.
     */
    protected generateXAxisSegment: (key: T) => BIOBLOCKS_PLOTLY_DATA;
    /**
     * Plotly data specific for the highlighted x axis.
     *
     * @param key The label for this piece of data.
     */
    protected generateHighlightedXAxisSegment: (key: T) => BIOBLOCKS_PLOTLY_DATA;
    /**
     * Plotly data specific for the y axis.
     *
     * @param key The label for this piece of data.
     */
    protected generateYAxisSegment: (key: T) => BIOBLOCKS_PLOTLY_DATA;
    /**
     * Plotly data specific for the highlighted y axis.
     *
     * @param key The label for this piece of data.
     */
    protected generateHighlightedYAxisSegment: (key: T) => BIOBLOCKS_PLOTLY_DATA;
    /**
     * Default plotly data for an axis.
     *
     * @param key The label for this piece of data.
     */
    protected auxiliaryAxisDefaults: (key: T) => Required<Pick<import("../../data").IPlotlyData, "marker" | "x" | "y" | "line" | "type" | "name" | "showlegend" | "mode" | "hoverinfo" | "connectgaps">>;
    /**
     * Default plotly data for a highlighted axis.
     *
     * @param key The label for this piece of data.
     */
    protected highlightedAuxiliaryAxisDefaults: (key: T) => BIOBLOCKS_PLOTLY_DATA;
    /**
     * Determines the points that make up the axis for both the main and opposite axis side.
     * @param section The section of data to derive points for.
     */
    protected derivePointsInAxis: (section: Bioblocks1DSection<T>) => {
        main: number[];
        opposite: (number | null)[];
    };
    protected deriveHighlightedPointsInAxis: (section: Bioblocks1DSection<T>) => {
        main: number[];
        opposite: (number | null)[];
    };
}
