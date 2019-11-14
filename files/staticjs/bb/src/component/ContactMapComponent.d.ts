import * as React from 'react';
import { ButtonProps, CheckboxProps } from 'semantic-ui-react';
import { IComponentMenuBarItem, IContactMapChartData, IContactMapChartPoint } from './';
import { BIOBLOCKS_CSS_STYLE, BioblocksChartEvent, BioblocksWidgetConfig, ButtonGroupWidgetConfig, CouplingContainer, IContactMapData, ICouplingScore, RESIDUE_TYPE, SECONDARY_STRUCTURE, SECONDARY_STRUCTURE_KEYS, SECONDARY_STRUCTURE_SECTION } from '../data';
import { ColorMapper } from '../helper';
import { LockedResiduePair } from '../reducer';
export declare type CONTACT_MAP_CB_RESULT_TYPE = ICouplingScore;
export declare type ContactMapCallback = (coupling: CONTACT_MAP_CB_RESULT_TYPE) => void;
export interface IContactMapComponentProps {
    configurations: BioblocksWidgetConfig[];
    /** Data for the Contact Map */
    data: IContactMapData;
    formattedPoints: IContactMapChartData[];
    /** Height of the component. */
    height: number | string;
    highlightColor: string;
    hoveredResidues: RESIDUE_TYPE[];
    hoveredSecondaryStructures: SECONDARY_STRUCTURE_SECTION[];
    isDataLoading: boolean;
    lockedResiduePairs: LockedResiduePair;
    /** Color to distinguish contacts that are considered 'observed' */
    observedColor: string;
    secondaryStructureColors?: ColorMapper<SECONDARY_STRUCTURE_KEYS>;
    selectedSecondaryStructures: SECONDARY_STRUCTURE;
    /** Controls whether button to change settings is shown. */
    showConfigurations: boolean;
    style?: BIOBLOCKS_CSS_STYLE;
    /** Width of the component. */
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
export declare const initialContactMapState: {
    pointsToPlot: IContactMapChartData[];
};
export declare type ContactMapComponentState = Readonly<typeof initialContactMapState>;
/**
 * Presentational Component for the ContactMap.
 *
 * @extends {React.Component<IContactMapComponentProps, ContactMapComponentState>}
 */
export declare class ContactMapComponent extends React.Component<IContactMapComponentProps, ContactMapComponentState> {
    static defaultProps: {
        addHoveredResidues: (...args: any[]) => void;
        addHoveredSecondaryStructure: (...args: any[]) => void;
        addSelectedSecondaryStructure: (...args: any[]) => void;
        configurations: BioblocksWidgetConfig[];
        data: {
            couplingScores: CouplingContainer;
            pdbData: {
                experimental: undefined;
                predicted: undefined;
            };
            secondaryStructures: import("../data").Bioblocks1DSection<"G" | "H" | "I" | "T" | "E" | "B" | "S" | "C">[][];
        };
        enableSliders: boolean;
        formattedPoints: IContactMapChartData[];
        height: string;
        highlightColor: string;
        hoveredResidues: never[];
        hoveredSecondaryStructures: never[];
        isDataLoading: boolean;
        lockedResiduePairs: {};
        observedColor: string;
        removeAllLockedResiduePairs: (...args: any[]) => void;
        removeAllSelectedSecondaryStructures: (...args: any[]) => void;
        removeHoveredResidues: (...args: any[]) => void;
        removeHoveredSecondaryStructure: (...args: any[]) => void;
        removeSecondaryStructure: (...args: any[]) => void;
        selectedSecondaryStructures: never[];
        showConfigurations: boolean;
        toggleLockedResiduePair: (...args: any[]) => void;
        width: string;
    };
    readonly state: ContactMapComponentState;
    constructor(props: IContactMapComponentProps);
    componentDidMount(): void;
    componentDidUpdate(prevProps: IContactMapComponentProps): void;
    onNodeSelectionChange: (index: number) => (event?: React.MouseEvent<HTMLInputElement, MouseEvent> | undefined, data?: CheckboxProps | undefined) => void;
    onNodeSizeChange: (index: number, nodeSizeMod: number) => (event?: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined, data?: ButtonProps | undefined) => void;
    render(): JSX.Element;
    /**
     * Given a chart data entry, sets node options if one is already set for this point.
     *
     * @param chartDatum A single chart data entry.
     */
    protected applySavedNodeOptions: (chartDatum: IContactMapChartData) => IContactMapChartData;
    /**
     * Returns an {i, j} pair for a hovered residue. Handles case when a single residue is hovered.
     *
     * @param hoveredResidues Array of residues that are hovered.
     */
    protected generateHoveredResiduePairs: (hoveredResidues: number[]) => {
        i: number;
        j: number;
    }[];
    /**
     * Returns contact map points for locked residue pairs.
     *
     * @param hoveredResidues Array of residues that are hovered.
     */
    protected generateLockedResiduePairs: (lockedResiduePairs: Record<string, number[]>) => IContactMapChartPoint[];
    protected generateSelectedResiduesChartData: (highlightColor: string, chartName: string, nodeSize: number, chartPoints: IContactMapChartPoint[]) => IContactMapChartData;
    /**
     * Gets the color from the provided chart entry.
     *
     * The following are checked in order - the first one found is the color returned:
     * - Marker's line color.
     * - Marker's color.
     * - Marker's colorscale.
     * - Line color.
     */
    protected getColorFromEntry: (entry: IContactMapChartData) => string | number | (string | number | null | undefined)[] | (string | number | null | undefined)[][] | null | undefined;
    protected getDockConfigs: () => {
        isVisibleCb: () => boolean;
        onClick: () => void;
        text: string;
    }[];
    protected getMenuConfigs: (Filters: BioblocksWidgetConfig[], pointsToPlot: IContactMapChartData[]) => IComponentMenuBarItem<import(".").IPopupType>[];
    protected getNodeOptionConfigs: (entries: IContactMapChartData[]) => {
        'Node Options': ButtonGroupWidgetConfig[];
    };
    protected handleAxisClick: (e: BioblocksChartEvent) => void;
    protected handleAxisEnter: (e: BioblocksChartEvent) => void;
    protected handleAxisLeave: (e: BioblocksChartEvent) => void;
    protected onMouseClick: (cb: (residues: Record<string, number[]>) => void) => (e: BioblocksChartEvent) => void;
    protected onMouseEnter: (cb: (residue: number[]) => void) => (e: BioblocksChartEvent) => void;
    protected onMouseLeave: (cb?: ((residue: number[]) => void) | undefined) => (e: BioblocksChartEvent) => void;
    protected onMouseSelect: (cb?: ((residues: number[]) => void) | undefined) => (e: BioblocksChartEvent) => void;
    protected renderContactMapChart(pointsToPlot: IContactMapChartData[]): JSX.Element;
    protected setupPointsToPlot(couplingContainer: CouplingContainer): void;
}
