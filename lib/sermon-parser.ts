const bcv_parser = require('bible-passage-reference-parser/js/en_bcv_parser').bcv_parser;
const bcv = new bcv_parser();
import { Books } from './books';

import { ScriptureReference } from './models';

export class SermonParser {

    public static parseSermons (sermons, context) {
        const parsedSermons = [];
        for (let sermon of sermons) {
            let parsedScripture = this.parseScripture(sermon.scripture);
            sermon.scriptureReferences = parsedScripture;
            sermon.date = undefined;
            parsedSermons.push(sermon);
        }

        return parsedSermons;
    }

    public static parseScripture (scripture) {
        let books = Books.books;
        let parsed = bcv.parse(scripture).osis();

        let references = parsed.split(',');

        let referencesParts = [];

        for (let r of references) {
            let range = r.split('-');
            let firstPart = range[0].split('.');

            let reference: ScriptureReference = {
                book: books[firstPart[0]],
                chapter: parseInt(firstPart[1])
            };

            if (firstPart[2] != null) {
                reference.verseStart = parseInt(firstPart[2]);
            }

            if (range[1]) {
                let secondPart = range[1].split('.');
                reference.verseEnd = parseInt(secondPart[2]);
            }

            referencesParts.push(reference);
        }

        return referencesParts;

    }
}
