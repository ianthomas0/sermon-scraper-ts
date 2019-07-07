import { Context } from '@azure/functions';
import * as request from 'request-promise-native';
import { Sermon } from '../models';
import { SermonScraper } from './sermon-scraper';

import cheerio = require('cheerio');

export class GospelInLifeScraper implements SermonScraper {

    public source: string = 'Gospel In Life';

    public async scrape (context: Context): Promise<Sermon[]> {
        const sermons = [];
        context.log(`Scraping sermons for ${this.source}`);
        for (let page = 0; page <= 5; page++) {

            const options = {
                uri: `https://gospelinlife.com/?fwp_categories=sermons-talks&fwp_paged=${page}`,
                transform: function (body) {
                    return cheerio.load(body);
                }
            };

            const $ = await request(options);

            $('table.results-table tbody tr.t-row').each(function (index, element) {
                const title = $(element)
                    .find('td.col-title')
                    .text()
                    .trim();
                const date = $(element)
                    .find('td.col-date')
                    .text()
                    .trim();
                const scripture = $(element)
                    .find('td.col-scripture')
                    .text()
                    .trim();
                const author = $(element)
                    .find('td.col-speaker')
                    .text()
                    .trim();
                const url =
                    $(element)
                        .find('td.col-title a.t-row-link')
                        .attr('href');
                if (scripture) {
                    sermons.push({
                        title: title,
                        date: date,
                        scripture: scripture,
                        author: author,
                        source: 'Gospel In Life',
                        url: url
                    });
                }
            });
        }

        return sermons;
    }

}
