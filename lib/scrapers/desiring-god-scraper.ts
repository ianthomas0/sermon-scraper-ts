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

      var options = {
        uri: `https://www.desiringgod.org/messages/all?page=${index}`,
        transform: function (body) {
          return cheerio.load(body);
        }
      };

      var $ = await request(options);

      $('div.card--resource').each(function (index) {
        var title = $(this)
          .find('h2.card--resource__title')
          .text()
          .trim();
        var date = $(this)
          .find('div.card--resource__date')
          .text()
          .trim();
        var scripture = $(this)
          .find('div.card--resource__scripture')
          .text()
          .trim();
        scripture = scripture.indexOf('Scripture') > -1 ? scripture.substring(11) : scripture;
        var author = $(this)
          .find('div.card__author')
          .text()
          .trim();
        var url =
          'https://www.desiringgod.org' +
          $(this)
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
