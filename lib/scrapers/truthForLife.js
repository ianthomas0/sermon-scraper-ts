//@ts-check
const request = require('request-promise-native');
const cheerio = require('cheerio');

let sermons = [];
async function main() {
  for (let index = 1; index <= 30; index++) {
    console.log(`Sermon index ${index}`);
    var options = {
      uri: `https://www.truthforlife.org/resources/?per_page=100&type=sermon&page=${index}`,
      transform: function (body) {
        return cheerio.load(body);
      }
    };

    var $ = await request(options);

    $('div.archive-support').each(function (index) {
      var title = $(this)
        .find('h4.archive-title')
        .find('a')
        .text()
        .trim();
      var date = $(this)
        .find('small.article-date')
        .text()
        .trim();
      var scripture = $(this)
        .find('small.scripture-reference')
        .text()
        .trim();
      var url =
        'https://www.truthforlife.org/resources/' +
        $(this)
          .find('h4.archive-title')
          .find('a')
          .attr('href');
      sermons.push({
        title: title,
        date: date,
        scripture: scripture,
        author: 'Alistair Begg',
        source: 'Truth For Life',
        url: url
      });
    });
  }

  return sermons;
}

main();
