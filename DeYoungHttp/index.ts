import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { CapitolHillBaptistScraper } from "../lib/scrapers";
import { SermonScraperRunner } from "../lib";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    const scraper = new CapitolHillBaptistScraper();
    await SermonScraperRunner.runScraper(scraper, context);

    context.res = {
        status: 200,
        body: {
            message: `Scraper ${scraper.source} completed`
        }
    };
};

export default httpTrigger;
