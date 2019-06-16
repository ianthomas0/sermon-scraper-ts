import { SermonScraper } from "./sermon-scraper";
import * as request from 'request-promise-native';
import { Sermon } from "../models";
import { Context } from "@azure/functions";

const cheerio = require('cheerio');

export class LigonierScraper implements SermonScraper {

    public source: string = 'Ligonier Ministries';

    public async scrape(context: Context): Promise<Sermon[]> {
        let sermons = [];
        for (let index = 0; index <= 33; index++) {
            context.log(`Sermon index ${index}`);
            let options = {
                uri: `https://www.ligonier.org/learn/sermons/?page_sermons=${index}&sort=az`,
                transform: function (body) {
                    return cheerio.load(body);
                }
            };

            let $ = await request(options);

            $('ul.resource-list li').each(function (index, element) {
                let title = $(element)
                    .find('h2 a')
                    .text()
                    .trim();
                let scripture = $(element)
                    .find('p.meta')
                    .text()
                    .trim();
                let url =
                    'https://www.ligonier.org' +
                    $(element)
                        .find('h2 a')
                        .attr('href');
                if (scripture) {
                    sermons.push({
                        title: title,
                        scripture: scripture,
                        author: 'R.C. Sproul',
                        source: this.source,
                        url: url
                    });
                }
            });
        }

        return sermons;
    }
}

