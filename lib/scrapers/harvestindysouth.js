//@ts-check
const request = require('request-promise-native');
const cheerio = require('cheerio');
const uniq = require('lodash.uniqwith');
const isEqual = require('lodash.isequal');

let sermons = [];
async function main() {
  for (let index = 1; index <= 8; index++) {
    console.log(`Sermon index ${index}`);
    var options = {
      uri: `https://www.harvestindysouth.org/resources/sermons/?page=${index}`,
      transform: function (body) {
        return cheerio.load(body);
      }
    };

    var $ = await request(options);

    $('div.sermons-list div.container div.row div.last div.sermon').each(function (index) {
      var title = $(this)
        .find('h2.sermon-title')
        .text()
        .trim();
      var date = $(this)
        .find('p.sermon-date')
        .text()
        .trim();
      var scripture = $(this)
        .find('ul.sermon-links li:first-child')
        .text()
        .trim();
      var author = $(this)
        .find('ul.sermon-links li:last-child')
        .text()
        .trim();
      var url =
        'https://www.harvestindysouth.org' +
        $(this)
          .find('a.btn-hollow')
          .attr('href');
      if (scripture) {
        sermons.push({
          title: title,
          date: date,
          scripture: scripture,
          author: author,
          source: 'Harvest Indy South',
          url: url
        });
      }
    });

    sermons = uniq(sermons, isEqual);
  }

  return sermons;
}

main();
