//@ts-check
const request = require('request-promise-native');
const cheerio = require('cheerio');

let sermons = [];
async function main() {
  for (let index = 1; index <= 100; index++) {
    console.log(`Sermon index ${index}`);
    var options = {
      uri: `https://www.tvcresources.net/resource-library/sermons/recently-added?page=${index}`,
      transform: function (body) {
        return cheerio.load(body);
      }
    };

    var $ = await request(options);

    $('div.container div.card-wrapper ').each(function (index) {
      if ($(this).find('date').length > 0) {
        var title = $(this)
          .find('h2 a')
          .text()
          .trim();
        var date = $(this)
          .find('date')
          .text()
          .trim();
        var scripture = $(this)
          .find('span.scripture a')
          .text()
          .trim();
        var author = $(this)
          .find('p.meta')
          .text()
          .trim();
        var url =
          'https://www.tvcresources.net' +
          $(this)
            .find('h2 a')
            .attr('href');
        if (scripture) {
          sermons.push({
            title: title,
            date: date,
            scripture: scripture,
            author: author,
            source: 'The Village Church',
            url: url
          });
        }
      }
    });
  }

  return sermons;
}

main();
