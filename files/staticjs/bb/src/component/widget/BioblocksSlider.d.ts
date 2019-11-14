import { SliderProps } from 'rc-slider';
import * as React from 'react';
import 'rc-slider/assets/index.css';
/** Function signature that is invoked on slider events. */
export declare type BioblocksSliderCallback = 
/**
 * @param value New value the slider is currently on top of.
 */
(value: number) => void;
/**
 * Properties that BioblocksSlider accepts.
 *
 * @export
 */
export declare type BioblocksSliderProps = {
    defaultValue?: number;
    /** Value the slider is set to. */
    value: number;
    /** Should we show the label/value for the slider? */
    hideLabelValue?: boolean;
    /** Initial value the slider is set to. */
    label: string;
    /** Maximum value for slider. */
    max: number;
    /** Minimum value for slider. */
    min: number;
    /** Invoked when the value has finished changing the slider value - usually by releasing the mouse. */
    onAfterChange?: BioblocksSliderCallback;
    /** Invoked when the value is in the middle of changing but user has not committed to the change. */
    onChange?: BioblocksSliderCallback;
    /** Style for the slider. */
    style?: React.CSSProperties;
} & Partial<Omit<SliderProps, 'style'>>;
/**
 * State of the Bioblocks Slider.
 *
 * @export
 */
export interface IBioblocksSliderState {
    /** Initial value the slider should be reset to. */
    defaultValue: number;
    /** Value the slider is currently set to. */
    value: number;
}
/**
 * Represents a simple 2d slider, allowing a value to be selected between a minimum and maximum.
 *
 * @export
 * @extends {React.Component<BioblocksSliderProps, IBioblocksSliderState>}
 */
export declare class BioblocksSlider extends React.Component<BioblocksSliderProps, IBioblocksSliderState> {
    constructor(props: BioblocksSliderProps);
    componentDidUpdate(prevProps: BioblocksSliderProps): void;
    render(): JSX.Element;
    /**
     * Updates the state of the slider after user commits to change. If applicable, invokes appropriate callback.
     */
    protected onAfterChange: (cb?: BioblocksSliderCallback | undefined) => (value: number) => void;
    /**
     * Updates the state of the slider as the user moves the slider around but before selection is committed.
     * If applicable, invokes appropriate callback as well.
     */
    protected onChange: (cb?: BioblocksSliderCallback | undefined) => (value: number) => void;
    protected onReset: () => void;
}
