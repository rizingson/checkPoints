require('dotenv').config();
const email = {
        service: process.env.SERVICE,
        auth: {
                user: process.env.USERMAIL,
                pass: process.env.PASSWORDEMAIL
        },
        from: process.env.USERMAIL,
        to: process.env.TO,
        bcc: process.env.BCC,
        subject: 'There are New Sobriety Checkpoints',
        text: 'check if any are in your area:'
};

const pageURL = <https://url-of-webPage-to-be-scraped>;

const mongoURI = process.env.MONGOURI;

module.exports = {
        email,
        pageURL,
        mongoURI
};

