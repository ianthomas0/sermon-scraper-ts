import { AzureFunction, Context } from "@azure/functions"
import { SermonScraperRunner } from '../lib';
import { DesiringGodScraper } from "../lib/scrapers/desiring-god-scraper";

const timerTrigger: AzureFunction = async function (context: Context, myTimer: any): Promise<void> {
    let scraper = new DesiringGodScraper();
    await SermonScraperRunner.runScraper(scraper, context);
};

export default timerTrigger;
