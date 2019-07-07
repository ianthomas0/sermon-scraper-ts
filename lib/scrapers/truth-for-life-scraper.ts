import { Context } from '@azure/functions';
import * as request from 'request-promise-native';
import { Sermon } from '../models';
import { SermonScraper } from './sermon-scraper';

import cheerio = require('cheerio');

export class TruthForLifeScraper implements SermonScraper {

    public source: string = 'Truth For Life';

    public async scrape (context: Context): Promise<Sermon[]> {
        const sermons = [];
        for (let page = 1; page <= 30; page++) {
            context.log(`Sermon index ${page}`);
            const options = {
                uri: `https://www.truthforlife.org/resources/?per_page=100&type=sermon&page=${page}`,
                transform: function (body) {
                    return cheerio.load(body);
                }
            };

            const $ = await request(options);

            $('div.archive-support').each(function (index, element) {
                const title = $(element)
                    .find('h4.archive-title')
                    .find('a')
                    .text()
                    .trim();
                const date = $(element)
                    .find('small.article-date')
                    .text()
                    .trim();
                const scripture = $(element)
                    .find('small.scripture-reference')
                    .text()
                    .trim();
                const url =
                    'https://www.truthforlife.org/resources/' +
                    $(this)
                        .find('h4.archive-title')
                        .find('a')
                        .attr('href');
                sermons.push({
                    title: title,
                    date: date,
                    scripture: scripture,
                    author: 'Alistair Begg',
                    source: this.source,
                    url: url
                });
            });
        }

        return sermons;
    }

}
