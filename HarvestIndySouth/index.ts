import { AzureFunction, Context } from "@azure/functions"
import { HarvestIndySouthScraper } from "../lib/scrapers/harvest-indy-south-scraper";
import { SermonScraperRunner } from "../lib";

const timerTrigger: AzureFunction = async function (context: Context, myTimer: any): Promise<void> {
    let scraper = new HarvestIndySouthScraper();
    await SermonScraperRunner.runScraper(scraper, context);
};

export default timerTrigger;
