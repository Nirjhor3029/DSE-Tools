const puppeteer = require('puppeteer');
const URL = "https://www.dsebd.org/displayCompany.php?name=";
const IndustryListUrl = "https://www.dsebd.org/by_industrylisting.php";
const hostUrl = "https://www.dsebd.org/";

async function scrapProduct(url, companyName) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    // await page.waitFor(1000);
    const dividendsResult = await page.evaluate(() => {
        // let tableNames = [];
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
        // let test = dividendRows[0].getElementsByTagName('td')
        // tableNames.push({
        //     'title': tables[8].textContent,
        //     'dividends': dividends,
        //     'dividends': test[0].textContent,
        // })
        return dividends;
    });
    // const [el] = await page.$x('//*[@id="imgBlkFront"]'); 
    // const src = await el.getProperty('textContent');
    // const srcTxt = await src.jsonValue();
    // console.log({ srcTxt });
    // console.log(JSON.stringify({ result }, null, 2));
    browser.close();
    return {
        "company": companyName,
        "dividends": dividendsResult
    };
}

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
    saveDataTxt(IndustriesData, "industriesByCat.txt");
}

var allCompanies = [];
async function scrapCompanies(cat) {
    let url = hostUrl + cat.link;
    console.log(url);
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
    saveDataTxt(allCompanies, "companies.txt");
}

async function scrapSectors(url) {
    console.log("company");
    let industriesByCat;
    getData("industriesByCat.txt", (jsonDatas) => {
        industriesByCat = jsonDatas;
        // console.log(industriesByCat);
        // scrapCompanies(industriesByCat[1]);

        // industriesByCat.forEach(cat => {
        //     setTimeout(() => {
        //         scrapCompanies(cat);
        //     }, 3000);

        // });

        let companyCounter = 0;
        let companyInterval = setInterval(() => {
            // console.log("hello");
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

function scrap() {

    scrapSectors();
    return;
    scrapIndustry(IndustryListUrl);
    return;
    const companies = [
        /* 
            List of Companies Selected Industry: Engineering 
        */
        "AFTABAUTO",
        "ANWARGALV ",
        "APOLOISPAT",
        "ATLASBANG",
        "AZIZPIPES",
        "BBS",
        "BBSCABLES",
        "BDAUTOCA",
        "BDLAMPS", "BDTHAI", "BENGALWTL", "BSRMLTD", "BSRMSTEEL", "COPPERTECH", "DESHBANDHU", "DOMINAGE", "ECABLES", "GOLDENSON", "GPHISPAT", "IFADAUTOS", "KAY&QUE", "KDSALTD", "MIRAKHTER",
        // "GP",
        // "SQURPHARMA",
        // "BXPHARMA"
    ];

    let companyInfo = [];
    companies.forEach((companyName, index) => {
        let urlWithCompanyName = URL + companyName;
        console.log(`${urlWithCompanyName} index: ${index} `);
        scrapProduct(urlWithCompanyName, companyName).then((companyDetails) => {
            console.log(JSON.stringify(companyDetails, null, 2));
            companyInfo.push(companyDetails);
            // Save Data into Text File as JSON
            saveDataTxt(companyInfo, "test.txt");
            console.log("done");
        });
    });
}

scrap();

function saveDataTxt(companyDetails, fileName) {
    var fs = require('fs');
    fs.writeFile(fileName, JSON.stringify(companyDetails, null, 2), function (err) {
        if (err) {
            console.log(err);
        }
    });
}


