const rp = require('request-promise');
const express = require('express');
const flipkartServices = require('./services/flipkart-services');

var app = express();

app.get('/:query', (req, res) => {
    let searchUrl = 'https://www.flipkart.com/search?q=' + req.params.query;
    console.log(searchUrl);

    rp(searchUrl)
        .then(function (html) {
            res.send(flipkartServices.processHTML(html));
        })
        .catch(function (err) {
            res.send(err);
        });
});

app.listen('3000', () => {
    console.log('Server started!');
});
