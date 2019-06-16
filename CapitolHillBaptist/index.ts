import { AzureFunction, Context } from "@azure/functions"
import { CapitolHillBaptistScraper } from "../lib/scrapers/capitol-hill-baptist-scraper";
import { SermonScraperRunner } from "../lib";

const timerTrigger: AzureFunction = async function (context: Context, myTimer: any): Promise<void> {
    let scraper = new CapitolHillBaptistScraper();
    await SermonScraperRunner.runScraper(scraper, context);
};

export default timerTrigger;
