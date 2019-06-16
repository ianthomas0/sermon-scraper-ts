import { AzureFunction, Context } from "@azure/functions"
import { LigonierScraper } from "../lib/scrapers/ligonier-scraper";
import { SermonScraperRunner } from "../lib";

const timerTrigger: AzureFunction = async function (context: Context, myTimer: any): Promise<void> {
    let scraper = new LigonierScraper();
    await SermonScraperRunner.runScraper(scraper, context);
};

export default timerTrigger;
