import * as React from 'react';
import { IButtonType, IComponentMenuBarItem, IDockItem, IPopupType } from './';
export interface IComponentCardProps {
    componentName: string;
    dockItems: IDockItem[];
    expandedStyle: React.CSSProperties;
    frameHeight: number;
    frameWidth: number;
    headerHeight: number;
    height: number | string;
    iconSrc: string;
    isDataReady: boolean;
    isFramedComponent: boolean;
    isFullPage: boolean;
    menuItems: Array<IComponentMenuBarItem<IButtonType | IPopupType>>;
    padding: number | string;
    showSettings: boolean;
    width: number | string;
}
export interface IComponentCardState {
    framedStyle: React.CSSProperties;
    isFullPage: boolean;
}
export declare class ComponentCard extends React.Component<IComponentCardProps, IComponentCardState> {
    static defaultProps: {
        dockItems: never[];
        expandedStyle: {
            height: string;
            width: string;
        };
        frameHeight: number;
        frameWidth: number;
        headerHeight: number;
        height: string;
        iconSrc: string;
        isDataReady: boolean;
        isFramedComponent: boolean;
        isFullPage: boolean;
        menuItems: never[];
        padding: number;
        showSettings: boolean;
        width: string;
    };
    protected cardRef: React.Component<any> | null;
    constructor(props: IComponentCardProps);
    componentDidMount(): Promise<void>;
    componentWillUnmount(): void;
    componentDidUpdate(prevProps: IComponentCardProps, prevState: IComponentCardState): Promise<void>;
    render(): JSX.Element;
    protected renderCard: (card: JSX.Element, isFullPage: boolean, expandedStyle: React.CSSProperties) => JSX.Element;
    protected renderCardChildren: () => JSX.Element;
    protected renderDock: () => false | JSX.Element;
    protected renderTopMenu: (height: string | number) => JSX.Element;
    protected onBorderClick: (event: MouseEvent) => Promise<void>;
    protected onFullPageToggle: () => Promise<void>;
    protected resizeFramedComponent(): Promise<void>;
}
