import { AzureFunction, Context } from "@azure/functions"
import { SermonParser } from '../lib/sermon-parser';
import { DesiringGodScraper } from "../lib/scrapers/desiring-god-scraper";
const upload = require('../lib/upload');

const timerTrigger: AzureFunction = async function (context: Context, myTimer: any): Promise<void> {
    const timeStamp = new Date().toISOString();
    let scraper = new DesiringGodScraper();
    let source = scraper.source;

    let sermons = await scraper.scrape(context);
    context.log(`${sermons.length} sermons scraped for ${source}`);
    const parsedSermons = await SermonParser.parseSermons(sermons, context);
    context.log(`${parsedSermons.length} sermons parsed for ${source}`);
    const count = await upload(parsedSermons, source, context);
    context.log(`${count} sermons uploaded for ${source} at ${timeStamp}`);
};

export default timerTrigger;
