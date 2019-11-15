import * as React from 'react';
import { Set } from 'immutable';
import { Bioblocks1DSection, BioblocksChartEvent, IPlotlyData, TintedBioblocks1DSection } from '../data';
export interface IFeatureRangeSelection {
    end: number;
    length: number;
    start: number;
    featuresSelected: Array<Bioblocks1DSection<string>>;
}
export interface IFeatureViewerProps {
    backgroundBar?: TintedBioblocks1DSection<string>;
    data: Array<TintedBioblocks1DSection<string>>;
    height: number;
    maxLength?: number;
    showGrouped: boolean;
    title: string;
    width: number;
    getTextForHover?(label: string, index: number): string;
    onClickCallback?(section: Array<Bioblocks1DSection<string>>): void;
    onSelectCallback?(selection: IFeatureRangeSelection): void;
}
export interface IFeatureViewerState {
    hoveredFeatureIndex: number;
    hoverAnnotationText: string;
    plotlyLayout: Partial<Plotly.Layout>;
    plotlyConfig: Partial<Plotly.Config>;
    plotlyData: Array<Partial<IPlotlyData>>;
    selectedFeatureIndices: Set<number>;
    selectedRange: Bioblocks1DSection<string>;
}
export declare class FeatureViewer extends React.Component<IFeatureViewerProps, IFeatureViewerState> {
    static defaultProps: {
        data: never[];
        height: number;
        showGrouped: boolean;
        title: string;
        width: number;
    };
    static getDerivedStateFromProps(nextProps: IFeatureViewerProps, nextState: IFeatureViewerState): Partial<IFeatureViewerState>;
    protected static getBoxForBioblocksSection(datum: TintedBioblocks1DSection<any>): (number | null)[];
    protected static getAnnotationPlotlyData: (hoveredFeatureIndex: number, text: string, hoveredDatum: Partial<IPlotlyData>) => Partial<import("plotly.js").Annotations>[];
    protected static getPlotlyBackgroundBarObject: (datum: TintedBioblocks1DSection<string>, showGrouped: boolean, yIndex: number) => Partial<IPlotlyData>;
    protected static getPlotlyDataObject: (datum: TintedBioblocks1DSection<string>, showGrouped: boolean, yIndex: number) => Partial<IPlotlyData>;
    constructor(props: IFeatureViewerProps);
    render(): JSX.Element;
    protected onFeatureHover: (event: BioblocksChartEvent) => void;
    protected onFeatureClick: (event: BioblocksChartEvent) => void;
    protected onFeatureSelect: (event: BioblocksChartEvent) => void;
    /**
     * Derive the indices of the Features from the points the user selected.
     */
    protected deriveFeatureIndices: (data: TintedBioblocks1DSection<string>[], userSelectedPoints: number[]) => Set<number>;
    /**
     * Shorthand to get the raw section data for a set of Features given some indices.
     */
    protected deriveSelectedFeatures: (data: TintedBioblocks1DSection<string>[], selectedFeatureIndices: number[]) => Bioblocks1DSection<string>[];
}
