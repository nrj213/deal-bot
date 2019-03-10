const cheerio = require('cheerio');

let processHTML = (html) => {
    let $ = cheerio.load(html);

    let $container = $('._3O0U0u');
    let type = ($container.first().children().length == 1) ? 'single' : 'multiple';

    console.log(type);

    let _name = '';
    let _price = '';
    let _rating = '';
    let _availability = '';
    let _link = '';

    switch(type) {
        case 'single': {
            _name = '._3wU53n';
            _price = '._2rQ-NK';
            _rating = '.hGSR34';
            _availability = '._3aV9Tq';
            _link = '._31qSD5';
        } break;
        case 'multiple': {
            _name = '._2cLu-l';
            _price = '._1vC4OE';
            _rating = '.hGSR34';
            _availability = '._3aV9Tq';
            _link = '._2cLu-l';
        }
    }

    let $searchResults = $container.children();
    let searchResults = [];

    $searchResults.each(function (i, elem) {
        let resultItem = this;
        searchResults.push({
            name: $(resultItem).find(_name).text().trim(),
            price: $(resultItem).find(_price).text().trim(),
            rating: $(resultItem).find(_rating).text().trim(),
            availability: $(resultItem).find(_availability).text().trim(),
            link: 'https://www.flipkart.com' + $(resultItem).find(_link).attr('href').trim()
        });
    });
    return searchResults;
}

module.exports = { processHTML };