import { Sermon } from "./models";
import * as request from 'request-promise-native';
import { RequestPromiseOptions } from "request-promise";
import { OptionsWithUrl } from "request";
import { SermonData } from "./models/sermon-data";


let _ = require('lodash');
const moment = require('moment');

export class SermonUploader {
  public static async uploadSermons(sermons: Sermon[]): Promise<number> {
    let count = 0;
    let totalCount = 0;
    let sermonData: SermonData[] = [];
    for (let sermon of sermons) {
      if (sermon.scripture) {
        let index = 1;
        for (let scriptureReference of sermon.scriptureReferences) {
          let date = new moment(sermon.date);
          let id = `${sermon.title.replace(/[^0-9a-z]/gi, '')}${index}`;

          sermonData.push({
            Book: scriptureReference.book,
            Chapter: scriptureReference.chapter,
            VerseStart: scriptureReference.verseStart,
            VerseEnd: scriptureReference.verseEnd,
            Url: sermon.url,
            Author: sermon.author,
            Source: sermon.source,
            Date: date.format('YYYY-MM-DD'),
            Title: sermon.title,
            Scripture: sermon.scripture,
            Id: id
          });

          index++;
          count++;
        }
      }

      if (count >= 500) {
        await this.upload(sermonData, count);
        count = 0;
        sermonData = [];
        totalCount = totalCount + 500;
      }
    }

    let uploadCount = await this.upload(sermonData, count);
    totalCount = totalCount + uploadCount;

    return totalCount;
  }

  private static async upload(sermonData: SermonData[], count: number): Promise<number> {
    let options: OptionsWithUrl = {
      method: 'POST',
      url: `https://preachingcollectivefunctions.azurewebsites.net/api/InsertSermon`,
      body: sermonData,
      json: true
    };

    await request(options);
    return count;
  }
}


