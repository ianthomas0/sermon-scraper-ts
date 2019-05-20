const request = require('request-promise-native');
const cheerio = require('cheerio');
var fs = require('fs');
let books = require('../lib/books.json');

let sermons = [];
async function main() {
  for (let book in books) {
    for (let index = 0; index <= 40; index++) {
      foundSermon = false;
      console.log(`Sermon index ${books[book]} ${index}`);

      var options = {
        uri: `https://www.mljtrust.org/audio-sermons/${books[book].toLowerCase()}/?page=${index}`,
        transform: function (body) {
          return cheerio.load(body);
        }
      };

      var $ = await request(options);

      $('div.sermon').each(function (index) {
        var title = $(this)
          .find('h3 a')
          .text()
          .trim();
        var scripture = $(this)
          .find('p.metadata')
          .text()
          .trim();
        var scriptureTokens = scripture.split('—');
        scripture = scriptureTokens[2];
        var url =
          'https://www.mljtrust.org' +
          $(this)
            .find('a')
            .attr('href');
        if (scripture) {
          sermons.push({
            title: title,
            scripture: scripture.trim(),
            author: 'Martin Lloyd-Jones',
            source: 'MLJ Trust',
            url: url
          });
        }
      });
    }
  }

  console.log(`Writing ${sermons.length} sermons to file`);

  fs.writeFileSync('./sermons/sermons-mljtrust.json', JSON.stringify(sermons, null, 2));
}

main();
