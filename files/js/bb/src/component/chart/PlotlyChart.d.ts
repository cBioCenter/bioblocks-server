/// <reference types="node" />
import * as plotly from 'plotly.js/lib/index';
import * as React from 'react';
import { BIOBLOCKS_CHART_PIECE, BIOBLOCKS_CSS_STYLE, BioblocksChartEvent, IPlotlyData, IPlotlyLayout } from '../../data';
export interface IPlotlyChartProps {
    config?: Partial<Plotly.Config>;
    data: Array<Partial<IPlotlyData>>;
    height?: number | string;
    layout?: Partial<IPlotlyLayout>;
    showLoader?: boolean;
    style?: BIOBLOCKS_CSS_STYLE;
    width?: number | string;
    onAfterPlotCallback?(event: BioblocksChartEvent): void;
    onClickCallback?(event: BioblocksChartEvent): void;
    onDoubleClickCallback?(event: BioblocksChartEvent): void;
    onHoverCallback?(event: BioblocksChartEvent): void;
    onLegendClickCallback?(event: BioblocksChartEvent): boolean;
    onSelectedCallback?(event: BioblocksChartEvent): void;
    onUnHoverCallback?(event: BioblocksChartEvent): void;
    onRelayoutCallback?(event: BioblocksChartEvent): void;
}
export declare const defaultPlotlyConfig: Partial<Plotly.Config>;
export declare const defaultPlotlyLayout: Partial<IPlotlyLayout>;
/**
 * React wrapper for a Plotly Chart.
 *
 * @description
 * Based upon: https://github.com/davidctj/react-plotlyjs-ts
 *
 * @export
 * @extends {React.Component<IPlotlyChartProps, any>}
 */
export declare class PlotlyChart extends React.Component<IPlotlyChartProps, any> {
    static defaultProps: {
        config: {};
        data: never[];
        height: string;
        layout: {};
        showLoader: boolean;
        width: string;
    };
    plotlyCanvas: plotly.PlotlyHTMLElement | null;
    protected isDoubleClickInProgress: boolean;
    protected canvasRef: HTMLDivElement | null;
    protected plotlyFormattedData: Array<Partial<IPlotlyData>>;
    protected renderTimeout: undefined | NodeJS.Timer | number;
    protected savedAxisZoom?: {
        xaxis: plotly.PlotAxis;
        yaxis: plotly.PlotAxis;
    };
    protected savedCameraScene?: plotly.Camera;
    /**
     * Setup all the event listeners for the plotly canvas.
     */
    attachListeners(): void;
    componentDidMount(): Promise<void>;
    componentWillUnmount(): void;
    /**
     * Determines if we should send a draw call to Plotly based on if data has actually changed.
     *
     * @param prevProps The previous props for the PlotlyChart.
     */
    componentDidUpdate(prevProps: IPlotlyChartProps): Promise<void>;
    /**
     * Sends a draw call to Plotly since it is using canvas/WebGL which is outside of the locus of control for React.
     */
    draw: () => Promise<void>;
    render(): JSX.Element;
    /**
     * Resizes the inner Plotly canvas.
     */
    resize: () => void;
    /**
     * Create [0-n] plotly axes given some plotly data.
     *
     * @param allData The already formatted Plotly data - meaning each data should have the proper axis already assigned.
     * @returns A object containing xaxis and yaxis fields, as well as xaxis# and yaxis# fields where # is derived from the given data.
     */
    protected deriveAxisParams(allData: Array<Partial<IPlotlyData>>): Partial<IPlotlyLayout>;
    protected deriveChartPiece: (xDatum: plotly.Datum, yDatum: plotly.Datum, data?: plotly.PlotData | undefined) => {
        chartPiece: BIOBLOCKS_CHART_PIECE;
        selectedPoints: number[];
    };
    /**
     * Generate axis data for those beyond the original x/yaxis.
     *
     * @param ids All of the axis ids associated with plotly data.
     */
    protected generateExtraPlotlyAxis: (ids: Set<string>) => Partial<IPlotlyLayout>;
    protected generateExtraPlotlyAxisFromId(id: string): {
        [key: string]: Partial<Plotly.LayoutAxis>;
    };
    protected getMergedConfig: (config?: Partial<plotly.Config>) => plotly.Config;
    protected getMergedLayout: (layout?: Partial<IPlotlyLayout>, plotlyFormattedData?: Partial<IPlotlyData>[]) => Partial<plotly.Layout>;
    protected onAfterPlot: () => void;
    protected onClick: (event: plotly.PlotMouseEvent) => void;
    protected onDoubleClick: () => void;
    protected onHover: (event: plotly.PlotMouseEvent) => void;
    protected onLegendClick: (event: plotly.LegendClickEvent) => boolean;
    protected onRelayout: (event: plotly.PlotRelayoutEvent & {
        [key: string]: number;
    }) => void;
    protected onSelect: (event: plotly.PlotSelectionEvent) => Promise<void>;
    protected onUnHover: (event: plotly.PlotMouseEvent) => void;
    /**
     * Is the data ready to be plotted?
     */
    private isDataLoaded;
}
