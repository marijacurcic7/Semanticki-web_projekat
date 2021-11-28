import * as puppeteer from 'puppeteer' // launch works only with this?

let browser: puppeteer.Browser;
let page: puppeteer.Page;
let navigationPromise: Promise<puppeteer.HTTPResponse | null>;

async function init() {
  browser = await puppeteer.launch({ headless: false, slowMo: 30 });
  page = await browser.newPage();
  navigationPromise = page.waitForNavigation();
  await page.goto('https://github.com');
}


async function terminate() { await browser.close()}

(async () => {
  await init()
  await terminate()
})();