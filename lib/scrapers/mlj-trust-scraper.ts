import { Context } from '@azure/functions';
import * as request from 'request-promise-native';
import { Books } from '../books';
import { Sermon } from '../models';
import { SermonScraper } from './sermon-scraper';

const cheerio = require('cheerio');
const _source = 'MLJ Trust';

export class MLJTrustScraper implements SermonScraper {

    public source: string = _source;

    public async scrape (context: Context): Promise<Sermon[]> {
        const sermons = [];

        let foundSermon: boolean;
        const book = context.bindingData['book'];

        for (let page = 0; page <= 40; page++) {
            foundSermon = false;
            context.log(`Sermon index ${book} ${page}`);

            const options = {
                uri: `https://www.mljtrust.org/audio-sermons/${Books.books[book].toLowerCase().replace(' ', '-')}/?page=${page}`,
                transform: function (body) {
                    return cheerio.load(body);
                }
            };

            const $ = await request(options);

            $('div.sermon').each(function (index, element) {
                const title = $(element)
                    .find('h3 a')
                    .text()
                    .trim();
                let scripture = $(element)
                    .find('p.metadata')
                    .text()
                    .trim();
                const scriptureTokens = scripture.split('—');
                scripture = scriptureTokens[2];
                const url =
                    'https://www.mljtrust.org' +
                    $(element)
                        .find('a')
                        .attr('href');
                if (scripture) {
                    sermons.push({
                        title: title,
                        scripture: scripture.trim(),
                        author: 'Martin Lloyd-Jones',
                        source: _source,
                        url: url
                    });
                }
            });
        }

        return sermons;
    }
}
