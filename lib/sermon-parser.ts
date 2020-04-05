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
        const parsed = bcv.parse(scripture).osis();

        const references = parsed.split(',');

        const referencesParts: ScriptureReference[] = [];

        for (const r of references) {
            const range = r.split('-');
            const firstPart = range[0].split('.');

            const reference: ScriptureReference = {
                book: books[firstPart[0]],
                chapter: parseInt(firstPart[1], 10)
            };

            if (firstPart[2] != null) {
                reference.verseStart = parseInt(firstPart[2], 10);
            }

            if (range[1]) {
                const secondPart = range[1].split('.');
                reference.verseEnd = parseInt(secondPart[2], 10);
                reference.chapterEnd = parseInt(secondPart[1], 10);
            }

            referencesParts.push(reference);
        }

        return referencesParts;

    }
}
