import { CosmosClient } from "@azure/cosmos";
import { AzureFunction, Context } from "@azure/functions";
import { SermonParser } from "../lib";

const key = process.env.CosmosAccessKey;
const endpoint = process.env.CosmosEndpoint;

const client = new CosmosClient({ endpoint, key });

const databaseDefinition = { id: "sermons" };
const collectionDefinition = {
    id: "sermons-processed",
    partitionKey: { paths: ["/Book"] },
};

const cosmosDBTrigger: AzureFunction = async function (
    context: Context,
    documents: any[]
): Promise<void> {
    context.log("Processing sermon change feed batch");
    const { database } = await client.databases.createIfNotExists(
        databaseDefinition
    );
    const { container } = await database.containers.createIfNotExists(
        collectionDefinition
    );

    for (const sermon of documents) {
        const ref = SermonParser.parseScripture(sermon.Scripture);
        const docId = sermon.id;
        const sermonIndex = docId.slice(-1) - 1;
        const relevantRef = ref[sermonIndex];

        if (relevantRef) {
            sermon.VerseEnd = relevantRef.verseEnd;
            sermon.VerseStart = relevantRef.verseStart;
            sermon.Chapter = relevantRef.chapter;
            sermon.ChapterEnd = relevantRef.chapterEnd;
        }

        await container.items.upsert(sermon);
    }
};

export default cosmosDBTrigger;
