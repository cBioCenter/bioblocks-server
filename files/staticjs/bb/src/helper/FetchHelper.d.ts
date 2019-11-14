export declare const fetchCSVFile: (filename: string) => Promise<string>;
export declare const fetchJSONFile: (filename: string) => Promise<any>;
export declare const fetchFastaFile: (filename: string) => Promise<import("../data").SeqRecord[]>;
export declare const readFileAsText: (inputFile: File) => Promise<string>;
