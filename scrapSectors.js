const puppeteer = require('puppeteer');
const IndustryListUrl = "https://www.dsebd.org/by_industrylisting.php";

scrapIndustry(IndustryListUrl);

async function scrapIndustry(url) {
    console.log("industry");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const IndustriesData = await page.evaluate(() => {
        let industries = [];
        let anchors = document.getElementsByClassName('ab1');
        for (const key in anchors) {
            if (Object.hasOwnProperty.call(anchors, key)) {
                if (key % 2 == 0) {
                    const a_name = anchors[key].textContent;
                    const a_href = anchors[key].getAttribute("href");
                    if (!a_href.startsWith("http") && !a_href.startsWith("mailto")) {
                        industries.push({
                            'title': a_name,
                            'link': a_href,
                        });
                    }

                }
            }
        }
        return industries;
    });
    browser.close();
    // console.log(IndustriesData);
    // Save Data into :- industriesByCat.txt file
    saveDataTxt(IndustriesData, "datas/industriesByCat.txt");
}

// Save Data into text file
function saveDataTxt(companyDetails, fileName) {
    var fs = require('fs');
    fs.writeFile(fileName, JSON.stringify(companyDetails, null, 2), function (err) {
        if (err) {
            console.log(err);
        }
    });
    console.log("Succesfully Saved into " + fileName);
}

// Get Data from any text file
function getData(fileName, _callback) {
    const fs = require('fs');
    let jsonData;
    fs.readFile(fileName, 'utf8', function (err, data) {
        if (err) throw err;
        jsonData = JSON.parse(data);
        // console.log(jsonData);
        _callback(jsonData);
    });
}