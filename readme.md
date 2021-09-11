
1. Clone the git
2. cd ./DSE-Tools
3. npm i (or "npm install")

if you get any error like below: 

Error Solution: 
error:
(Could not find expected browser (chrome) locally. Run `npm install` to download the correct Chromium revision (901912).
    at ChromeLauncher.launch (F:\desktop\Nirjhor\DSE\dev tools\delete\DSE-Tools\node_modules\puppeteer\lib\cjs\puppeteer\node\Launcher.js:88:27)    
    at async scrapProduct (F:\desktop\Nirjhor\DSE\dev tools\delete\DSE-Tools\scrapDividends.js:33:21))

Solution is:
    
cd ./node_modules/puppeteer
npm run install