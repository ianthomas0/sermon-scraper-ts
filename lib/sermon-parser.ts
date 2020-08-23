// tslint:disable-next-line: no-var-requires
const bcv_parser = require('bible-passage-reference-parser/js/en_bcv_parser').bcv_parser;
const bcv = new bcv_parser();
import { Books } from './books';

import { ScriptureReference } from './models';

export class SermonParser {

    public static parseSermons (sermons, context) {
        const parsedSermons = [];
        for (const sermon of sermons) {
            this.parseSermon(sermon, context);
            parsedSermons.push(sermon);
        }

        return parsedSermons;
    }

    public static parseSermon (sermon, context) {
        const parsedScripture = this.parseScripture(sermon.scripture);
        sermon.scriptureReferences = parsedScripture;
        sermon.date = undefined;

        return sermon;
    }

    public static parseScripture (scripture): ScriptureReference[] {
        const books = Books.books;
        bcv.set_options({ osis_compaction_strategy: 'bcv' });
        const parsed = bcv.parse(scripture).osis();

        const references = parsed.split(',');

        const referencesParts: ScriptureReference[] = [];

        for (const r of references) {
            const range = r.split('-');
            const firstPart = range[0].split('.');

            const parsedChapter = parseInt(firstPart[1], 10);

            let reference: ScriptureReference = {
                book: books[firstPart[0]],
                chapter: parsedChapter
            };

            let formatted = `${reference.book} ${parsedChapter}`;

            if (firstPart[2] != null) {
                reference.verseStart = parseInt(firstPart[2], 10);
                formatted = `${formatted}:${reference.verseStart}`;
            }

            if (range[1]) {
                const secondPart = range[1].split('.');
                reference.verseEnd = parseInt(secondPart[2], 10);
                reference.chapterEnd = parseInt(secondPart[1], 10);
                if (reference.chapterEnd && reference.chapterEnd !== reference.chapter) {
                    formatted = `${formatted}-${reference.chapterEnd}:${reference.verseEnd}`;
                } else {
                    formatted = `${formatted}-${reference.verseEnd}`;
                }
            }

            reference.formatted = formatted;

            // Set defaults for end chapter and verse for references that don't have them
            // for the sake of searching via a range, i.e. Gen 1:1 => Gen 1:1-1:1
            if (!reference.chapterEnd) {
                reference.chapterEnd = reference.chapter;
            }

            if (reference.verseStart && !(reference.verseEnd)) {
                reference.verseEnd = reference.verseStart;
            }

            referencesParts.push(reference);
        }

        return referencesParts;
    }
}
