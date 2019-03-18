const nodemailer = require('nodemailer');

let sendEmail = (item) => {
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

module.exports = {
    sendEmail
};