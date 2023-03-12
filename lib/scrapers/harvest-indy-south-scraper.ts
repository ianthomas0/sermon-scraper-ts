import { SermonScraper } from './sermon-scraper';
import * as request from 'request-promise-native';
import { Sermon } from '../models';
import { Context } from '@azure/functions';

const cheerio = require('cheerio');
const uniq = require('lodash.uniq');
const isEqual = require('lodash.isequal');
const _source = 'Redeemer Bible Church';

export class HarvestIndySouthScraper implements SermonScraper {
    public source: string = _source;

    public async scrape(context: Context): Promise<Sermon[]> {
        let sermons: Sermon[] = [];
        for (let index = 1; index <= 2; index++) {
            context.log(`Sermon index ${index}`);
            let options = {
                uri: `https://www.redeemerbible.church/sermons/?page=${index}`,
                transform: function (body) {
                    return cheerio.load(body);
                },
            };

            let $ = await request(options);

            $(
                'div.sermons-list div.container div.row div.last div.sermon'
            ).each(function (index, element) {
                let title = $(element).find('h2.sermon-title').text().trim();
                let date = $(element).find('p.sermon-date').text().trim();
                let scripture = $(element)
                    .find('ul.sermon-links li:first-child')
                    .text()
                    .trim();
                let author = $(element)
                    .find('ul.sermon-links li:last-child')
                    .text()
                    .trim();
                let url =
                    'https://www.redeemerbible.church' +
                    $(element).find('a.btn-hollow').attr('href');
                if (scripture) {
                    sermons.push({
                        title: title,
                        date: date,
                        scripture: scripture,
                        author: author,
                        source: _source,
                        url: url,
                    });
                }
            });

            sermons = uniq(sermons, isEqual);
        }

        return sermons;
    }
}
