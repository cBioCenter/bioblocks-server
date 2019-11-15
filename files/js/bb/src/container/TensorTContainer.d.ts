/// <reference types="react" />
import { TSNE } from '@tensorflow/tfjs-tsne/dist/tsne';
import { Set } from 'immutable';
import { BioblocksVisualization } from './';
import { BIOBLOCKS_CSS_STYLE, BioblocksChartEvent, BioblocksWidgetConfig, IPlotlyData } from '../data';
export interface ITensorContainerProps {
    currentCells: Set<number>;
    datasetLocation: string;
    height: number | string | undefined;
    iconSrc?: string;
    isFullPage: boolean;
    pointColor: string;
    style: BIOBLOCKS_CSS_STYLE;
    setCurrentCells(cells: number[]): void;
}
export interface ITensorContainerState {
    coordsArray: number[][];
    isAnimating: boolean;
    isComputing: boolean;
    numIterations: number;
    tsne?: TSNE;
    plotlyCoords: Array<Partial<IPlotlyData>>;
}
export declare class TensorTContainerClass extends BioblocksVisualization<ITensorContainerProps, ITensorContainerState> {
    static defaultProps: {
        currentCells: Set<number>;
        datasetLocation: string;
        height: string;
        isFullPage: boolean;
        pointColor: string;
        setCurrentCells: (...args: any[]) => void;
        style: {
            padding: number;
        };
        width: number;
    };
    static displayName: string;
    protected canvasContext: CanvasRenderingContext2D | null;
    constructor(props: ITensorContainerProps);
    setupDataServices(): void;
    componentDidMount(): Promise<void>;
    componentDidUpdate(prevProps: ITensorContainerProps): Promise<void>;
    render(): JSX.Element;
    protected computeTensorTsne(numIterations: number): Promise<void>;
    protected getPlotlyCoordsFromTsne: (coords: number[][]) => Partial<IPlotlyData>[];
    protected getPlotlyCoordsFromSpring: (coords: number[][], currentCells: number[]) => Partial<IPlotlyData>[];
    protected getTensorConfigs: () => BioblocksWidgetConfig[];
    protected handlePointSelection: (event: BioblocksChartEvent) => void;
    protected renderIterateLabel: () => JSX.Element;
    /**
     * Renders the radio button responsible for toggling the animation on/off.
     */
    protected renderIterateButton: () => JSX.Element;
    protected renderResetButton: () => JSX.Element;
    protected onIterateForward: (amount?: number) => () => Promise<void>;
    protected onIterationToggle: () => () => void;
    protected onReset: () => () => Promise<void>;
    protected renderPlaybackControls: () => JSX.Element;
    protected setupTensorData(): Promise<void>;
}
export declare const TensorTContainer: import("react-redux").ConnectedComponent<typeof TensorTContainerClass, Pick<ITensorContainerProps, "height" | "style" | "iconSrc" | "datasetLocation" | "isFullPage" | "pointColor">>;
