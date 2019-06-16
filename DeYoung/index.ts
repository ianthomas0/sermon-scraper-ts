import { AzureFunction, Context } from "@azure/functions";
import { DeYoungScraper } from "../lib/scrapers/deyoung-scraper";
import { SermonScraperRunner } from "../lib";

const timerTrigger: AzureFunction = async function (context: Context, myTimer: any): Promise<void> {
    const timeStamp = new Date().toISOString();

    let scraper = new DeYoungScraper();
    await SermonScraperRunner.runScraper(scraper, context);
};

export default timerTrigger;
