import { SermonScraper } from "./sermon-scraper";
import * as request from 'request-promise-native';
import { Sermon } from "../models";
import { Context } from "@azure/functions";

const cheerio = require('cheerio');

export class CapitolHillBaptistScraper implements SermonScraper {

    public source: string = 'Capitol Hill Baptist Church';

    public async scrape (context: Context): Promise<Sermon[]> {
        let sermons = [];
        for (let index = 1; index <= 10; index++) {
            context.log(`Sermon index ${index}`);
            let options = {
                uri: `https://www.capitolhillbaptist.org/resources/sermons/?page=${index}`,
                transform: function (body) {
                    return cheerio.load(body);
                }
            };

            let $ = await request(options);

            $('div.inner-article').each(function (index, elem) {
                const title = $(elem)
                    .find('h3')
                    .text()
                    .trim();
                const date = $(elem)
                    .find('span.date')
                    .text()
                    .trim();
                const scripture = $(elem)
                    .find('span.passage')
                    .text()
                    .trim();
                const scriptureRef = scripture.indexOf('Scripture') > -1 ? scripture.substring(11) : scripture;
                const author = $(elem)
                    .find('span.preacher')
                    .text()
                    .substring(3)
                    .trim();
                const url =
                    'https://www.capitolhillbaptist.org' +
                    $(elem)
                        .find('h3 a')
                        .attr('href');
                if (scriptureRef) {
                    sermons.push({
                        title: title,
                        //  date: date,
                        scripture: scripture,
                        author: author,
                        source: this.source,
                        url: url
                    });
                }
            });
        }

        return sermons;
    }
}
