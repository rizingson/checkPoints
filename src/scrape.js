
const puppeteer = require('puppeteer-core');

//class to construct checkpoints
function checkPoint(county, city, location, date) {
    this.county = county,
    this.city = city,
    this.location = location,
    this.date = date
};

let i = 2;     //targeted data's table element xpath starts at 2

//scrape function
async function scrape(url) {

  let trackIndex = [];

  let checkPoints = []; //hold all the scraped checkpoints
    
    //puppeteer dependency launching browser to scrape target url

    const browser = await puppeteer.launch({
      executablePath: '/usr/bin/chromium-browser',
      headless: true,
      args: ["--no-sandbox"]
    });
    const page = await browser.newPage();
    let dataObj = {}; //holder for data to be posted to db

    try {
    await page.goto(url);

      /*all the target elements from the web page have the same path except for
      a digit towards the end, starting with number 2*/
        for (i = 2; i < 13; i++) {

          //all targeted elements are table rows
            const [el] = await page.$x('/html/body/div[3]/table/tbody/tr[3]/td/table/tbody/tr[1]/td[1]/table/tbody/tr[2]/td[2]/div/center/table/tbody/tr[2]/td/table[2]/tbody/tr[' + i + ']/td[1]/font/a/font/b');
            const txt = await el.getProperty('textContent');
            const county = await txt.jsonValue();

            const [el2] = await page.$x('/html/body/div[3]/table/tbody/tr[3]/td/table/tbody/tr[1]/td[1]/table/tbody/tr[2]/td[2]/div/center/table/tbody/tr[2]/td/table[2]/tbody/tr[' + i + ']/td[2]/font/b');
            const txt2 = await el2.getProperty('textContent');
            const city = await txt2.jsonValue();

            const [el3] = await page.$x('/html/body/div[3]/table/tbody/tr[3]/td/table/tbody/tr[1]/td[1]/table/tbody/tr[2]/td[2]/div/center/table/tbody/tr[2]/td/table[2]/tbody/tr[' + i + ']/td[3]/a/font');
            const txt3 = await el3.getProperty('textContent');
            const location = await txt3.jsonValue();

            const [el4] = await page.$x('/html/body/div[3]/table/tbody/tr[3]/td/table/tbody/tr[1]/td[1]/table/tbody/tr[2]/td[2]/div/center/table/tbody/tr[2]/td/table[2]/tbody/tr[' + i + ']/td[4]/font');
            const txt4 = await el4.getProperty('textContent');
            const date = await txt4.jsonValue();

            //construct a new object containing data scraped from this iteration
            let alert = new checkPoint(county, city, location, date);

            //add object to the array
            checkPoints.push(alert);
          };

          const stan = 'Stanislaus';
          const mer = 'Merced';
          const fre = 'Fresno';
          const sj = 'San Joaquin';
          const sc = 'Santa Clara';
          const la = 'Los Angeles';
          const sb = 'San Bernardino';

checkPoints.forEach((checkpoint, i) => {
    if (checkpoint.county === stan) {
     trackIndex[i] = checkpoint;
    } else if (checkpoint.county === mer) {
      trackIndex[i] = checkpoint;
     } else if (checkpoint.county === fre) {
      trackIndex[i] = checkpoint;
     } else if (checkpoint.county === sj) {
      trackIndex[i] = checkpoint;
     } else if (checkpoint.county === sc) {
      trackIndex[i] = checkpoint;
     } else if (checkpoint.county === la) {
      trackIndex[i] = checkpoint;
     } else if (checkpoint.county === sb) {
      trackIndex[i] = checkpoint;
     };
});

          const myCounties = trackIndex.filter(Boolean);     //filter out empty slots in array 

          console.log(myCounties); // log relevant counties with new checkpoints into myCounties

    //put them in a data object modeled to push into db
    dataObj = {
        amount: myCounties.length,
        postedStops: myCounties
      };
    } catch (e) {
      console.log(e);
    }

    browser.close();
    return dataObj;
  };

module.exports = scrape;
