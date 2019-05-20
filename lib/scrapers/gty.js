//@ts-check
const request = require('request-promise-native');
const cheerio = require('cheerio');

let sermons = [];
async function main() {
  for (let book = 0; book <= 70; book++) {
    for (let index = 0; index <= 7; index++) {
      console.log(`Sermon index ${index}`);
      var options = {
        uri: `https://www.gty.org/api/Library/GetResources/0/scripture/${book}/0/sermons-library/en/${index}/US?_=1536519606894`,
        transform: function (body) {
          return cheerio.load(body);
        }
      };

      var s = await request(options).json();

      if (s.totalNumberOfRecords > 0) {
        for (let sermon of s.items) {

          var url =
            `https://www.gty.org/library/sermons-library/${sermon.code}/${sermon.seoFriendlyName}`;
          sermons.push({
            title: sermon.name,
            date: sermon.dateDisplay,
            scripture: sermon.scripture,
            author: 'John MacArthur',
            source: 'Grace To You',
            url: url
          });
        };
      }
    }
  }

  return sermons;
}

main();
