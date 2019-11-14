/// <reference types="react" />
import { Set } from 'immutable';
import { BioblocksVisualization } from './';
import { SPECIES_TYPE } from '../data';
import { IBioblocksStateTransform } from '../reducer';
export interface IAnatomogramContainerProps {
    /** URI for the icon of the component. */
    iconSrc: string;
    /** Set of IDs for selected parts of the Anatomogram. */
    selectIds: Set<string>;
    /** The species to display. See @SPECIES_TYPE */
    species: SPECIES_TYPE;
    /** Callback for a label being added. */
    onLabelAdd(label: string): void;
    /** Callback for a label being removed. */
    onLabelRemove(label: string): void;
}
export interface IAnatomogramContainerState {
    /** All of the ids for this Anatomogram. */
    ids: string[];
}
export declare class AnatomogramContainerClass extends BioblocksVisualization<IAnatomogramContainerProps, IAnatomogramContainerState> {
    static defaultProps: {
        iconSrc: string;
        onLabelAdd: (...args: any[]) => void;
        onLabelRemove: (...args: any[]) => void;
        selectIds: Set<string>;
        species: SPECIES_TYPE;
    };
    static displayName: string;
    protected divRef: HTMLDivElement | null;
    constructor(props: IAnatomogramContainerProps);
    setupDataServices(): void;
    componentDidUpdate(prevProps: IAnatomogramContainerProps): void;
    render(): JSX.Element;
    protected getCellToLabelTransform(): IBioblocksStateTransform;
    protected getLabelToCellTransform(): IBioblocksStateTransform;
    protected onClick: (ids: string[]) => void;
    protected deriveIdsFromSpecies: (species: SPECIES_TYPE) => string[];
    protected onMouseOut: (id: string) => void;
    protected onMouseOver: (id: string) => void;
    protected parseCategory: (category: string) => string;
    protected resizeSVGElement: (error: any, svgDomNode: SVGSVGElement) => void;
}
export declare const AnatomogramContainer: import("react-redux").ConnectedComponent<typeof AnatomogramContainerClass, Pick<IAnatomogramContainerProps, "iconSrc" | "species">>;
