"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = require("puppeteer");
// let browser: Browser;
// let page: Page;
// let navigationPromise: Promise<HTTPResponse | null>;
// const websiteUrl = 'http://www.ftn.uns.ac.rs/1802705466/studijski-programi--akreditacija-2020'
// async function init() {
//   const browser = await launch({headless: false});
//   const page = await browser.newPage();
//   await page.goto('https://github.com');
// }
// async function terminate() { await browser.close() }
// async function main() {
//   await init()
//   // await terminate()
// }
(async () => {
    const browser = await (0, puppeteer_1.launch)();
    const page = await browser.newPage();
    await page.goto('https://github.com');
    await page.screenshot({ path: 'example.png' });
    await browser.close();
})();
