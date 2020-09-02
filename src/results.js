const data = require("./data");
const notification = require("./email");

const { mongoURI,email } = data;

const mongoose = require("mongoose"); //import mongodb dependency

//we have data, this is what we are gonna do with it
const results = dataObj => {
    try {

mongoose
.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }) //connect to db
.then(() => console.log("MongoDB Connected"))                           
.catch(err => console.log(err));

        const Checkpoints = require('./models/Checkpoints'); //reference data model format

        Checkpoints.find({}, function(err, checkPoints) {    //find document in db
            return checkPoints;
        })
        //if db is empty, save the newly scraped data in it
        .then(checkPoints => {
            if (checkPoints == '') {
                console.log(`New data was created:\n${JSON.stringify(dataObj, null, 2)}`);
                const newCheckpoints = new Checkpoints(dataObj);
                return newCheckpoints.save().catch(err => console.log(err));
            }

            //these variables will be used for function to compare dataObj with relative properties in db
            const dbId =  checkPoints[0]._id;
            const dbAmount = checkPoints[0].amount;
            const dbCheckPoint = checkPoints[0].postedStops;
            const stops = dataObj.postedStops;

            let newAlert = false;   //new alert is the condition that will determine what happens

            //if the amount of new data isnt the same as the amount stored in db, new alert is true
            if(dbAmount !== dataObj.amount) {
                console.log('amount doesnt match: ' + dbAmount + 'and ' + dataObj.amount)
                newAlert = true;
            } else {
                const compareStops = JSON.stringify(stops, null, 2);
                //also, in case amounts are equal, check if the first entry is from the same city

                    if (dbCheckPoint[0].city !== stops[0].city) {
                        console.log('doesnt match: ' + dbCheckPoint + ' and ' + compareStops);
                        newAlert = true;
                    }

            }

            //if we have new data, update the database, and notify user by email
            if (newAlert === true) {

                const userStops = JSON.stringify(stops, null, 2);
                console.log('There are new alerts. updating database...');
                notification(email, userStops);
                mongoose.set('useFindAndModify', false);
                return Checkpoints.findOneAndUpdate({ _id: dbId }, dataObj);
            } else {
                //if there is no new data do nothing and log it
            console.log('No new alerts');
            }
                })
            .then(() => {
            mongoose.disconnect();  //then disconnect from db
        })
        .catch(err => console.log(err));
    } catch (err) {
        console.error(err);
    }
};

module.exports = results;
