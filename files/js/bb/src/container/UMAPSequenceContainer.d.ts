import * as React from 'react';
import { DropdownProps } from 'semantic-ui-react';
import { Set } from 'immutable';
import { IUMAPVisualizationProps } from '../component';
import { ILabel, SeqRecord } from '../data';
export interface IUMAPSequenceContainerProps extends Partial<IUMAPVisualizationProps> {
    /** if the number of data points are too large, the container will randomly subsample points */
    numSequencesToShow: number;
    numIterationsBeforeReRender: number;
    /**
     * Text from taxonomy file - only valid when umap is showing sequences:
     * 1. tab delimited with each row being a sequence
     * 2. first row is a header with column names
     * 3. must contain columns 'seq_name': values matched to fasta sequence names
     *                         'phylum': the phylum of the organism the sequence originated from
     *                         'class': the class of the organism the sequence originated from
     */
    taxonomyText?: string;
    labelCategory: string;
    allSequences: SeqRecord[];
    showUploadButton: boolean;
    currentCells: Set<number>;
    setCurrentCells(cells: number[]): void;
}
export interface IUMAPSequenceContainerState {
    labelCategory: string;
    labels: string[];
    randomSequencesDataMatrix: number[][];
    seqNameToTaxonomyMetadata: {
        [seqName: string]: {
            [taxonomyCategory: string]: string;
        };
    };
    subsampledSequences: SeqRecord[];
    tooltipNames: string[];
}
export declare class UMAPSequenceContainerClass extends React.Component<IUMAPSequenceContainerProps, IUMAPSequenceContainerState> {
    static defaultProps: {
        currentCells: Set<number>;
        labelCategory: string;
        numIterationsBeforeReRender: number;
        numSequencesToShow: number;
        setCurrentCells: (...args: any[]) => void;
        showUploadButton: boolean;
    };
    constructor(props: IUMAPSequenceContainerProps);
    componentDidMount(): void;
    componentDidUpdate(prevProps: IUMAPSequenceContainerProps, prevState: IUMAPSequenceContainerState): void;
    render(): JSX.Element;
    /**
     * A special hamming distance function that is speed optimized for sequence comparisons.
     * Assumes that sequences are passed with a single integer for each position. If
     * the position is the same in each position then the distance is zero, otherwise
     * the distance is one. The total distance is then the sum of each positional distance.
     * @returns the total distance between a pair of sequences.
     */
    equalityHammingDistance: (seq1: number[], seq2: number[]) => number;
    protected getDataLabels: () => (ILabel | undefined)[];
    protected onLabelChange: (event: React.SyntheticEvent<Element, Event>, data: DropdownProps) => void;
    protected onTaxonomyUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    protected renderTaxonomyUpload: () => JSX.Element;
    protected renderTaxonomyTrigger: () => JSX.Element;
    private prepareData;
    private parseTaxonomy;
    private setupSequenceAnnotation;
}
export declare const UMAPSequenceContainer: import("react-redux").ConnectedComponent<typeof UMAPSequenceContainerClass, Pick<IUMAPSequenceContainerProps, "dataMatrix" | "numIterationsBeforeReRender" | "currentLabel" | "dataLabels" | "distanceFn" | "errorMessages" | "iconSrc" | "labels" | "minDist" | "nComponents" | "nNeighbors" | "spread" | "tooltipNames" | "onLabelChange" | "labelCategory" | "numSequencesToShow" | "showUploadButton" | "taxonomyText" | "allSequences">>;
