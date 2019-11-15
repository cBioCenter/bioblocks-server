import { ILabel } from './';
export declare class Marker {
    static colors: {
        /**
         * Get a ILabels with colors auto set based on a the states passed
         * into the function. The function can at most generate 20 unique
         * colors. If more states exist than the colorset, the states that occur
         * the most number of times will receive ILabels and the others
         * will get undefined.
         *
         *
         * @param states the set of states to auto generate colors for
         * @param [colorSet=Marker.colorSets.colorBrewer] an array of colors
         * @returns each element in the array will correspond to
         *          each state. There will be a single ILabel object
         *          for each unique state name (likely occurring multiple
         *          times in the array)
         */
        autoColorFromStates(states: (string | undefined)[], colorSet?: string[]): (ILabel | undefined)[];
    };
    private static colorSets;
}
