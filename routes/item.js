const express = require('express');
const itemModel = require('../models/item');

const router = express.Router();

router.get('/', (req, res) => {
    itemModel.allItems().then((docs) => {
        res.send(docs);
    }).catch((err) => {
        res.send(err);
    });
});

router.post('/add', (req, res) => {
    itemModel.saveItem(req.body).then((doc) => {
        res.send(doc);
    }).catch((err) => {
        res.send(err);
    });
});

router.delete('/remove/:id', (req, res) => {
    itemModel.deleteItem(req.params.id).then((doc) => {
        res.send(doc);
    }).catch((err) => {
        res.send(err);
    });
});

module.exports = router;