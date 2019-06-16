import { AzureFunction, Context } from "@azure/functions"
import { MLJTrustScraper } from "../lib/scrapers/mlj-trust-scraper";
import { SermonScraperRunner } from "../lib";

const timerTrigger: AzureFunction = async function (context: Context, myTimer: any): Promise<void> {
    let scraper = new MLJTrustScraper();
    await SermonScraperRunner.runScraper(scraper, context);
};

export default timerTrigger;
