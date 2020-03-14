const CronJob = require('cron').CronJob;

const data = require('./data');
const { pageURL } = data;
const scrape = require('./scrape');
const results = require('./results');


const task = new CronJob('00-30 12-21 * * *', function() {
   console.log('running schedule');

 scrape(pageURL)
.then(dataObj => {
    results(dataObj);
})
.catch(console.error);

 }, null, true, 'America/Los_Angeles');

task.start();

//console.log('scrape will run at next scheduled interval');