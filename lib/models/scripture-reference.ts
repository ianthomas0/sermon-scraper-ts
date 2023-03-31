export interface ScriptureReference {
    book: string;
    bookOrder: number;
    chapter?: number;
    chapterEnd?: number;
    verseStart?: number;
    verseEnd?: number;
}
