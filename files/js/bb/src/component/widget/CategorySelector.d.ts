import * as React from 'react';
export interface ICategorySelectorProps {
    /** Categories to select from. */
    categories: string[];
    /** Callback for when a new category is selected. */
    onCategoryChange?(event: React.SyntheticEvent<any>, data: object): void;
}
/**
 * Class to represent a dropdown.
 *
 * @extends {React.Component<ICategorySelectorProps, any>}
 */
export declare class CategorySelector extends React.Component<ICategorySelectorProps, any> {
    static defaultProps: {
        categories: never[];
    };
    constructor(props: ICategorySelectorProps);
    render(): JSX.Element;
}
