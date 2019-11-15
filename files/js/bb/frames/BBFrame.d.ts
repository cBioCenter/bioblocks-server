import * as React from 'react';
import { BIOBLOCKS_CSS_STYLE, IFrameEvent, IUMapEventData, VIZ_EVENT_DATA_TYPE, VIZ_PROPS_DATA_TYPE, VIZ_TYPE } from '../src/data';
export interface IBBFrameProps {
    style: BIOBLOCKS_CSS_STYLE;
    viz: VIZ_TYPE | undefined;
}
export interface IBBFrameState {
    currentViz: VIZ_TYPE | undefined;
    vizData: VIZ_EVENT_DATA_TYPE;
    vizProps: VIZ_PROPS_DATA_TYPE;
}
export declare class BBFrame extends React.Component<IBBFrameProps, IBBFrameState> {
    static defaultProps: {
        style: {};
        viz: undefined;
    };
    constructor(props: IBBFrameProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element | null;
    protected onMessage: (msg: IFrameEvent<VIZ_TYPE>) => void;
    protected renderViz: (viz: VIZ_TYPE | undefined, vizData: Record<string, any>, vizProps: Record<string, any>) => JSX.Element;
    protected renderUmapSeq(vizData: IUMapEventData, vizProps: VIZ_PROPS_DATA_TYPE): JSX.Element;
}
