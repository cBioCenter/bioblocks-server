import { Map } from 'immutable';
import * as NGL from 'ngl';
import * as React from 'react';
import { IComponentMenuBarItem } from './';
import { BIOBLOCKS_CSS_STYLE, BioblocksPDB, BioblocksWidgetConfig, CONTACT_DISTANCE_PROXIMITY, RESIDUE_TYPE, SECONDARY_STRUCTURE, SECONDARY_STRUCTURE_SECTION } from '../data';
import { LockedResiduePair } from '../reducer';
export declare type NGL_HOVER_CB_RESULT_TYPE = number;
export declare type RepresentationDict = Map<string, NGL.RepresentationElement[]>;
export declare type SUPERPOSITION_STATUS_TYPE = 'NONE' | 'PREDICTED' | 'EXPERIMENTAL' | 'BOTH';
export interface INGLComponentProps {
    backgroundColor: string | number;
    candidateResidues: RESIDUE_TYPE[];
    experimentalProteins: BioblocksPDB[];
    height: number | string;
    hoveredResidues: RESIDUE_TYPE[];
    hoveredSecondaryStructures: SECONDARY_STRUCTURE_SECTION[];
    isDataLoading: boolean;
    lockedResiduePairs: LockedResiduePair;
    measuredProximity: CONTACT_DISTANCE_PROXIMITY;
    menuItems: IComponentMenuBarItem[];
    predictedProteins: BioblocksPDB[];
    selectedSecondaryStructures: SECONDARY_STRUCTURE_SECTION[];
    style?: BIOBLOCKS_CSS_STYLE;
    width: number | string;
    addCandidateResidues(residues: RESIDUE_TYPE[]): void;
    addHoveredResidues(residues: RESIDUE_TYPE[]): void;
    addLockedResiduePair(residuePair: LockedResiduePair): void;
    onMeasuredProximityChange?(value: number): void;
    onResize?(event?: UIEvent): void;
    removeAllLockedResiduePairs(): void;
    removeAllSelectedSecondaryStructures(): void;
    removeHoveredResidues(): void;
    removeNonLockedResidues(): void;
    removeLockedResiduePair(key: string): void;
    removeCandidateResidues(): void;
}
export declare const initialNGLState: {
    activeRepresentations: {
        experimental: {
            reps: NGL.RepresentationElement[];
            structType: NGL.StructureRepresentationType;
        };
        predicted: {
            reps: NGL.RepresentationElement[];
            structType: NGL.StructureRepresentationType;
        };
    };
    isDistRepEnabled: boolean;
    isMovePickEnabled: boolean;
    stage: NGL.Stage | undefined;
    superpositionStatus: SUPERPOSITION_STATUS_TYPE;
};
export declare type NGLComponentState = Readonly<typeof initialNGLState>;
export declare class NGLComponent extends React.Component<INGLComponentProps, NGLComponentState> {
    static defaultProps: {
        addCandidateResidues: (...args: any[]) => void;
        addHoveredResidues: (...args: any[]) => void;
        addLockedResiduePair: (...args: any[]) => void;
        backgroundColor: string;
        candidateResidues: never[];
        experimentalProteins: never[];
        height: string;
        hoveredResidues: never[];
        hoveredSecondaryStructures: never[];
        isDataLoading: boolean;
        lockedResiduePairs: {};
        measuredProximity: CONTACT_DISTANCE_PROXIMITY;
        menuItems: never[];
        onMeasuredProximityChange: (...args: any[]) => void;
        onResize: (...args: any[]) => void;
        predictedProteins: never[];
        removeAllLockedResiduePairs: (...args: any[]) => void;
        removeAllSelectedSecondaryStructures: (...args: any[]) => void;
        removeCandidateResidues: (...args: any[]) => void;
        removeHoveredResidues: (...args: any[]) => void;
        removeLockedResiduePair: (...args: any[]) => void;
        removeNonLockedResidues: (...args: any[]) => void;
        selectedSecondaryStructures: never[];
        width: string;
    };
    readonly state: NGLComponentState;
    prevCanvas: HTMLElement | null;
    canvas: HTMLElement | null;
    constructor(props: INGLComponentProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentDidUpdate(prevProps: INGLComponentProps, prevState: NGLComponentState): void;
    /**
     * Renders the NGL canvas.
     *
     * Because we are working with WebGL via the canvas, updating this visualization happens through the canvas reference.
     *
     * @returns The NGL Component
     */
    render(): JSX.Element;
    protected addNewHoveredResidue: (pickingProxy: NGL.PickingProxy, stage: NGL.Stage) => void;
    /**
     * Adds a NGL structure to the stage.
     *
     * @param structure A NGL Structure.
     * @param stage A NGL Stage.
     */
    protected addStructureToStage(structure: NGL.Structure, stage: NGL.Stage): void;
    /**
     * Callback for when the canvas element is mounted.
     * This is needed to ensure the NGL camera preserves orientation if the DOM node is re-mounted, like for full-page mode.
     *
     * @param el The canvas element.
     */
    protected canvasRefCallback: (el: HTMLDivElement) => void;
    protected centerCamera: () => void;
    protected deriveActiveRepresentations(structureComponent: NGL.StructureComponent): NGL.RepresentationElement[];
    protected generateStage: (canvas: HTMLElement, params?: Partial<NGL.IStageParameters> | undefined) => NGL.Stage;
    protected getDistanceRepForResidues(structureComponent: NGL.StructureComponent, residues: RESIDUE_TYPE[]): NGL.RepresentationElement | undefined;
    protected getDockItems: () => ({
        onClick: () => void;
        text: string;
        isVisibleCb?: undefined;
    } | {
        isVisibleCb: () => boolean;
        onClick: (event?: React.MouseEvent<Element, MouseEvent> | undefined) => void;
        text: string;
    })[];
    protected getRepresentationConfigs: () => {
        'Structure Representations': BioblocksWidgetConfig[];
    };
    protected getSettingsConfigurations: () => {
        'View Options': BioblocksWidgetConfig[];
    };
    protected handleAtomClick: (pickingProxy: NGL.PickingProxy) => void;
    protected handleBothSuperposition: (stage: NGL.Stage) => void;
    protected handleClickHover: (structureComponent: NGL.Component) => void;
    protected handleClickPick: (pickingProxy: NGL.PickingProxy) => void;
    protected handleHoveredDistances: (residueIndex: number, structureComponent: NGL.Component) => void;
    protected handleRepresentationUpdate(stage: NGL.Stage): {
        experimental: {
            reps: NGL.RepresentationElement[];
            structType: NGL.StructureRepresentationType;
        };
        predicted: {
            reps: NGL.RepresentationElement[];
            structType: NGL.StructureRepresentationType;
        };
    };
    protected handleStructureClick: (structureComponent: NGL.StructureComponent, pickingProxy: NGL.PickingProxy) => void;
    protected handleSuperposition(stage: NGL.Stage, superpositionStatus: SUPERPOSITION_STATUS_TYPE): void;
    protected highlightCandidateResidues(structureComponent: NGL.StructureComponent, residues: RESIDUE_TYPE[]): NGL.RepresentationElement[];
    protected highlightLockedDistancePairs(structureComponent: NGL.StructureComponent, lockedResidues: LockedResiduePair): NGL.RepresentationElement[];
    protected highlightSecondaryStructures(structureComponent: NGL.StructureComponent, secondaryStructures: SECONDARY_STRUCTURE): NGL.RepresentationElement[];
    protected initData(stage: NGL.Stage, structure: NGL.Structure | null): void;
    protected isExperimentalStructure: (structureComponent: NGL.Component) => boolean;
    protected measuredProximityHandler: (value: number) => void;
    protected onCanvasLeave: () => void;
    protected onClick: (pickingProxy: NGL.PickingProxy) => void;
    protected onHover(aStage: NGL.Stage, pickingProxy: NGL.PickingProxy): void;
    protected onKeyDown: (event: React.KeyboardEvent<Element>) => void;
    protected onResizeHandler: (event?: UIEvent | undefined) => void;
    protected onSuperpositionToggle: (event?: React.MouseEvent<Element, MouseEvent> | undefined) => void;
    protected switchCameraType: () => void;
    protected toggleDistRep: (event?: React.MouseEvent<Element, MouseEvent> | undefined) => void;
    protected toggleMovePick: (event?: React.MouseEvent<Element, MouseEvent> | undefined) => void;
    protected updateRepresentation: (stage: NGL.Stage, rep: NGL.StructureRepresentationType, pdbs: BioblocksPDB[]) => {
        reps: NGL.RepresentationElement[];
        structType: NGL.StructureRepresentationType;
    };
}
