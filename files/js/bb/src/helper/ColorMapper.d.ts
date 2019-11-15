import { Color } from 'plotly.js/lib/index-gl2d';
import { SemanticCOLORS } from 'semantic-ui-react';
/**
 * Class to allow a mapping between a type and a color.
 *
 * @export
 */
export declare class ColorMapper<T> {
    readonly colorMap: Map<T, string | number | (string | number | null | undefined)[] | (string | number | null | undefined)[][] | undefined>;
    readonly defaultColor: SemanticCOLORS;
    readonly colors: Color[];
    static DEFAULT_COLORS: SemanticCOLORS[];
    constructor(colorMap?: Map<T, string | number | (string | number | null | undefined)[] | (string | number | null | undefined)[][] | undefined>, defaultColor?: SemanticCOLORS, colors?: Color[]);
    /**
     * Get the color for the provided key - if the key isn't stored, it will be added using the set of colors for this mapper.
     */
    getColorFor(key: T): Color;
    /**
     * Method to allow a user to just add an entry to the colorMapper.
     *
     * @param key Key to store.
     * @param [color] Allows a color to be explicitly set for this key.
     * @param [addToColors] Flag to allow/disallow color to be added to set of colors used by this ColorMapper.
     */
    addEntry(key: T, color?: Color, addToColors?: boolean): void;
    /**
     * Sets the entry for the internal ColorMapper Map.
     * @param key Key to add
     * @param [color] Explicit color to use if provided.
     * @param [addToColors] Flag to allow/disallow color to be added to set of colors used by this ColorMapper.
     */
    protected addColorToMapper(key: T, color?: Color, addToColors?: boolean): void;
}
