import { Context } from '@azure/functions';
import * as request from 'request-promise-native';
import { Sermon } from '../models';
import { SermonScraper } from './sermon-scraper';

const cheerio = require('cheerio');

export class DesiringGodScraper implements SermonScraper {

    public source: string = 'Desiring God';

    public async scrape (context: Context): Promise<Sermon[]> {
        const sermons = [];
        context.log(`Scraping sermons for ${this.source}`);
        for (let index = 0; index <= 2; index++) {

            const options = {
                uri: `https://www.desiringgod.org/messages/all?page=${index}`,
                transform: function (body) {
                    return cheerio.load(body);
                }
            };

            const $ = await request(options);

            $('div.card--resource').each((index, element) => {
                const title = $(element)
                    .find('h2.card--resource__title')
                    .text()
                    .trim();
                const date = $(element)
                    .find('div.card--resource__date')
                    .text()
                    .trim();
                let scripture = $(element)
                    .find('div.card--resource__scripture')
                    .text()
                    .trim();
                scripture = scripture.indexOf('Scripture') > -1 ? scripture.substring(11) : scripture;
                const author = $(element)
                    .find('div.card__author')
                    .text()
                    .trim();
                const url =
                    'https://www.desiringgod.org' +
                    $(element)
                        .find('a.card__shadow')
                        .attr('href');

                const topics = $(element)
                    .find('a.card__shadow')
                    .attr('href');
                if (scripture) {
                    sermons.push({
                        title: title,
                        date: date,
                        scripture: scripture,
                        author: author,
                        source: 'Desiring God',
                        url: url
                    });
                }
            });
        }

        for (const s of sermons) {
            const options = {
                uri: `${s.url}`,
                transform: function (body) {
                    return cheerio.load(body);
                }
            };

            /*const $ = await request(options);

            const topics: string[] = [];

            $('div.resource__meta ul li').each((index, element) => {
                if (element.text().startsWith('Topic')) {
                    element.find('a').each((index, e) => {
                        topics.push(e.text());
                    });
                }
            });*/
        }

        return sermons;
    }

}
