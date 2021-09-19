const puppeteer = require('puppeteer');
const URL = "https://www.dsebd.org/displayCompany.php?name=";
const IndustryListUrl = "https://www.dsebd.org/by_industrylisting.php";
const hostUrl = "https://www.dsebd.org/";

var allCompanies = [];

scrapSectors();

// scrapSectors & scrapCompanies both are used for scraping companies
function scrapSectors() {
    console.log("company");
    let industriesByCat;
    getData("datas/industriesByCat.txt", (jsonDatas) => {
        industriesByCat = jsonDatas;
        let companyCounter = 0;
        let companyInterval = setInterval(() => {
            console.log(`Scrapping Companies from "${industriesByCat[companyCounter].title}" Start .........`);
            scrapCompanies(industriesByCat[companyCounter]);
            if (companyCounter >= (industriesByCat.length - 1)) {
                clearInterval(companyInterval);
            }
            companyCounter++;
        }, 2000);
    });


    return;

    // console.log(IndustriesData);
    // Save Data into :- industriesByCat.txt file
    saveDataTxt(IndustriesData, "industriesByCat.txt");
}

async function scrapCompanies(cat) {
    let url = hostUrl + cat.link;
    // console.log(url);
    // Scrap
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const companies_sectorWise = await page.evaluate(() => {
        let companiesBySector = [];
        let tables = document.getElementsByClassName('table table-borderless background-white');
        let anchors = tables[0].getElementsByClassName('ab1');
        for (const key in anchors) {
            if (Object.hasOwnProperty.call(anchors, key)) {
                const a_name = anchors[key].textContent;
                const a_href = anchors[key].getAttribute("href");
                companiesBySector.push({
                    'company_name': a_name,
                    'link': a_href,
                });
            }
        }
        return companiesBySector;
    });
    browser.close();

    allCompanies.push({
        'sector': cat,
        'companies': companies_sectorWise,
    });
    // Save Data into :- industriesByCat.txt file
    saveDataTxt(allCompanies, "datas/companies.txt");
    console.log(`\n==================================================== "${cat.title}" Completed .........`);
}



// Save Data into text file
function saveDataTxt(companyDetails, fileName) {
    var fs = require('fs');
    fs.writeFile(fileName, JSON.stringify(companyDetails, null, 2), function (err) {
        if (err) {
            console.log(err);
        }
    });
    // console.log("Succesfully Saved into " + fileName);
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