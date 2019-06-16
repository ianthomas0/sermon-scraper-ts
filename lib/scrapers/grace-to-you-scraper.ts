import { SermonScraper } from "./sermon-scraper";
import * as request from 'request-promise-native';
import { Sermon } from "../models";
import { Context } from "@azure/functions";
import { OptionsWithUrl } from "request-promise-native";
import { GraceToYouApiResponse } from "../models/gty-api-response";

export class GraceToYouScraper implements SermonScraper {

    public source: string = 'Grace To You';

    public async scrape(context: Context): Promise<Sermon[]> {
        let sermons = [];
        for (let book = 0; book <= 70; book++) {
            for (let index = 0; index <= 7; index++) {
                context.log(`Sermon index ${index}`);
                let options: OptionsWithUrl = {
                    url: `https://www.gty.org/api/Library/GetResources/0/scripture/${book}/0/sermons-library/en/${index}/US?_=1536519606894`
                };

                let s = await request(options);

                let res: GraceToYouApiResponse = s.json();

                if (res.totalNumberOfRecords > 0) {
                    for (let sermon of res.items) {

                        let url =
                            `https://www.gty.org/library/sermons-library/${sermon.code}/${sermon.seoFriendlyName}`;
                        sermons.push({
                            title: sermon.name,
                            date: sermon.dateDisplay,
                            scripture: sermon.scripture,
                            author: 'John MacArthur',
                            source: this.source,
                            url: url
                        });
                    };
                }
            }
        }

        return sermons;
    }
}