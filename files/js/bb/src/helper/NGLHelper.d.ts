import * as NGL from 'ngl';
export declare const defaultDistanceParams: Partial<NGL.IStructureRepresentationParams>;
export declare const defaultDistanceTooltipParams: Partial<NGL.IStructureRepresentationParams>;
/**
 * Draws a line between two residues in NGL.
 *
 * @param structureComponent The NGL Structure for which these residues belong to.
 * @param selection The [NGL Selection](http://nglviewer.org/ngl/api/manual/selection-language.html) defining the residues.
 */
export declare const createDistanceRepresentation: (structureComponent: NGL.StructureComponent, selection: string | number[], isTooltipEnabled: boolean, params?: Partial<NGL.IStructureRepresentationParams>) => NGL.RepresentationElement;
/**
 * Marks a set of residues with a ball+stick representation in NGL.
 *
 * @param structureComponent The NGL Structure for which these residues belong to.
 * @param residues The residues to mark.
 */
export declare const createBallStickRepresentation: (structureComponent: NGL.StructureComponent, residues: number[]) => NGL.RepresentationElement;
/**
 * Highlights a secondary structure in NGL.
 *
 * @param structureComponent The NGL Structure for which these residues belong to.
 * @param section The secondary structure section to highlight.
 * @param [radiusScale=5] How large to make the ribbon highlight.
 * @param [color='pink'] The color of the ribbon highlight.
 */
export declare const createSecStructRepresentation: (structureComponent: NGL.StructureComponent, section: import("../data").Bioblocks1DSection<"G" | "H" | "I" | "T" | "E" | "B" | "S" | "C">, radiusScale?: number, color?: string) => NGL.RepresentationElement;
