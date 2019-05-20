//@ts-check
const request = require('request-promise-native');
const cheerio = require('cheerio');

module.exports = async function (context, source) {
  let sermons = [];
  context.log(`Scraping sermons for ${source}`);
  for (let index = 1; index <= 15; index++) {
    console.log(`Sermon index ${index}`);
    var options = {
      uri: `https://www.universityreformedchurch.org/teaching/sermons/?fwp_paged=${index}&fwp_per_page=100`,
      transform: function (body) {
        return cheerio.load(body);
      }
    };

    var $ = await request(options);

    $('div.sermon').each(function (index) {
      var title = $(this)
        .find('div h3')
        .text()
        .trim();
      var date = $(this)
        .find('div.sermon-archive-date')
        .text()
        .trim();
      var author = $(this)
        .find('span.speaker')
        .text()
        .trim();
      var url = $(this)
        .find('div h3 a')
        .attr('href');
      sermons.push({
        title: title,
        date: date,
        author: author,
        source: 'University Reformed Church',
        url: url
      });
    });
  }

  let sermonsWithScripture = [];

  for (let sermon of sermons) {
    var options = {
      uri: sermon.url,
      transform: function (body) {
        return cheerio.load(body);
      }
    };

    var $ = await request(options);


    sermon.scripture = $('h3.sermon-subheading').text().split('/')[2];
    if (sermon.scripture) {
      sermon.scripture = sermon.scripture.trim();
      sermonsWithScripture.push(sermon);
    }
  }

  return sermonsWithScripture;
}
