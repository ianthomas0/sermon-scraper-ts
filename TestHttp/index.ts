import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { SermonScraperRunner } from '../lib';
import { Books } from '../lib/books';
import { DesiringGodScraper } from '../lib/scrapers';
import { HarvestIndySouthScraper } from '../lib/scrapers/harvest-indy-south-scraper';

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    const scraper = new HarvestIndySouthScraper();
    await SermonScraperRunner.runScraper(scraper, context);

    context.res = {
        status: 200,
        body: {
            message: `Scraper ${scraper.source} completed`,
        },
    };
};

export default httpTrigger;
