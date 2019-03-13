const db = require('monk')(process.env.MONGODB_URL);

let trackedItems = db.get('TrackedItems');

let extractNumericPrice = (price) => {
    //Removing unit
    price = price.substring(1, price.length);
    return parseInt(price.replace(/,/g, ''));
};

let allItems = () => {
    return new Promise((resolve, reject) => {
        trackedItems.find({}, (err, docs) => {
            if (docs) {
                resolve(docs);
            } else {
                reject(err);
            }
        });
    });
};

let saveItem = (item) => {
    item.lowestPrice = extractNumericPrice(item.price);
    item.lowestPriceDate = new Date();
    item.priceLog = [];

    return new Promise((resolve, reject) => {
        allItems().then((docs) => {
            if (!docs.filter(doc => doc.name == item.name).length) {
                trackedItems.insert(item, {}, (err, doc) => {
                    if (doc) {
                        resolve(doc);
                    } else {
                        reject(err);
                    }
                });
            } else {
                resolve({});
            }
        }).catch((err) => {
            reject(err);
        });
    });
};

let logPrice = (id, price) => {
    price = extractNumericPrice(price);
    
    return new Promise((resolve, reject) => {
        trackedItems.findOneAndUpdate({ _id: id }, {
            $push: {
                priceLog: {
                    price: price,
                    date: new Date()
                }
            }
        }, (err, doc) => {
            if (doc) {
                resolve(doc);
            } else {
                reject(err);
            }
        });
    });
};

let deleteItem = (id) => {
    return new Promise((resolve, reject) => {
        trackedItems.findOneAndDelete({ _id: id }, {}, (err, doc) => {
            if (doc) {
                resolve(doc);
            } else {
                reject(err);
            }
        });
    });
};

module.exports = {
    allItems,
    saveItem,
    logPrice,
    deleteItem
};