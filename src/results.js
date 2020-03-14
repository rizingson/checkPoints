const notification = require("./email");
const data = require("./data");
const { email, mongoURI } = data;

const mongoose = require("mongoose");
mongoose
.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const results = dataObj => {
    try {
        const Checkpoints = require('./models/Checkpoints');

        Checkpoints.find({}, function(err, checkPoints) {
            return checkPoints;
        })
        .then(checkPoints => {
            if (checkPoints == '') {
                console.log(`New data was created:\n${JSON.stringify(dataObj, null, 2)}`);
                const newCheckpoints = new Checkpoints(dataObj);
                return newCheckpoints.save().catch(err => console.log(err));
            }

            const { amount, postedStops } = dataObj;

            const dbId =  checkPoints[0]._id;
            const dbAmount = checkPoints[0].amount;
            const dbCheckPoint = checkPoints[0].postedStops;
            
            let newAlert = false;

            if(dbAmount !== amount) {
                newAlert = true;
            } else {
                dbCheckPoint.forEach((checkPoint, i) => {
                    if (checkPoint.city !== postedStops[i].city) {
                        newAlert = true;                       
                    }
                });
            }
            
            if (newAlert === true) {
               
                console.log('There are new alerts. updating database...');
                notification(email, postedStops); 
                mongoose.set('useFindAndModify', false);
                return Checkpoints.findOneAndUpdate({ _id: dbId }, dataObj);
            }

            console.log('No new alerts');
        })
        .then(() => {
            mongoose.disconnect();
        })
        .catch(err => console.log(err));
    } catch (err) {
        console.error(err);
    }
};

module.exports = results;