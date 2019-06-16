import { Context } from "@azure/functions";
import { SermonScraper } from "./scrapers";
import { SermonParser, SermonUploader } from ".";
import { timeStamp } from "console";

export class SermonScraperRunner {
    public static async runScraper(scraper: SermonScraper, context: Context): Promise<void> {
        const source = scraper.source;

        const sermons = await scraper.scrape(context);
        context.log(`${sermons.length} sermons scraped for ${source}`);
        const parsedSermons = await SermonParser.parseSermons(sermons, context);
        if (parsedSermons.length > 0) {
            context.log(`${parsedSermons.length} sermons parsed for ${source}`);
            const count = await SermonUploader.uploadSermons(parsedSermons);
            context.log(`${count} sermons uploaded for ${source} at ${timeStamp}`);
        }
    }
}
