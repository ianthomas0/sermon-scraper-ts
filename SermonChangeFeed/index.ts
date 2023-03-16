import { CosmosClient } from '@azure/cosmos';
import { AzureFunction, Context } from '@azure/functions';
import { SermonParser } from '../lib';
import { SermonDocument } from '../lib/models';

const key = process.env.CosmosAccessKey;
const endpoint = process.env.CosmosEndpoint;

const client = new CosmosClient({ endpoint, key });

const databaseDefinition = { id: 'sermons' };
const collectionDefinition = {
    id: 'sermon',
    partitionKey: { paths: ['/Book'] },
};

const bookOrderMap = {
    Genesis: 1,
    Exodus: 2,
    Leviticus: 3,
    Numbers: 4,
    Deuteronomy: 5,
    Joshua: 6,
    Judges: 7,
    Ruth: 8,
    '1 Samuel': 9,
    '2 Samuel': 10,
    '1 Kings': 11,
    '2 Kings': 12,
    '1 Chronicles': 13,
    '2 Chronicles': 14,
    Ezra: 15,
    Nehemiah: 16,
    Esther: 17,
    Job: 18,
    Psalms: 19,
    Proverbs: 20,
    Ecclesiastes: 21,
    'Song of Solomon': 22,
    Isaiah: 23,
    Jeremiah: 24,
    Lamentations: 25,
    Ezekiel: 26,
    Daniel: 27,
    Hosea: 28,
    Joel: 29,
    Amos: 30,
    Obadiah: 31,
    Jonah: 32,
    Micah: 33,
    Nahum: 34,
    Habakkuk: 35,
    Zephaniah: 36,
    Haggai: 37,
    Zechariah: 38,
    Malachi: 39,
    Matthew: 40,
    Mark: 41,
    Luke: 42,
    John: 43,
    Acts: 44,
    Romans: 45,
    '1 Corinthians': 46,
    '2 Corinthians': 47,
    Galatians: 48,
    Ephesians: 49,
    Philippians: 50,
    Colossians: 51,
    '1 Thessalonians': 52,
    '2 Thessalonians': 53,
    '1 Timothy': 54,
    '2 Timothy': 55,
    Titus: 56,
    Philemon: 57,
    Hebrews: 58,
    James: 59,
    '1 Peter': 60,
    '2 Peter': 61,
    '1 John': 62,
    '2 John': 63,
    '3 John': 64,
    Jude: 65,
    Revelation: 66,
};

const cosmosDBTrigger: AzureFunction = async function (
    context: Context,
    documents: any[]
): Promise<void> {
    context.log('Processing sermon change feed batch');
    const { database } = await client.databases.createIfNotExists(
        databaseDefinition
    );
    const { container } = await database.containers.createIfNotExists(
        collectionDefinition
    );

    for (const doc of documents) {
        let sermon = doc as SermonDocument;
        const ref = SermonParser.parseScripture(sermon.Scripture);
        const docId = sermon.id;
        const sermonIndex = parseInt(docId.slice(-1)) - 1;
        const relevantRef = ref[sermonIndex];

        let modified = false;

        /*if (relevantRef) {
            sermon.VerseEnd = relevantRef.verseEnd;
            sermon.VerseStart = relevantRef.verseStart;
            sermon.Chapter = relevantRef.chapter;
            sermon.ChapterEnd = relevantRef.chapterEnd;
        }*/

        if (!sermon.BookOrder) {
            let bookOrder = bookOrderMap[sermon.Book];
            sermon.BookOrder = bookOrder;
            modified = true;
        }

        if (sermon.Source === 'Capitol Hill Bapist Church') {
            sermon.Source = 'Capitol Hill Baptist Church';
            modified = true;
        }

        if (modified) {
            await container.items.upsert(sermon);
        }
    }
};

export default cosmosDBTrigger;
