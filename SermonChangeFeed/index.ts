import { CosmosClient } from '@azure/cosmos';
import { AzureFunction, Context } from '@azure/functions';
import { SermonDocument } from '../lib/models';

const key = process.env.CosmosAccessKey;
const endpoint = process.env.CosmosEndpoint;

const client = new CosmosClient({ endpoint, key });

const databaseDefinition = { id: 'sermons' };
const collectionDefinition = {
    id: 'sermons-processed',
    partitionKey: { paths: ['/Book'] },
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
        const docId = sermon.id;
        const sermonIndex = parseInt(docId.slice(-1)) - 1;

        let modified = false;

        if (modified) {
            context.log('Updated document');
            await container.items.upsert(sermon);
        }
    }
};

export default cosmosDBTrigger;
