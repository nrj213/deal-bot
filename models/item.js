const nodemailer = require('nodemailer');
const db = require('monk')(process.env.MONGODB_URL);

let trackedItems = db.get('TrackedItems');

let extractNumericPrice = (price) => {
    //Removing unit
    price = price.substring(1, price.length);
    return parseInt(price.replace(/,/g, ''));
};

let sendNotification = (item) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    var mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: 'nrj213@gmail.com',
        subject: 'Sending Email using Node.js',
        text: 'Price dropped for ' + item.name + '. Price has become ' + item.lowestPrice
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
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

let logPrice = (item, currentPrice) => {
    currentPrice = extractNumericPrice(currentPrice);

    if (currentPrice < item.lowestPrice) {
        item.lowestPrice = currentPrice;
        sendNotification(item);
    }

    return new Promise((resolve, reject) => {
        trackedItems.findOneAndUpdate({ _id: item._id }, {
            $push: {
                priceLog: {
                    price: currentPrice,
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