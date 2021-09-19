const puppeteer = require('puppeteer');
const URL = "https://www.dsebd.org/displayCompany.php?name=";
scrapDividends(20);

function scrapDividends(sectorIndex) {
    let companies = [];
    getData("datas/companies.txt", (jsonData) => {
        console.log(`__________-------------Sector Selected for scraping "${jsonData[sectorIndex - 1].sector.title}"`);
        jsonData[sectorIndex - 1].companies.forEach(company => {
            companies.push(company.company_name);
        });
        // console.log(jsonData[0].companies[0].company_name);
        // console.log(companies);
        setTimeout(() => {
            console.log(companies);
        }, 1000);

        let companyInfo = [];
        companies.forEach((companyName, index) => {
            let urlWithCompanyName = URL + companyName;
            // console.log(`${urlWithCompanyName} index: ${index} `);
            console.log(`Scrapping Dividends from "${companyName}" Start .........`);

            scrapProduct(urlWithCompanyName, companyName).then((companyDetails) => {
                console.log(JSON.stringify(companyDetails, null, 2));
                companyInfo.push(companyDetails);
                // Save Data into Text File as JSON
                saveDataTxt(companyInfo, "datas/companyDividends.txt");
                console.log("done");
            });


        });


    });
}


async function scrapProduct(url, companyName) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const dividendsResult = await page.evaluate(() => {
        let tables = document.getElementsByClassName('BodyHead topBodyHead');
        let dividendTable = tables[8].nextElementSibling;
        let dividendRows = dividendTable.getElementsByClassName('shrink');
        let dividends = [];

        for (let i = 0; i < dividendRows.length; i++) {
            let dividendColumns = dividendRows[i].getElementsByTagName('td');
            dividends.push({
                'year': dividendColumns[0].textContent.trim(),
                'dividend_in_percent': dividendColumns[7].textContent.trim(),
                'dividend_yield_in_percent': dividendColumns[8].textContent.trim(),
            });
        }
        return dividends;
    });
    browser.close();
    console.log(`\n==================================================== "${companyName}" Completed :)`);
    return {
        "company": companyName,
        "dividends": dividendsResult
    };



}


function saveDataTxt(companyDetails, fileName) {
    var fs = require('fs');
    fs.writeFile(fileName, JSON.stringify(companyDetails, null, 2), function (err) {
        if (err) {
            console.log(err);
        }
    });
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