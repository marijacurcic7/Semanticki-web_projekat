import * as puppeteer from 'puppeteer' // launch works only with this?
import { getAllCourses, setCourseData } from './course';
import { getAllPrograms } from './program';

let browser: puppeteer.Browser;
let page: puppeteer.Page;
let navigationPromise: Promise<puppeteer.HTTPResponse | null>;
const mainUrl = 'http://www.ftn.uns.ac.rs/1802705466/studijski-programi--akreditacija-2020'

async function init() {
  browser = await puppeteer.launch()
  // browser = await puppeteer.launch({ headless: false, slowMo: 30 }) // za testiranje
  page = await browser.newPage()
  navigationPromise = page.waitForNavigation()
  await page.setViewport({ width: 1280, height: 1275 })
  await page.goto(mainUrl)
  await navigationPromise
}
async function terminate() { await browser.close() }

async function run() {
  // get programs
  const studijskiProgrami = await getAllPrograms(page, navigationPromise)
  // get courses
  // for (const program of studijskiProgrami) {
  //   const courses = await getAllCourses(program, page, navigationPromise)
  //   program.predmeti = courses
  //   // set course data
  // }
  
  // samo softversko inzenjerstvo
  const courses = await getAllCourses(studijskiProgrami[24], page, navigationPromise)
  for (const course of courses) await setCourseData(course, page, navigationPromise)

}

(async () => {
  await init()
  await run()
  await terminate()
})();