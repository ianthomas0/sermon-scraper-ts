import { Sermon } from '../models';
import { Context } from '@azure/functions';

export interface SermonScraper {
    source: string;
    scrape(context: Context): Promise<Sermon[]>;
}