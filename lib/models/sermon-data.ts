export interface SermonData {
    Book: string;
    BookOrder: number;
    Chapter: number;
    ChapterEnd?: number;
    VerseStart: number;
    VerseEnd: number;
    Url: string;
    Author: string;
    Source: string;
    Date?: string;
    Title: string;
    Scripture: string;
    Id: string;
    Topics: string[];
    Version: number;
}
