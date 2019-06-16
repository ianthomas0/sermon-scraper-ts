import { AzureFunction, Context } from "@azure/functions"
import { GraceToYouScraper } from "../lib/scrapers/grace-to-you-scraper";
import { SermonScraperRunner } from "../lib";

const timerTrigger: AzureFunction = async function (context: Context, myTimer: any): Promise<void> {
    let scraper = new GraceToYouScraper();
    await SermonScraperRunner.runScraper(scraper, context);
};

export default timerTrigger;
