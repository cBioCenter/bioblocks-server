import * as React from 'react';
import { ButtonProps, PopupProps, SemanticICONS } from 'semantic-ui-react';
import { BioblocksWidgetConfig, ButtonGroupWidgetConfig, ButtonWidgetConfig, CheckboxWidgetConfig, DropDownWidgetConfig, LabelWidgetConfig, RadioWidgetConfig, RangeSliderWidgetConfig, SliderWidgetConfig } from '../../data';
export interface IComponentMenuBarProps {
    componentName: string;
    height: number | string;
    isExpanded: boolean;
    iconSrc: string;
    menuItems: Array<IComponentMenuBarItem<IButtonType | IPopupType>>;
    opacity: number;
    width: number | string;
    onExpandToggleCb?(): void;
}
export interface IComponentMenuBarState {
    iconUrl: string;
    isHovered: boolean;
}
export interface IButtonType {
    name: 'BUTTON';
    props?: ButtonProps;
    onClick(...args: any[]): any;
}
export interface IPopupType {
    configs?: {
        [key: string]: BioblocksWidgetConfig[];
    };
    name: 'POPUP';
    props?: PopupProps;
}
export interface IComponentMenuBarItem<T = IPopupType> {
    component: T;
    description: string;
    iconName?: SemanticICONS;
}
export declare const DEFAULT_POPUP_PROPS: Partial<PopupProps>;
export declare class ComponentMenuBar extends React.Component<IComponentMenuBarProps, IComponentMenuBarState> {
    static defaultProps: {
        height: string;
        iconSrc: string;
        isExpanded: boolean;
        menuItems: never[];
        opacity: number;
        width: string;
    };
    constructor(props: IComponentMenuBarProps);
    componentDidMount(): Promise<void>;
    render(): JSX.Element;
    protected getPopupMenuItem: (item: IComponentMenuBarItem<IPopupType>, key: string, aTriggerElement?: JSX.Element | undefined) => JSX.Element;
    protected getButtonMenuItem: (item: IComponentMenuBarItem<IButtonType>) => JSX.Element;
    protected onMenuEnter: () => void;
    protected onMenuLeave: () => void;
    protected renderComponentRightMenu: () => JSX.Element;
    protected renderComponentTitle: (componentName: string, iconSrc: string, iconUrl: string) => JSX.Element;
    protected renderConfigs: (configs: {
        [key: string]: BioblocksWidgetConfig[];
    }) => {
        [x: string]: JSX.Element[];
    }[];
    protected renderConfigurationButton(config: ButtonWidgetConfig, id: string): JSX.Element;
    protected renderConfigurationButtonGroup(config: ButtonGroupWidgetConfig, id: string): JSX.Element;
    protected renderConfigurationCheckbox(config: CheckboxWidgetConfig, id: string): JSX.Element;
    protected renderConfigurationDropDown(config: DropDownWidgetConfig, id: string): JSX.Element;
    protected renderConfigurationLabel(config: LabelWidgetConfig, id: string): JSX.Element;
    protected renderConfigurationRadioButton(config: RadioWidgetConfig, id: string): JSX.Element;
    protected renderConfigurationRangeSlider(config: RangeSliderWidgetConfig, id: string): JSX.Element;
    protected renderConfigurationSlider(config: SliderWidgetConfig, id: string): JSX.Element;
    protected renderMenuIconText(text: string): JSX.Element;
    protected renderMenuItems(items: Array<IComponentMenuBarItem<IButtonType | IPopupType>>, componentName: string): JSX.Element[];
    protected renderSingleConfig(config: BioblocksWidgetConfig, id: string): string | JSX.Element;
}
