import * as puppeteer from 'puppeteer' // launch works only with this?
import { StudijskiProgram } from './models/studijskiProgram.model';

let browser: puppeteer.Browser;
let page: puppeteer.Page;
let navigationPromise: Promise<puppeteer.HTTPResponse | null>;
const mainUrl = 'http://www.ftn.uns.ac.rs/1802705466/studijski-programi--akreditacija-2020'
let studijskiProgrami: StudijskiProgram[] = []

async function init() {
  // browser = await puppeteer.launch({ headless: false, slowMo: 30 }) // za testiranje
  browser = await puppeteer.launch()
  page = await browser.newPage()
  navigationPromise = page.waitForNavigation()
  await page.setViewport({ width: 1280, height: 1275 })
  await page.goto(mainUrl)
  await navigationPromise
}
async function terminate() { await browser.close() }

/**
 * @param elem Object for which property is returned
 * @param property default is innerHTML
 * @returns Returns the property value of a specified html element. Default property value is innerHTML
 */
async function getValue(elem: puppeteer.ElementHandle<Element>, property: string = 'innerHTML') {
  return await (await elem.getProperty(property))?.jsonValue() as string | undefined
}

async function chooseProgram(program: puppeteer.ElementHandle<Element>) {
  const programUrl = await getValue(program, 'href')
  const programName = await getValue(program)
  if (!programUrl) return console.error('program url not found.')
  console.log(programName)
  await page.goto(programUrl)
  await navigationPromise
}

async function chooseAllProgrammes() {
  // osnovne akademske studije
  await page.waitForSelector('#affix-osnovne > .panel-body')
  const osnovneAkademskeStudije = await page.$$('#affix-osnovne > .panel-body > a')
  for(const program of osnovneAkademskeStudije) {
    console.log(await getValue(program))
  }
  await navigationPromise
}

(async () => {
  await init()
  await chooseAllProgrammes()
  await terminate()
})();