import { Context } from '@azure/functions';
import * as request from 'request-promise-native';
import { Books } from '../books';
import { Sermon } from '../models';
import { SermonScraper } from './sermon-scraper';

export class IndexExporter implements SermonScraper {

    public source: string = 'Index Export';

    public async scrape (context: Context): Promise<Sermon[]> {
        const sermons = [];

        for (const book in Books.books) {
            if (Books.books.hasOwnProperty(book)) {
                const options = {
                    uri: `http://localhost:7073/api/SearchForSermon?book=${Books.books[book]}`
                };

                const sermonsRequest = await request(options);

                const sermonsResponse = JSON.parse(sermonsRequest);

                if (sermonsResponse.length > 900) {
                    console.log('too many sermons');
                }
                for (const s of sermonsResponse) {
                    sermons.push(s.document);
                }
            }
        }

        return sermons;
    }
}
