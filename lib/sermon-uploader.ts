import { OptionsWithUrl } from 'request';
import { RequestPromiseOptions } from 'request-promise';
import * as request from 'request-promise-native';
import { Sermon } from './models';
import { SermonData } from './models/sermon-data';

import _ = require('lodash');
let moment = require('moment');

export class SermonUploader {
    public static async uploadSermons (sermons: any[]): Promise<number> {
        let count = 0;
        let totalCount = 0;
        let sermonData: SermonData[] = [];
        for (const sermon of sermons) {
            sermonData.push({
                Book: sermon.book,
                Chapter: sermon.chapter,
                VerseStart: sermon.verseStart,
                VerseEnd: sermon.verseEnd,
                Url: sermon.url,
                Author: sermon.author,
                Source: sermon.source,
                Date: sermon.date,
                Title: sermon.title,
                Scripture: sermon.scripture,
                Id: sermon.id,
                Topics: sermon.topics
            });

            count++;

            if (count >= 500) {
                await this.upload(sermonData, count);
                count = 0;
                sermonData = [];
                totalCount = totalCount + 500;
            }
        }

        const uploadCount = await this.upload(sermonData, count);
        totalCount = totalCount + uploadCount;

        return totalCount;
    }

    private static async upload (sermonData: SermonData[], count: number): Promise<number> {
        const options: OptionsWithUrl = {
            method: 'POST',
            url: `http://localhost:7073/api/InsertSermon`,
            body: sermonData,
            json: true
        };

        await request(options);
        return count;
    }
}
