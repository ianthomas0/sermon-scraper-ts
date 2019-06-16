import { SermonScraper } from "./sermon-scraper";
import * as request from 'request-promise-native';
import { Sermon } from "../models";
import { Context } from "@azure/functions";

const cheerio = require('cheerio');


export class TruthForLifeScraper implements SermonScraper {

    public source: string = 'Truth For Life';

    public async scrape(context: Context): Promise<Sermon[]> {
        const sermons = [];
        for (let index = 1; index <= 30; index++) {
            context.log(`Sermon index ${index}`);
            const options = {
                uri: `https://www.truthforlife.org/resources/?per_page=100&type=sermon&page=${index}`,
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
                let scripture = $(element)
                    .find('small.scripture-reference')
                    .text()
                    .trim();
                let url =
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