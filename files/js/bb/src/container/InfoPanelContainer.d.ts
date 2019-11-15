import * as React from 'react';
import { BioblocksPDB, CouplingContainer, IContactMapData, SECONDARY_STRUCTURE, SECONDARY_STRUCTURE_SECTION } from '../data';
import { LockedResiduePair } from '../reducer';
export interface IInfoPanelProps {
    data: IContactMapData;
    height: number;
    lockedResiduePairs: LockedResiduePair;
    selectedSecondaryStructures: SECONDARY_STRUCTURE_SECTION[];
    width: number;
}
export declare class InfoPanelContainerClass extends React.Component<IInfoPanelProps, any> {
    static defaultProps: {
        data: {
            couplingScores: CouplingContainer;
            pdbData: {};
            secondaryStructures: import("../data").Bioblocks1DSection<"G" | "H" | "I" | "T" | "E" | "B" | "S" | "C">[][];
        };
        height: number;
        lockedResiduePairs: {};
        selectedSecondaryStructures: never[];
        width: number;
    };
    constructor(props: IInfoPanelProps);
    render(): JSX.Element;
    protected renderLockedResiduePairs(lockedResiduePairs: LockedResiduePair): JSX.Element[];
    protected renderSecondaryStructures(selectedSecondaryStructures: SECONDARY_STRUCTURE): JSX.Element[];
    protected renderUnassignedResidues(pdbData: BioblocksPDB): JSX.Element[];
}
export declare const InfoPanelContainer: import("react-redux").ConnectedComponent<typeof InfoPanelContainerClass, Pick<IInfoPanelProps, "height" | "width" | "data">>;
