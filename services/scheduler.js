const schedule = require('node-schedule');

const itemModel = require('../models/item');
const flipkartService = require('./flipkart-service');

var rule = new schedule.RecurrenceRule();
rule.second = 5;

var job = schedule.scheduleJob(rule, () => {
    itemModel.allItems().then((docs) => {
        docs.forEach(doc => {
            flipkartService.processItemPage(doc.link).then((price) => {
                itemModel.logPrice(doc._id, price).then((doc) => {
                    console.log('Price logged: ' + doc.name + '-' + price);
                }).catch((err) => {
                    console.log(err);
                });
            });
        });
    });
}); 

