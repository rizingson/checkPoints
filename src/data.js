require('dotenv').config();

const email = {
    service: process.env.SERVICE,
    auth: {
        user: process.env.USERMAIL,
        pass: process.env.PASSWORDEMAIL
    },
    from: process.env.USERMAIL,
    to: process.env.TO,
    subject: 'There are new Sobriety Checkpoints',
    text: 'check if they are in your area:'
};

const pageURL = 'http://www.duiblock.com/dui_checkpoint_locations/california/';

const mongoURI = process.env.MONGOURI;

module.exports = {
    email,
    pageURL,
    mongoURI
};