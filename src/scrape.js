const puppeteer = require('puppeteer');

//class to construct checkpoints
function checkPoint(county, city, location, date) {
    this.county = county,
    this.city = city,
    this.location = location,
    this.date = date
};
let checkPoints = []; //hold all the scraped checkpoints
let i = 2; 

//scrape function
async function scrape(url) {
    
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"]
    });
    const page = await browser.newPage();
    let dataObj = {}; //holder for data to be posted to db

    try {
    await page.goto(url);

      /*all the target elements from the web page have the same xpath except for 
      a digit towards the end, starting with number 2*/
        for (i = 2; i < 13; i++) {
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
            
            //create a new object containing data scraped from this iteration
            let alert = new checkPoint(county, city, location, date); 
          
            //add object to the array
            checkPoints.push(alert);  
          };
           
          const stan = checkPoints.filter(checkpoint => checkpoint.county === 'Stanislaus');
          const mer = checkPoints.filter(checkpoint => checkpoint.county === 'Merced');
          const fre = checkPoints.filter(checkpoint => checkpoint.county === 'Fresno');
          const sj = checkPoints.filter(checkpoint => checkpoint.county === 'San Joaquin');
          const sc = checkPoints.filter(checkpoint => checkpoint.county === 'Santa Clara');
          const la = checkPoints.filter(checkpoint => checkpoint.county === 'Los Angeles');
          const sb = checkPoints.filter(checkpoint => checkpoint.county === 'San Bernardino');

          const filteredCheckPoints = stan.concat(mer, fre, sj, sc, la, sb);
          const myCounties = filteredCheckPoints.filter(Boolean);

          console.log(myCounties);

            const postedStops = JSON.stringify(myCounties, null, 2);       
                      
    dataObj = {
        amount: myCounties.length,
        postedStops
      };
    } catch (e) {
      console.log(e);
    }
  
    browser.close();
    return dataObj;
  };

module.exports = scrape;