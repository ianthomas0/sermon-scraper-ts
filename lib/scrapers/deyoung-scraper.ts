import { SermonScraper } from './sermon-scraper';
import * as request from 'request-promise-native';
import { Sermon } from '../models';
import { Context } from '@azure/functions';
import { OptionsWithUri } from 'request-promise-native';

const cheerio = require('cheerio');

export class DeYoungScraper implements SermonScraper {
    public source: string = 'University Reformed Church';

    public async scrape(context: Context): Promise<Sermon[]> {
        let sermons = [];
        context.log(`Scraping sermons for ${this.source}`);
        for (let index = 1; index <= 1; index++) {
            context.log(`Sermon index ${index}`);
            let options = {
                uri: `https://www.universityreformedchurch.org/teaching/sermons/?fwp_paged=${index}&fwp_per_page=100`,
                transform: function (body) {
                    return cheerio.load(body);
                },
            };

            let $ = await request(options);

            $('div.sermon').each((i, elem) => {
                let title = $(elem).find('div h3').text().trim();
                let date = $(elem)
                    .find('div.sermon-archive-date')
                    .text()
                    .trim();
                let author = $(elem).find('span.speaker').text().trim();
                let url = $(elem).find('div h3 a').attr('href');
                sermons.push({
                    title: title,
                    date: date,
                    author: author,
                    source: 'University Reformed Church',
                    url: url,
                });
            });
        }

        let sermonsWithScripture = [];

        let count = 0;
        let chunk = 0;
        let promises = [];
        for (let sermon of sermons) {
            count++;

            let options: OptionsWithUri = {
                uri: sermon.url,
                transform: function (body) {
                    return cheerio.load(body);
                },
            };

            promises.push(this.fetchScripture(sermon, sermonsWithScripture, 0));
            if (count === 3) {
                await Promise.all(promises);
                promises = [];
                count = 0;
                chunk++;

                await this.sleep(1000);
            }
        }

        return sermonsWithScripture;
    }

    private sleep(millis) {
        return new Promise((resolve) => setTimeout(resolve, millis));
    }

    private fetchScripture(
        sermon: Sermon,
        sermonsWithScripture: Sermon[],
        retryCount: number
    ) {
        let options: OptionsWithUri = {
            uri: sermon.url,
            transform: function (body) {
                return cheerio.load(body);
            },
        };

        return request(options)
            .then(($) => {
                sermon.scripture = $('h3.sermon-subheading')
                    .text()
                    .split('/')[2];
                if (sermon.scripture) {
                    sermon.scripture = sermon.scripture.trim();
                    sermonsWithScripture.push(sermon);
                }
            })
            .catch((reason: any) => {
                if (retryCount < 5) {
                    this.fetchScripture(
                        sermon,
                        sermonsWithScripture,
                        retryCount++
                    );
                }
            });
    }
}
