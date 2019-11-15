import { RangeProps } from 'rc-slider';
import * as React from 'react';
import 'rc-slider/assets/index.css';
/** Function signature that is invoked on slider events. */
export declare type BioblocksRangeSliderCallback = 
/**
 * @param range New value the slider is currently on top of.
 */
(range: number[]) => void;
/**
 * Properties that BioblocksSlider accepts.
 *
 * @export
 */
export declare type BioblocksRangeSliderProps = {
    defaultValue?: number[];
    /** Range the slider is set to. */
    value: number[];
    /** Should we show the label/value for the slider? */
    hideLabelValue?: boolean;
    /** Initial value the slider is set to. */
    label: string;
    /** Maximum range for slider. */
    max: number;
    /** Minimum range for slider. */
    min: number;
    /** Invoked when the value has finished changing the slider value - usually by releasing the mouse. */
    onAfterChange?: BioblocksRangeSliderCallback;
    /** Invoked when the value is in the middle of changing but user has not committed to the change. */
    onChange?: BioblocksRangeSliderCallback;
    /** Style for the slider. */
    style?: React.CSSProperties;
} & Partial<Omit<RangeProps, 'style'>>;
/**
 * State of the Bioblocks Slider.
 *
 * @export
 */
export interface IBioblocksRangeSliderState {
    /** Initial range the slider should be reset to. */
    defaultValue: number[];
    /** Range the slider is currently set to. */
    range: number[];
}
/**
 * Represents a simple 2d slider, allowing a range to be selected within a minimum and maximum.
 *
 * @export
 * @extends {React.Component<BioblocksRangeSliderProps, IBioblocksRangeSliderState>}
 */
export declare class BioblocksRangeSlider extends React.Component<BioblocksRangeSliderProps, IBioblocksRangeSliderState> {
    constructor(props: BioblocksRangeSliderProps);
    componentDidUpdate(prevProps: BioblocksRangeSliderProps): void;
    render(): JSX.Element;
    /**
     * Updates the state of the slider after user commits to change. If applicable, invokes appropriate callback.
     */
    protected onAfterChange: (cb?: BioblocksRangeSliderCallback | undefined) => (range: number[]) => void;
    /**
     * Updates the state of the slider as the user moves the slider around but before selection is committed.
     * If applicable, invokes appropriate callback as well.
     */
    protected onChange: (cb?: BioblocksRangeSliderCallback | undefined) => (range: number[]) => void;
    protected onReset: () => void;
}
