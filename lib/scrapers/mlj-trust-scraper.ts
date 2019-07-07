import { Context } from '@azure/functions';
import * as request from 'request-promise-native';
import { Books } from '../books';
import { Sermon } from '../models';
import { SermonScraper } from './sermon-scraper';

import cheerio = require('cheerio');

export class MLJTrustScraper implements SermonScraper {

    public source: string = 'MLJ Trust';

    public async scrape (context: Context): Promise<Sermon[]> {
        const sermons = [];
        const books = Books.books;
        let foundSermon: boolean;

        // tslint:disable-next-line: forin
        for (const book in books) {
            for (let page = 0; page <= 40; page++) {
                foundSermon = false;
                context.log(`Sermon index ${books[book]} ${page}`);

                const options = {
                    uri: `https://www.mljtrust.org/audio-sermons/${books[book].toLowerCase()}/?page=${page}`,
                    transform: function (body) {
                        return cheerio.load(body);
                    }
                };

                const $ = await request(options);

                $('div.sermon').each(function (index) {
                    const title = $(this)
                        .find('h3 a')
                        .text()
                        .trim();
                    let scripture = $(this)
                        .find('p.metadata')
                        .text()
                        .trim();
                    const scriptureTokens = scripture.split('—');
                    scripture = scriptureTokens[2];
                    const url =
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
