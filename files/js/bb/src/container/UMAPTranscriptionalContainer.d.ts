/// <reference types="react" />
import { Set } from 'immutable';
import { ICategoricalAnnotation, IUMAPVisualizationProps } from '../component';
import { BioblocksVisualization } from './';
import { ILabel } from '../data';
import { IBioblocksStateTransform } from '../reducer';
export declare type IUMAPTranscriptionalContainerProps = Required<Pick<IUMAPVisualizationProps, 'dataMatrix' | 'numIterationsBeforeReRender'>> & Partial<IUMAPVisualizationProps> & {
    numSamplesToShow: number;
    categoricalAnnotations?: ICategoricalAnnotation;
    labelCategory?: string;
    sampleNames?: string[];
    currentCells: Set<number>;
    currentLabels: Set<string>;
    /** Callback for a label being added. */
    onLabelAdd(label: string): void;
    /** Callback for a label being removed. */
    onLabelRemove(label: string): void;
    setCurrentCells(cells: number[]): void;
};
export interface IUMAPTranscriptionalContainerState {
    completeSampleAnnotations: Record<string, Array<ILabel | undefined>>;
    errorMessages: string[];
}
export declare class UMAPTranscriptionalContainerClass extends BioblocksVisualization<IUMAPTranscriptionalContainerProps, IUMAPTranscriptionalContainerState> {
    static defaultProps: {
        currentCells: Set<number>;
        currentLabels: Set<string>;
        numIterationsBeforeReRender: number;
        numSamplesToShow: number;
        onLabelAdd: (...args: any[]) => void;
        onLabelRemove: (...args: any[]) => void;
        setCurrentCells: (...args: any[]) => void;
    };
    private subsampledIndices;
    constructor(props: IUMAPTranscriptionalContainerProps);
    setupDataServices(): void;
    componentDidMount(): void;
    componentDidUpdate(prevProps: IUMAPTranscriptionalContainerProps, prevState: IUMAPTranscriptionalContainerState): void;
    render(): JSX.Element;
    protected getLabelToCellTransform(): IBioblocksStateTransform;
    protected getAnnotations: () => Record<string, (ILabel | undefined)[]>;
    protected getErrorMessages: (annotationsUnchanged: boolean) => string[];
    protected onLabelChange: (label: string) => void;
    protected prepareData(annotationsUnchanged?: boolean): void;
}
export declare const UMAPTranscriptionalContainer: import("react-redux").ConnectedComponent<typeof UMAPTranscriptionalContainerClass, Pick<IUMAPTranscriptionalContainerProps, "dataMatrix" | "numIterationsBeforeReRender" | "currentLabel" | "dataLabels" | "distanceFn" | "errorMessages" | "iconSrc" | "labels" | "minDist" | "nComponents" | "nNeighbors" | "spread" | "tooltipNames" | "onLabelChange" | "labelCategory" | "numSamplesToShow" | "categoricalAnnotations" | "sampleNames">>;
