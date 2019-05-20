//@ts-check
const request = require('request-promise-native');
const cheerio = require('cheerio');

let sermons = [];
async function main() {
  for (let index = 0; index <= 33; index++) {
    console.log(`Sermon index ${index}`);
    var options = {
      uri: `https://www.ligonier.org/learn/sermons/?page_sermons=${index}&sort=az`,
      transform: function (body) {
        return cheerio.load(body);
      }
    };

    var $ = await request(options);

    $('ul.resource-list li').each(function (index) {
      var title = $(this)
        .find('h2 a')
        .text()
        .trim();
      var scripture = $(this)
        .find('p.meta')
        .text()
        .trim();
      var url =
        'https://www.ligonier.org' +
        $(this)
          .find('h2 a')
          .attr('href');
      if (scripture) {
        sermons.push({
          title: title,
          scripture: scripture,
          author: 'R.C. Sproul',
          source: 'Ligonier Ministries',
          url: url
        });
      }
    });
  }

  return sermons;
}

main();
