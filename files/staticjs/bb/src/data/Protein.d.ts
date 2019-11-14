export interface IProteinInfo {
    created: string;
    modified: string;
    type: string;
    version: number;
}
export interface IName {
    type: string;
    value: string;
}
export declare const enum LINEAGE_TYPES {
    'Catarrhini' = 0,
    'Chordata' = 1,
    'Craniata' = 2,
    'Euarchontoglires' = 3,
    'Eukaryota' = 4,
    'Euteleostomi' = 5,
    'Eutheria' = 6,
    'Haplorrhini' = 7,
    'Hominidae' = 8,
    'Homo' = 9,
    'Mammalia' = 10,
    'Metazoa' = 11,
    'Primates' = 12,
    'Vertebrata' = 13
}
export interface IOrganism {
    lineage: Array<keyof typeof LINEAGE_TYPES>;
    names: IName[];
    taxonomy: number;
}
export interface INamePair {
    fullName: ITextValue;
    shortName?: ITextValue[];
}
export interface IProteinName {
    alternativeName: INamePair[];
    recommendedName: INamePair;
}
export interface IGene {
    name: ITextValue;
    synonyms: ITextValue[];
}
export declare const enum INTERACTION_TYPE {
    'BINARY' = 0,
    'SELF' = 1,
    'XENO' = 2
}
export interface IInteraction {
    experiments: number;
    gene: string;
    id: string;
    interactionType: keyof typeof INTERACTION_TYPE;
    interactor1: string;
    interactor2: string;
    organismDiffer: boolean;
}
export interface ISource {
    alternativeUrl: string;
    id: string;
    name: string;
    tissue: ITextValue[];
    url: string;
}
export interface IEvidence {
    code: string;
    source: Partial<ISource>;
}
export interface ICommentLocation {
    location: Partial<ILocationDescription>;
}
export declare const enum DB_REFERENCE_TYPE {
    'Bgee' = 0,
    'BioGrid' = 1,
    'BioMuta' = 2,
    'CCDS' = 3,
    'CORUM' = 4,
    'CTD' = 5,
    'ChiTaRS' = 6,
    'CleanEx' = 7,
    'ComplexPortal' = 8,
    'DIP' = 9,
    'DMDM' = 10,
    'DNASU' = 11,
    'DOI' = 12,
    'DisGeNET' = 13,
    'DisProt' = 14,
    'EMBL' = 15,
    'EPD' = 16,
    'Ensembl' = 17,
    'EuPathDB' = 18,
    'EvolutionaryTrace' = 19,
    'ExpressionAtlas' = 20,
    'GO' = 21,
    'Gene3D' = 22,
    'GeneCards' = 23,
    'GeneID' = 24,
    'GeneReviews' = 25,
    'GeneTree' = 26,
    'GeneWiki' = 27,
    'Genevisible' = 28,
    'GenomeRNAi' = 29,
    'HGNC' = 30,
    'HOGENOM' = 31,
    'HOVERGEN' = 32,
    'HPA' = 33,
    'InParanoid' = 34,
    'IntAct' = 35,
    'InterPro' = 36,
    'KEGG' = 37,
    'KO' = 38,
    'MIM' = 39,
    'MINT' = 40,
    'MalaCards' = 41,
    'MaxQB' = 42,
    'OMA' = 43,
    'OpenTargets' = 44,
    'Orphanet' = 45,
    'OrthoDB' = 46,
    'PANTHER' = 47,
    'PDB' = 48,
    'PDBsum' = 49,
    'PIR' = 50,
    'PRIDE' = 51,
    'PRO' = 52,
    'PROSITE' = 53,
    'PaxDb' = 54,
    'PeptideAtlas' = 55,
    'Pfam' = 56,
    'PharmGKB' = 57,
    'PhosphoSitePlus' = 58,
    'PhylomeDB' = 59,
    'ProteinModelPortal' = 60,
    'Proteomes' = 61,
    'ProteomicsDB' = 62,
    'PubMed' = 63,
    'Reactome' = 64,
    'RefSeq' = 65,
    'SIGNOR' = 66,
    'SMART' = 67,
    'SMR' = 68,
    'STRING' = 69,
    'SUPFAM' = 70,
    'SignaLink' = 71,
    'TreeFam' = 72,
    'UCSC' = 73,
    'UniGene' = 74,
    'eggNOG' = 75,
    'iPTMnet' = 76,
    'neXtProt' = 77
}
export interface IDbReference {
    evidences: Array<Partial<IEvidence>>;
    id: string;
    properties: Partial<IProperties>;
    type: keyof typeof DB_REFERENCE_TYPE;
}
export interface ILocationDescription {
    value: string;
    evidences: Array<Partial<IEvidence>>;
}
export declare enum PROTEIN_COMMENT_TYPE {
    'DISEASE' = 0,
    'DOMAIN' = 1,
    'FUNCTION' = 2,
    'INTERACTION' = 3,
    'MIM' = 4,
    'PTM' = 5,
    'SIMILARITY' = 6,
    'SUBCELLULAR_LOCATION' = 7,
    'SUBUNIT' = 8,
    'WEBRESOURCE' = 9
}
export interface IComment {
    type: keyof typeof PROTEIN_COMMENT_TYPE;
    text: any;
    interactions: Array<Partial<IInteraction>>;
    locations: Array<Partial<ICommentLocation>>;
    diseaseId: string;
    acronym: string;
    dbReference: Partial<IDbReference>;
    description: Partial<ILocationDescription>;
    name: string;
    url: string;
}
export declare const enum FEATURE_TYPES {
    'CHAIN' = 0,
    'COMPBIAS' = 1,
    'CROSSLNK' = 2,
    'DOMAIN' = 3,
    'HELIX' = 4,
    'METAL' = 5,
    'MOD_RES' = 6,
    'MUTAGEN' = 7,
    'REGION' = 8,
    'SITE' = 9,
    'STRAND' = 10,
    'TURN' = 11,
    'VARIANT' = 12
}
export interface IFeature {
    type: keyof typeof FEATURE_TYPES;
    category: string;
    ftId: string;
    description: string;
    begin: string;
    end: string;
    evidences: Array<Partial<IEvidence>>;
    alternativeSequence: string;
}
export declare const enum DB_REFERENCE_PROPERTY_TYPE {
    'gene' = 0,
    'phenotype' = 1
}
export interface IProperties {
    'entry name': string;
    'expression patterns': string;
    'gene ID': string;
    'gene designation': string;
    'match status': string;
    'molecule type': string;
    'nucleotide sequence ID': string;
    'organism name': string;
    'pathway name': string;
    'protein sequence ID': string;
    'taxonomic scope': string;
    Description: string;
    chains: string;
    component: string;
    disease: string;
    entryName: string;
    interactions: string;
    method: string;
    resolution: string;
    source: string;
    status: string;
    term: string;
    type: keyof typeof DB_REFERENCE_PROPERTY_TYPE;
}
export interface ITextValue {
    value: string;
}
export interface IPublication {
    journalName: string;
    submissionDatabase: string;
}
export interface IPublicationLocation {
    firstPage: string;
    lastPage: string;
    volume: string;
}
export declare const enum CITATION_TYPE {
    'journal article' = 0,
    'submission' = 1
}
export interface ICitation {
    authors: string[];
    consortiums: string[];
    dbReferences: Array<Partial<IDbReference>>;
    location: Partial<IPublicationLocation>;
    publication: Partial<IPublication>;
    publicationDate: string;
    title: string;
    type: keyof typeof CITATION_TYPE;
}
export interface IReference {
    citation: Partial<ICitation>;
    scope: string[];
    source: Partial<ISource>;
}
export interface ISequence {
    length: number;
    mass: number;
    modified: string;
    sequence: string;
    version: number;
}
export interface IProtein {
    [key: string]: any;
    accession: string;
    comments: Array<Partial<IComment>>;
    dbReferences: Array<Partial<IDbReference>>;
    features: Array<Partial<IFeature>>;
    gene: Array<Partial<IGene>>;
    id: string;
    info: IProteinInfo;
    keywords: Array<Partial<ITextValue>>;
    organism: Partial<IOrganism>;
    protein: Partial<IProteinName>;
    proteinExistence: string;
    references: Array<Partial<IReference>>;
    secondaryAccession: string[];
    sequence: ISequence;
}
