const parseSermons = require('../lib/parseSermonJson');
const upload = require('../lib/upload');
const scraper = require('../lib/scrapers/deyoung');
const source = 'University Reformed Church';

module.exports = async function (context, myTimer) {
    const timeStamp = new Date().toISOString();

    let sermons = await scraper(context, source);
    context.log(`${sermons.length} sermons scraped for ${source}`);
    const parsedSermons = await parseSermons(sermons, context);
    context.log(`${parsedSermons.length} sermons parsed for ${source}`);
    const count = await upload(parsedSermons, source, context);
    context.log(`${count} sermons uploaded for ${source} at ${timeStamp}`);
};
