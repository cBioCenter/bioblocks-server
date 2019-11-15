import { BIOBLOCKS_CHART_EVENT_TYPE, BIOBLOCKS_CHART_PIECE } from '..';
export declare class BioblocksChartEvent {
    readonly type: BIOBLOCKS_CHART_EVENT_TYPE;
    readonly chartPiece?: BIOBLOCKS_CHART_PIECE | undefined;
    readonly selectedPoints: number[];
    readonly plotlyEvent: Partial<Plotly.PlotMouseEvent> | Partial<Plotly.PlotSelectionEvent> | Partial<Plotly.LegendClickEvent>;
    constructor(type: BIOBLOCKS_CHART_EVENT_TYPE, chartPiece?: BIOBLOCKS_CHART_PIECE | undefined, selectedPoints?: number[], plotlyEvent?: Partial<Plotly.PlotMouseEvent> | Partial<Plotly.PlotSelectionEvent> | Partial<Plotly.LegendClickEvent>);
    isAxis(): boolean;
}
