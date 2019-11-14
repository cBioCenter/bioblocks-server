export interface ILabel {
    name: string;
    color: string;
    shape?: string;
}
export interface ILabelCategory {
    [category: string]: {
        [label: string]: ILabel;
    };
}
