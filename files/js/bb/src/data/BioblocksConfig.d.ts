/// <reference types="react" />
import { Marks } from 'rc-slider';
import { ButtonProps, DropdownProps, SemanticICONS } from 'semantic-ui-react';
export declare enum CONFIGURATION_COMPONENT_TYPE {
    BUTTON = "BUTTON",
    BUTTON_GROUP = "BUTTON_GROUP",
    DROP_DOWN = "DROP_DOWN",
    LABEL = "LABEL",
    CHECKBOX = "CHECKBOX",
    RADIO = "RADIO",
    RANGE_SLIDER = "RANGE_SLIDER",
    SLIDER = "SLIDER"
}
export interface IBaseBioblocksWidgetConfig {
    icon?: SemanticICONS;
    id?: string;
    name: string;
    style?: React.CSSProperties;
    onChange?(...args: any): any;
}
export interface IBioblocksWidgetRangeConfig {
    range: {
        current: number[];
        defaultRange: number[];
        max: number;
        min: number;
    };
    onChange?(...args: any): any;
    onAfterChange?(...args: any): any;
}
export interface IBioblocksWidgetValueConfig {
    values: {
        current: number;
        defaultValue: number;
        max: number;
        min: number;
    };
    step?: number | null;
    onChange?(...args: any): any;
    onAfterChange?(...args: any): any;
}
export declare type ButtonWidgetConfig = IBaseBioblocksWidgetConfig & ({
    type: CONFIGURATION_COMPONENT_TYPE.BUTTON;
    onClick(event: React.MouseEvent<HTMLButtonElement>, data: ButtonProps): void;
});
export declare type ButtonGroupWidgetConfig = IBaseBioblocksWidgetConfig & ({
    options: JSX.Element[];
    type: CONFIGURATION_COMPONENT_TYPE.BUTTON_GROUP;
});
export declare type CheckboxWidgetConfig = IBaseBioblocksWidgetConfig & ({
    checked: boolean;
    type: CONFIGURATION_COMPONENT_TYPE.CHECKBOX;
});
export declare type DropDownWidgetConfig = IBaseBioblocksWidgetConfig & ({
    current: string;
    defaultOption?: string;
    options: Array<{
        text: string;
        value: string;
    }>;
    type: CONFIGURATION_COMPONENT_TYPE.DROP_DOWN;
    onChange(event: React.SyntheticEvent<HTMLElement>, data: DropdownProps): void;
});
export declare type LabelWidgetConfig = IBaseBioblocksWidgetConfig & ({
    type: CONFIGURATION_COMPONENT_TYPE.LABEL;
});
export declare type RadioWidgetConfig = IBaseBioblocksWidgetConfig & ({
    current: string;
    defaultOption?: string;
    options: string[];
    type: CONFIGURATION_COMPONENT_TYPE.RADIO;
});
export declare type RangeSliderWidgetConfig = IBaseBioblocksWidgetConfig & IBioblocksWidgetRangeConfig & ({
    type: CONFIGURATION_COMPONENT_TYPE.RANGE_SLIDER;
});
export declare type SliderWidgetConfig = IBaseBioblocksWidgetConfig & IBioblocksWidgetValueConfig & ({
    marks?: Marks;
    type: CONFIGURATION_COMPONENT_TYPE.SLIDER;
});
export declare type BioblocksWidgetConfig = ButtonGroupWidgetConfig | ButtonWidgetConfig | CheckboxWidgetConfig | DropDownWidgetConfig | LabelWidgetConfig | RadioWidgetConfig | RangeSliderWidgetConfig | SliderWidgetConfig;
export declare type BIOBLOCKS_CSS_STYLE = Omit<React.CSSProperties, 'height' | 'width'>;
