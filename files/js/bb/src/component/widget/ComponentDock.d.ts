import * as React from 'react';
export interface IDockItem {
    text: string;
    isLink?: boolean;
    /**
     * If present, calls function to determine if it is rendered.
     * If omitted, DockItem will be rendered.
     */
    isVisibleCb?(): boolean;
    onClick?(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void;
}
export interface IComponentDockProps {
    dockItems: IDockItem[];
    /**
     * Whether the entire dock is rendered. Useful in scenarios where a component is empty like when waiting for user data.
     */
    visible: boolean;
}
export declare class ComponentDock extends React.Component<IComponentDockProps> {
    static defaultProps: {
        visible: boolean;
    };
    constructor(props: IComponentDockProps);
    render(): false | JSX.Element;
    protected renderSingleDockItem: (dockItem: IDockItem, index: number) => JSX.Element | null;
}
