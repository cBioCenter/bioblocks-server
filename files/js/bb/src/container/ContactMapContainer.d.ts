/// <reference types="react" />
import { IContactMapChartData } from '../component';
import { BioblocksVisualization } from './';
import { BIOBLOCKS_CSS_STYLE, BioblocksWidgetConfig, CouplingContainer, IContactMapData, ICouplingScoreFilter, RESIDUE_TYPE, SECONDARY_STRUCTURE_SECTION } from '../data';
import { LockedResiduePair } from '../reducer';
export interface IContactMapContainerProps {
    /** Color to distinguish contacts that are considered in agreement. */
    agreementColor: string;
    /** Color to distinguish contacts with no special designation. */
    allColor: string;
    data: IContactMapData;
    filters: ICouplingScoreFilter[];
    height: number | string;
    /** Color to distinguish contacts that are highlighted. */
    highlightColor: string;
    /** Flag to control loading spinner. */
    isDataLoading: boolean;
    /** Color to distinguish contacts that are considered observed. */
    observedColor: string;
    style?: BIOBLOCKS_CSS_STYLE;
    width: number | string;
    addHoveredResidues(residues: RESIDUE_TYPE[]): void;
    addHoveredSecondaryStructure(section: SECONDARY_STRUCTURE_SECTION): void;
    addSelectedSecondaryStructure(section: SECONDARY_STRUCTURE_SECTION): void;
    onBoxSelection?(residues: RESIDUE_TYPE[]): void;
    removeAllLockedResiduePairs(): void;
    removeAllSelectedSecondaryStructures(): void;
    removeHoveredResidues(): void;
    removeHoveredSecondaryStructure(section: SECONDARY_STRUCTURE_SECTION): void;
    removeSecondaryStructure(section: SECONDARY_STRUCTURE_SECTION): void;
    toggleLockedResiduePair(residuePair: LockedResiduePair): void;
}
export declare const initialContactMapContainerState: {
    linearDistFilter: number;
    minimumProbability: number;
    minimumScore: number;
    numPredictionsToShow: number;
    pointsToPlot: IContactMapChartData[];
    rankFilter: number[];
};
export declare type ContactMapContainerState = typeof initialContactMapContainerState;
/**
 * Container for the ContactMap, responsible for data interaction.
 * @extends {React.Component<IContactMapContainerProps, ContactMapContainerState>}
 */
export declare class ContactMapContainerClass extends BioblocksVisualization<IContactMapContainerProps, ContactMapContainerState> {
    static defaultProps: {
        addHoveredResidues: (...args: any[]) => void;
        addHoveredSecondaryStructure: (...args: any[]) => void;
        addSelectedSecondaryStructure: (...args: any[]) => void;
        agreementColor: string;
        allColor: string;
        data: {
            couplingScores: CouplingContainer;
            secondaryStructures: import("../data").Bioblocks1DSection<"G" | "H" | "I" | "T" | "E" | "B" | "S" | "C">[][];
        };
        filters: never[];
        height: string;
        highlightColor: string;
        isDataLoading: boolean;
        observedColor: string;
        onBoxSelection: (...args: any[]) => void;
        removeAllLockedResiduePairs: (...args: any[]) => void;
        removeAllSelectedSecondaryStructures: (...args: any[]) => void;
        removeHoveredResidues: (...args: any[]) => void;
        removeHoveredSecondaryStructure: (...args: any[]) => void;
        removeSecondaryStructure: (...args: any[]) => void;
        toggleLockedResiduePair: (...args: any[]) => void;
        width: string;
    };
    readonly state: ContactMapContainerState;
    constructor(props: IContactMapContainerProps);
    setupDataServices(): void;
    componentDidMount(): void;
    componentDidUpdate(prevProps: IContactMapContainerProps, prevState: ContactMapContainerState): void;
    render(): JSX.Element;
    onLinearDistFilterChange: () => (value: number) => void;
    onMinimumProbabilityChange: () => (value: number) => void;
    onNumPredictionsToShowChange: () => (value: number) => void;
    protected haveSettingsUpdated: (prevState: {
        linearDistFilter: number;
        minimumProbability: number;
        minimumScore: number;
        numPredictionsToShow: number;
        pointsToPlot: IContactMapChartData[];
        rankFilter: number[];
    }) => boolean;
    protected getConfigs: () => BioblocksWidgetConfig[];
    protected getPredictedFilters: () => ICouplingScoreFilter<number | number[]>[];
    /**
     * Setups up the prediction values for the data.
     *
     * @param isNewData Is this an entirely new dataset?
     */
    protected setupData(isNewData: boolean): void;
}
export declare const ContactMapContainer: import("react-redux").ConnectedComponent<typeof ContactMapContainerClass, Pick<IContactMapContainerProps, "height" | "width" | "style" | "data" | "agreementColor" | "allColor" | "filters" | "highlightColor" | "isDataLoading" | "observedColor" | "onBoxSelection">>;
