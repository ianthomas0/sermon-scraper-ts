import { SermonScraper } from "./sermon-scraper";
import * as request from 'request-promise-native';
import { Sermon } from "../models";
import { Context } from "@azure/functions";

const cheerio = require('cheerio');

export class VillageChurchScraper implements SermonScraper {

    public source: string = 'The Village Church';

    public async scrape(context: Context): Promise<Sermon[]> {
        let sermons = [];
        for (let index = 1; index <= 100; index++) {
            context.log(`Sermon index ${index}`);
            let options = {
                uri: `https://www.tvcresources.net/resource-library/sermons/recently-added?page=${index}`,
                transform: function (body) {
                    return cheerio.load(body);
                }
            };

            let $ = await request(options);

            $('div.container div.card-wrapper ').each(function (index, element) {
                if ($(this).find('date').length > 0) {
                    let title = $(element)
                        .find('h2 a')
                        .text()
                        .trim();
                    let date = $(element)
                        .find('date')
                        .text()
                        .trim();
                    let scripture = $(element)
                        .find('span.scripture a')
                        .text()
                        .trim();
                    let author = $(this)
                        .find('p.meta')
                        .text()
                        .trim();
                    let url =
                        'https://www.tvcresources.net' +
                        $(this)
                            .find('h2 a')
                            .attr('href');
                    if (scripture) {
                        sermons.push({
                            title: title,
                            date: date,
                            scripture: scripture,
                            author: author,
                            source: this.source,
                            url: url
                        });
                    }
                }
            });
        }

        return sermons;
    }

}
