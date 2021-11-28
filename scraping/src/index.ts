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

async function initProgramsArray(programs: puppeteer.ElementHandle<Element>[]) {
  for (const program of programs) {
    const url = await getValue(program, 'href')
    const naziv = await getValue(program)
    if (!url || !naziv) return console.error('missing url or name for the program')

    const studijskiProgram = new StudijskiProgram()
    studijskiProgram.url = url
    studijskiProgram.naziv = naziv

    studijskiProgrami.push(studijskiProgram)
  }
}

async function chooseProgram(program: StudijskiProgram) {
  await page.goto(program.url)
  await navigationPromise
}

async function chooseAllPrograms() {
  // osnovne akademske studije
  await page.waitForSelector('#affix-osnovne > .panel-body')
  const osnovneAkademskeStudije = await page.$$('#affix-osnovne > .panel-body > a')
  await initProgramsArray(osnovneAkademskeStudije)

  for (const program of studijskiProgrami) {
    await chooseProgram(program)
  }
  await navigationPromise
}

(async () => {
  await init()
  await chooseAllPrograms()
  await terminate()
})();