import { AzureFunction, Context } from '@azure/functions';
import { SermonScraperRunner } from '../lib';
import { GospelInLifeScraper } from '../lib/scrapers';

const timerTrigger: AzureFunction = async function (context: Context, myTimer: any): Promise<void> {
    let scraper = new GospelInLifeScraper();
    await SermonScraperRunner.runScraper(scraper, context);
};

export default timerTrigger;
