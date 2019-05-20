//@ts-check
const request = require('request-promise-native');
const cheerio = require('cheerio');

let sermons = [];
async function main() {
  for (let index = 1; index <= 200; index++) {
    console.log(`Sermon index ${index}`);
    var options = {
      uri: `https://www.capitolhillbaptist.org/resources/sermons/?page=${index}`,
      transform: function (body) {
        return cheerio.load(body);
      }
    };

    var $ = await request(options);

    $('article.sermons').each(function (index) {
      var title = $(this)
        .find('h3')
        .text()
        .trim();
      var date = $(this)
        .find('span.date')
        .text()
        .trim();
      var scripture = $(this)
        .find('span.passage')
        .text()
        .trim();
      scripture = scripture.indexOf('Scripture') > -1 ? scripture.substring(11) : scripture;
      var author = $(this)
        .find('span.preacher')
        .text()
        .substring(3)
        .trim();
      var url =
        'https://www.capitolhillbaptist.org' +
        $(this)
          .find('h3 a')
          .attr('href');
      if (scripture) {
        sermons.push({
          title: title,
          //  date: date,
          scripture: scripture,
          author: author,
          source: 'Capitol Hill Baptist Church',
          url: url
        });
      }
    });
  }

  return sermons;
}

main();
