const nodemailer = require('nodemailer');

const notification = (emailData, postedStops) => {
    const transporter = nodemailer.createTransport({
        service: process.env.SERVICE,
        auth: {
            user: process.env.USERMAIL,
            pass: process.env.PASSWORDEMAIL
        },
    });

    const mailOptions = {
        from: emailData.from,
        to: emailData.to,
        bcc: emailData.bcc,
        subject: emailData.subject,
        text: `${emailData.text}:\n${postedStops}`
      };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
        else {
            console.log('Email sent: ' + info.response);
        }
    });
};

module.exports = notification;