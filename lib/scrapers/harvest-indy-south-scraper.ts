import { SermonScraper } from "./sermon-scraper";
import * as request from 'request-promise-native';
import { Sermon } from "../models";
import { Context } from "@azure/functions";

const cheerio = require('cheerio');
const uniq = require('lodash.uniq');
const isEqual = require('lodash.isequal');

export class HarvestIndySouthScraper implements SermonScraper {

    public source: string = 'Harvest Indy South';

    public async scrape(context: Context): Promise<Sermon[]> {

        let sermons = [];
        for (let index = 1; index <= 8; index++) {
            context.log(`Sermon index ${index}`);
            let options = {
                uri: `https://www.harvestindysouth.org/resources/sermons/?page=${index}`,
                transform: function (body) {
                    return cheerio.load(body);
                }
            };

            let $ = await request(options);

            $('div.sermons-list div.container div.row div.last div.sermon').each(function (index, element) {
                let title = $(element)
                    .find('h2.sermon-title')
                    .text()
                    .trim();
                let date = $(element)
                    .find('p.sermon-date')
                    .text()
                    .trim();
                let scripture = $(element)
                    .find('ul.sermon-links li:first-child')
                    .text()
                    .trim();
                let author = $(element)
                    .find('ul.sermon-links li:last-child')
                    .text()
                    .trim();
                let url =
                    'https://www.harvestindysouth.org' +
                    $(element)
                        .find('a.btn-hollow')
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
            });

            sermons = uniq(sermons, isEqual);
        }

        return sermons;
    }
}