import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { SermonScraperRunner } from '../lib';
import { Books } from '../lib/books';
import { IndexExporter } from '../lib/scrapers/index-exporter';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    const scraper = new IndexExporter();
    await SermonScraperRunner.runScraper(scraper, context);

    context.res = {
        status: 200,
        body: {
            message: `Scraper ${scraper.source} completed`
        }
    };
};

export default httpTrigger;
