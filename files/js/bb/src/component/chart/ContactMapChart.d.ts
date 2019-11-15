import * as React from 'react';
import { BioblocksWidgetConfig, IPlotlyData, SECONDARY_STRUCTURE, SECONDARY_STRUCTURE_KEYS } from '../../data';
import { ColorMapper } from '../../helper';
export interface IContactMapChartProps {
    configurations: BioblocksWidgetConfig[];
    contactData: IContactMapChartData[];
    height: number | string;
    isDataLoading: boolean;
    legendModifiers: {
        y: number;
    };
    marginModifiers: {
        b: number;
        l: number;
    };
    range: number;
    secondaryStructures: SECONDARY_STRUCTURE[];
    secondaryStructureColors?: ColorMapper<SECONDARY_STRUCTURE_KEYS>;
    selectedSecondaryStructures: SECONDARY_STRUCTURE[];
    selectedSecondaryStructuresColor: string;
    showConfigurations: boolean;
    width: number | string;
    dataTransformFn(entry: IContactMapChartData, mirrorPoints: boolean): Partial<IPlotlyData>;
    onClickCallback?(...args: any[]): void;
    onHoverCallback?(...args: any[]): void;
    onSelectedCallback?(...args: any[]): void;
    onUnHoverCallback?(...args: any[]): void;
}
export interface IContactMapChartState {
    numLegends: number;
    plotlyData: Array<Partial<IPlotlyData>>;
    showlegend: boolean;
}
export interface IContactMapChartData extends Partial<IPlotlyData> {
    name: string;
    nodeSize: number;
    points: IContactMapChartPoint[];
    subtitle?: string;
}
export declare const generateChartDataEntry: (hoverinfo: "all" | "none" | "text" | "x" | "name" | "skip" | "x+text" | "x+name" | "x+y" | "x+y+text" | "x+y+name" | "x+y+z" | "x+y+z+text" | "x+y+z+name" | "y+name" | "y+x" | "y+text" | "y+x+text" | "y+x+name" | "y+z" | "y+z+text" | "y+z+name" | "y+x+z" | "y+x+z+text" | "y+x+z+name" | "z+x" | "z+x+text" | "z+x+name" | "z+y+x" | "z+y+x+text" | "z+y+x+name" | "z+x+y" | "z+x+y+text" | "z+x+y+name", color: string | {
    start: string;
    end: string;
}, name: string, subtitle: string, nodeSize: number, points: IContactMapChartPoint[], extra?: Partial<IPlotlyData>) => IContactMapChartData;
export interface IContactMapChartPoint {
    dist?: number;
    i: number;
    j: number;
}
/**
 * Intermediary between a ContactMap and a PlotlyChart.
 *
 * Will transform data and setup layout from science/bioblocks into a format suitable for Plotly consumption.
 * @extends {React.Component<IContactMapChartProps, any>}
 */
export declare class ContactMapChart extends React.Component<IContactMapChartProps, IContactMapChartState> {
    static defaultProps: {
        configurations: BioblocksWidgetConfig[];
        dataTransformFn: (entry: IContactMapChartData, mirrorPoints?: boolean) => Partial<IPlotlyData>;
        height: string;
        isDataLoading: boolean;
        legendModifiers: {
            y: number;
        };
        marginModifiers: {
            b: number;
            l: number;
        };
        range: number;
        secondaryStructures: never[];
        selectedSecondaryStructures: never[];
        selectedSecondaryStructuresColor: string;
        showConfigurations: boolean;
        width: string;
    };
    constructor(props: IContactMapChartProps);
    componentDidMount(): void;
    componentDidUpdate(prevProps: IContactMapChartProps): void;
    render(): JSX.Element;
    /**
     * Sets up the chart and axis data for the ContactMap.
     *
     * Transforms all data from bioblocks terminology to data properly formatted for Plotly consumption.
     */
    protected setupData(): void;
    protected toggleLegendVisibility: () => void;
}
