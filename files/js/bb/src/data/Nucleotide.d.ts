export declare class Nucleotide {
    readonly fullName: string;
    readonly singleLetterCode: string;
    static A: Nucleotide;
    static C: Nucleotide;
    static G: Nucleotide;
    static T: Nucleotide;
    static U: Nucleotide;
    static UKN: Nucleotide;
    static Adenine: Nucleotide;
    static Cytosine: Nucleotide;
    static Guanine: Nucleotide;
    static Thymine: Nucleotide;
    static Uracil: Nucleotide;
    static Unknown: Nucleotide;
    static readonly allNucleotides: Nucleotide[];
    static fromSingleLetterCode(code: string): Nucleotide;
    static fromFullName(fullName: string): Nucleotide;
    private constructor();
    getComplementDNA(): Nucleotide;
    getComplementRNA(): Nucleotide;
}
