export interface GraceToYouApiResponse {
    totalNumberOfRecords: number,
    items: GraceToYouSermon[];
}

export interface GraceToYouSermon {
    code: string;
    seoFriendlyName: string;
    name: string;
    dateDisplay: string;
    scripture: string;
}