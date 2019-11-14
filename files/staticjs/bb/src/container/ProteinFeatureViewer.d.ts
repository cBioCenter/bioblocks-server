import * as React from 'react';
import { CheckboxProps, FormProps, InputOnChangeData } from 'semantic-ui-react';
import { IDbReference, IPlotlyData, IProtein, TintedBioblocks1DSection } from '../data';
export interface IProteinFeatureViewerProps {
    initialProteinId: string;
}
export interface IProteinFeatureViewerState {
    data: Array<Partial<IPlotlyData>>;
    domainData: Array<TintedBioblocks1DSection<string>>;
    protein?: IProtein;
    proteinId: string;
    showGrouped: boolean;
}
export declare const SAMPLE_PROTEIN_IDS: {
    '3Domains': string;
    '5Domains': string;
    DLL3_HUMAN: string;
    SMAD4_HUMAN: string;
};
export declare class ProteinFeatureViewer extends React.Component<IProteinFeatureViewerProps, IProteinFeatureViewerState> {
    static defaultProps: {
        initialProteinId: string;
    };
    constructor(props: IProteinFeatureViewerProps);
    componentDidMount(): Promise<void>;
    render(): JSX.Element;
    protected getPFamFamilyLink: (pFamRef: Partial<IDbReference>) => string;
    protected getPFamDomainLink: (pFamRef: Partial<IDbReference>) => string;
    protected getPFamLinks: (pFamIds: Partial<IDbReference>[]) => string;
    protected initializeProteinData: (protein: IProtein) => void;
    protected onProteinInputChange: (event: React.SyntheticEvent<HTMLInputElement, Event>, data: InputOnChangeData) => void;
    protected deriveProteinData(): Promise<void>;
    protected onProteinInputSubmit: (event: React.FormEvent<HTMLFormElement>, data: FormProps) => Promise<void>;
    protected onShowGroupedChange: (event: React.FormEvent<HTMLInputElement>, data: CheckboxProps) => void;
    protected renderAnnotationText: (proteinId: string, index: number) => string;
    protected renderProteinForm: (proteinId: string) => JSX.Element;
}
