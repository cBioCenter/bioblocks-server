import * as React from 'react';
import { AccordionTitleProps } from 'semantic-ui-react';
import { BIOBLOCKS_CSS_STYLE } from '../../data';
export interface IConfigGroup {
    [key: string]: JSX.Element[];
}
export interface IConfigAccordionProps {
    allowMultipleOpen: boolean;
    configs: IConfigGroup[];
    gridStyle: BIOBLOCKS_CSS_STYLE;
    title: string;
}
export declare type CONFIG_ACCORDION_INDEX = string | number;
export interface IConfigAccordionState {
    activeIndices: CONFIG_ACCORDION_INDEX[];
}
export declare class ConfigAccordion extends React.Component<IConfigAccordionProps, IConfigAccordionState> {
    static defaultProps: {
        allowMultipleOpen: boolean;
        gridStyle: {};
    };
    constructor(props: IConfigAccordionProps);
    render(): JSX.Element;
    protected renderConfigs: (configs: IConfigGroup[], activeIndices: (string | number)[]) => JSX.Element[][];
    protected onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, data: AccordionTitleProps) => void;
    protected renderSingleConfig: (config: [string, IConfigGroup]) => JSX.Element;
}
