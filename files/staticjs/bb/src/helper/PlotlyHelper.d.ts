import { IContactMapChartData } from '../component';
import { ICouplingScore, IPlotlyData } from '../data';
/**
 * Generate data in the expected format for a WebGL Scatter plot.
 *
 * @param entry A unit of Plotly data containing points, color, name, and any extras.
 * @param mirrorPoints Should we mirror the points on the x/y axis?
 * @returns Data suitable for consumption by Plotly.
 */
export declare const generateScatterGLData: (entry: IContactMapChartData, mirrorPoints?: boolean) => Partial<IPlotlyData>;
/**
 * Generate data in the expected format for a Scatter plot.
 *
 * @param entry A unit of Plotly data containing points, color, name, and any extras.
 * @param mirrorPoints Should we mirror the points on the x/y axis?
 * @returns Data suitable for consumption by Plotly.
 */
export declare const generateScatterData: (entry: IContactMapChartData, mirrorPoints?: boolean) => Partial<IPlotlyData>;
/**
 * Determines the appropriate hover text in plotly for this coupling score.
 *
 * Currently the following 3 fields will be appended if present:
 * - Amino acid (A_i, A_j)
 * - Score
 * - Probability
 */
export declare const generateCouplingScoreHoverText: (point: ICouplingScore) => string;
export declare const generateFloat32ArrayFromContacts: (array: {
    i: number;
    j: number;
}[]) => Float32Array;
/**
 * Generate data in the expected format for a Plotly PointCloud.
 *
 * @param entry A unit of Plotly data containing points, color, and any extras.
 * @param mirrorPoints Should we mirror the points on the x/y axis?
 * @returns Data suitable for consumption by Plotly.
 */
export declare const generatePointCloudData: (entry: IContactMapChartData, mirrorPoints?: boolean) => Partial<IPlotlyData>;
