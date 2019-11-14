/// <reference types="react" />
import { Set } from 'immutable';
import { BioblocksVisualization } from './';
import { IFrameEvent, ISpringGraphData, ISpringLink, ISpringNode, VIZ_TYPE } from '../data';
export interface ISpringContainerProps {
    categories: Set<string>;
    currentCells: Set<number>;
    datasetLocation: string;
    datasetsURI: string;
    headerHeight: number;
    iconSrc?: string;
    isFullPage: boolean;
    padding: number | string;
    selectedCategory: string;
    springGraphData: ISpringGraphData;
    springHeight: number;
    springSrc: string;
    springWidth: number;
    dispatchSpringFetch(fetchFn: () => Promise<ISpringGraphData>): void;
    setCurrentCategory(category: string): void;
    setCurrentCells(cells: number[]): void;
}
export interface ISpringContainerState {
    postMessageData: object;
    springUrl: string;
}
export interface ISpringMessage {
    type: string;
    payload: {
        currentCategory?: string;
        indices: number[];
        selectedLabel: string;
    };
}
export declare class SpringContainerClass extends BioblocksVisualization<ISpringContainerProps, ISpringContainerState> {
    static defaultProps: {
        categories: Set<string>;
        currentCells: Set<number>;
        datasetLocation: string;
        datasetsURI: string;
        dispatchSpringFetch: (...args: any[]) => void;
        headerHeight: number;
        isFullPage: boolean;
        padding: number;
        selectedCategory: string;
        setCurrentCategory: (...args: any[]) => void;
        setCurrentCells: (...args: any[]) => void;
        springGraphData: {
            links: ISpringLink[];
            nodes: ISpringNode[];
        };
        springHeight: number;
        springSrc: string;
        springWidth: number;
    };
    static displayName: string;
    constructor(props: ISpringContainerProps);
    setupDataServices(): void;
    componentDidMount(): void;
    componentDidUpdate(prevProps: ISpringContainerProps, prevState: ISpringContainerState): void;
    render(): JSX.Element;
    protected onReady: () => void;
    protected onReceiveMessage: (msg: IFrameEvent<VIZ_TYPE.SPRING>) => void;
    protected generateSpringURL: (dataset: string) => string;
}
export declare const SpringContainer: import("react-redux").ConnectedComponent<typeof SpringContainerClass, Pick<ISpringContainerProps, "padding" | "iconSrc" | "datasetLocation" | "datasetsURI" | "headerHeight" | "isFullPage" | "selectedCategory" | "springHeight" | "springSrc" | "springWidth">>;
