import { SermonScraper } from "./sermon-scraper";
import * as request from 'request-promise-native';
import { Sermon } from "../models";
import { Context } from "@azure/functions";

const cheerio = require('cheerio');

export class DesiringGodScraper implements SermonScraper {

    public source: string = 'Desiring God';

    public async scrape(context: Context): Promise<Sermon[]> {
        let sermons = [];
        context.log(`Scraping sermons for ${this.source}`);
        for (let index = 0; index <= 115; index++) {

            let options = {
                uri: `https://www.desiringgod.org/messages/all?page=${index}`,
                transform: function (body) {
                    return cheerio.load(body);
                }
            };

            let $ = await request(options);

            $('div.card--resource').each(function (index, element) {
                let title = $(element)
                    .find('h2.card--resource__title')
                    .text()
                    .trim();
                let date = $(element)
                    .find('div.card--resource__date')
                    .text()
                    .trim();
                let scripture = $(element)
                    .find('div.card--resource__scripture')
                    .text()
                    .trim();
                scripture = scripture.indexOf('Scripture') > -1 ? scripture.substring(11) : scripture;
                let author = $(element)
                    .find('div.card__author')
                    .text()
                    .trim();
                let url =
                    'https://www.desiringgod.org' +
                    $(element)
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

        return sermons;
    }

}
