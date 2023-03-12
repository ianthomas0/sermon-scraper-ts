import { OptionsWithUrl } from 'request';
import { RequestPromiseOptions } from 'request-promise';
import * as request from 'request-promise-native';
import { Sermon } from './models';
import { SermonData } from './models/sermon-data';

import _ = require('lodash');
let moment = require('moment');

export class SermonUploader {
    public static async uploadSermons(sermons: Sermon[]): Promise<number> {
        let count = 0;
        let totalCount = 0;
        let sermonData: SermonData[] = [];
        for (const sermon of sermons) {
            if (sermon.scripture) {
                let index = 1;
                for (const scriptureReference of sermon.scriptureReferences) {
                    const id = `${sermon.title.replace(
                        /[^0-9a-z]/gi,
                        ''
                    )}${index}`;

                    let data: SermonData = {
                        Book: scriptureReference.book,
                        Chapter: scriptureReference.chapter,
                        VerseStart: scriptureReference.verseStart,
                        VerseEnd: scriptureReference.verseEnd,
                        Url: sermon.url,
                        Author: sermon.author,
                        Source: sermon.source,
                        Title: sermon.title,
                        Scripture: sermon.scripture,
                        Id: id,
                        Topics: sermon.topics,
                    };

                    if (sermon.date) {
                        const date = new moment(sermon.date);
                        data.Date = date.toISOString();
                    }

                    sermonData.push(data);

                    index++;
                    count++;
                }
            }

            if (count >= 100) {
                await this.upload(sermonData, count);
                count = 0;
                sermonData = [];
                totalCount = totalCount + 100;
            }
        }

        const uploadCount = await this.upload(sermonData, count);
        totalCount = totalCount + uploadCount;

        return totalCount;
    }

    private static async upload(
        sermonData: SermonData[],
        count: number
    ): Promise<number> {
        const options: OptionsWithUrl = {
            method: 'POST',
            url: `https://preachingcollectivefunctions.azurewebsites.net/api/InsertSermon`,
            body: sermonData,
            json: true,
        };

        await request(options);
        return count;
    }
}
