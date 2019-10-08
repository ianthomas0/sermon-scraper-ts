import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { SermonScraperRunner } from '../lib';
import { Books } from '../lib/books';
import { DesiringGodScraper } from '../lib/scrapers';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    const scraper = new DesiringGodScraper();
    await SermonScraperRunner.runScraper(scraper, context);

    context.res = {
        status: 200,
        body: {
            message: `Scraper ${scraper.source} completed`
        }
    };
};

export default httpTrigger;
