import * as React from 'react';
import { BioblocksChartEvent, IPlotlyData } from '../data';
export interface ITensorComponentProps {
    pointsToPlot: Array<Partial<IPlotlyData>>;
    onSelectedCallback?(event: BioblocksChartEvent): void;
}
declare class TensorTComponentClass extends React.Component<ITensorComponentProps> {
    static defaultProps: {
        pointsToPlot: never[];
        style: {
            padding: number;
        };
    };
    constructor(props: ITensorComponentProps);
    render(): JSX.Element;
}
declare type requiredProps = Omit<ITensorComponentProps, keyof typeof TensorTComponentClass.defaultProps> & Partial<ITensorComponentProps>;
export declare const TensorTComponent: (props: requiredProps) => JSX.Element;
export {};
