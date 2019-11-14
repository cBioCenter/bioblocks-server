import { Set } from 'immutable';
import * as React from 'react';
import { euclidean } from 'umap-js/dist/umap';
import { DropdownProps } from 'semantic-ui-react';
import { IButtonType, IComponentMenuBarItem, IPopupType } from './';
import { BioblocksChartEvent, BioblocksWidgetConfig, ILabel, IPlotlyData } from '../data';
export interface ICategoricalAnnotation {
    [labelCategoryName: string]: {
        label_colors: {
            [labelName: string]: string;
        };
        label_list: string[];
    };
}
export declare type DISTANCE_FN_TYPE = (arg1: number[], arg2: number[]) => number;
export interface IUMAPVisualizationProps {
    currentCells: Set<number>;
    currentLabel: string;
    dataLabels?: Array<ILabel | undefined>;
    dataMatrix: number[][];
    distanceFn?: DISTANCE_FN_TYPE;
    errorMessages: string[];
    iconSrc?: string;
    labels: string[];
    minDist: number;
    nComponents: 2 | 3;
    nNeighbors: number;
    numIterationsBeforeReRender: number;
    spread: number;
    tooltipNames?: string[];
    onLabelChange(...args: any[]): void;
    setCurrentCells(cells: number[]): void;
}
export declare type IUMAPVisualizationState = typeof UMAPVisualization.initialState & {
    dragMode: 'orbit' | 'pan' | 'turntable' | 'zoom';
};
export declare class UMAPVisualization extends React.Component<IUMAPVisualizationProps, IUMAPVisualizationState> {
    static defaultProps: {
        currentCells: Set<number>;
        currentLabel: string;
        distanceFn: typeof euclidean;
        errorMessages: never[];
        labels: never[];
        minDist: number;
        nComponents: 2 | 3;
        nNeighbors: number;
        numIterationsBeforeReRender: number;
        onLabelChange: (...args: any[]) => void;
        setCurrentCells: (...args: any[]) => void;
        spread: number;
    };
    static initialState: {
        currentEpoch: number | undefined;
        dataVisibility: Record<number, boolean>;
        dragMode: "zoom" | "pan" | "orbit" | "turntable";
        numDimensions: 2 | 3;
        numMinDist: number;
        numNeighbors: number;
        numSpread: number;
        plotlyData: IPlotlyData[];
        ranges: {
            maxX: number;
            maxY: number;
            maxZ: number;
            minX: number;
            minY: number;
            minZ: number;
        };
        totalNumberEpochs: number | undefined;
        umapEmbedding: number[][];
    };
    private timeout1;
    private timeout2;
    constructor(props: IUMAPVisualizationProps);
    componentDidMount(): void;
    componentDidUpdate(prevProps: IUMAPVisualizationProps, prevState: IUMAPVisualizationState): void;
    render(): JSX.Element;
    protected getLegendStats: () => {
        legendWidth: number;
        showLegend: boolean;
    };
    protected render2D: (showLegend: boolean, plotlyData: IPlotlyData[]) => JSX.Element;
    protected render3D: (showLegend: boolean, plotlyData: IPlotlyData[]) => JSX.Element;
    protected getData: (umapEmbedding: number[][], dataLabels?: (ILabel | undefined)[], tooltipNames?: string[]) => IPlotlyData[];
    protected getData2D: (umapEmbedding: number[][], dataLabels?: (ILabel | undefined)[], tooltipNames?: string[]) => Record<string, Partial<IPlotlyData>>;
    protected getData3D: (umapEmbedding: number[][], dataLabels?: (ILabel | undefined)[], tooltipNames?: string[]) => Record<string, Partial<IPlotlyData>>;
    protected get3DMenuItems: () => IComponentMenuBarItem<IButtonType>[];
    protected onOrbitClick: () => void;
    protected onPanClick: () => void;
    protected onTurntableClick: () => void;
    protected onZoomClick: () => void;
    protected getMenuItems: () => IComponentMenuBarItem<IButtonType | IPopupType>[];
    protected getSettingsConfigs: () => {
        Settings: BioblocksWidgetConfig[];
    };
    protected handlePointSelection: (event: BioblocksChartEvent) => void;
    protected renderCategoryDropdown: () => false | JSX.Element;
    protected onDimensionChange: (value: number) => void;
    protected onLabelChange: (event: React.SyntheticEvent<Element, Event>, data: DropdownProps) => void;
    protected onMinDistChange: (value: number) => void;
    protected onNumNeighborsChange: (value: number) => void;
    protected onSpreadChange: (value: number) => void;
    private executeUMAP;
    private onLegendClick;
}
