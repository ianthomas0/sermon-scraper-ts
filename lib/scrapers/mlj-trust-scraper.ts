import { SermonScraper } from "./sermon-scraper";
import * as request from 'request-promise-native';
import { Sermon } from "../models";
import { Context } from "@azure/functions";
import { Books } from '../books';

const cheerio = require('cheerio');

export class MLJTrustScraper implements SermonScraper {

    public source: string = 'MLJ Trust';

    public async scrape(context: Context): Promise<Sermon[]> {
        let sermons = [];
        let books = Books.books;
        let foundSermon: boolean;

        // tslint:disable-next-line: forin
        for (const book in books) {
            for (let index = 0; index <= 40; index++) {
                foundSermon = false;
                context.log(`Sermon index ${books[book]} ${index}`);

                var options = {
                    uri: `https://www.mljtrust.org/audio-sermons/${books[book].toLowerCase()}/?page=${index}`,
                    transform: function (body) {
                        return cheerio.load(body);
                    }
                };

                var $ = await request(options);

                $('div.sermon').each(function (index) {
                    var title = $(this)
                        .find('h3 a')
                        .text()
                        .trim();
                    var scripture = $(this)
                        .find('p.metadata')
                        .text()
                        .trim();
                    var scriptureTokens = scripture.split('—');
                    scripture = scriptureTokens[2];
                    var url =
                        'https://www.mljtrust.org' +
                        $(this)
                            .find('a')
                            .attr('href');
                    if (scripture) {
                        sermons.push({
                            title: title,
                            scripture: scripture.trim(),
                            author: 'Martin Lloyd-Jones',
                            source: this.source,
                            url: url
                        });
                    }
                });
            }
        }

        return sermons;
    }
}
