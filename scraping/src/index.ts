import * as puppeteer from 'puppeteer' // launch works only with this?
import { Predmet } from './models/predmet.model';
import { StudijskiProgram } from './models/studijskiProgram.model';

let browser: puppeteer.Browser;
let page: puppeteer.Page;
let navigationPromise: Promise<puppeteer.HTTPResponse | null>;
const mainUrl = 'http://www.ftn.uns.ac.rs/1802705466/studijski-programi--akreditacija-2020'
let studijskiProgrami: StudijskiProgram[] = []

async function init() {
  browser = await puppeteer.launch()
  browser = await puppeteer.launch({ headless: false, slowMo: 30 }) // za testiranje
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
async function getValue(elem: puppeteer.ElementHandle<Element>, property: string = 'innerText') {
  const retValue = await (await elem.getProperty(property))?.jsonValue() as string | undefined
  if (!retValue) throw new Error(`property ${property} does not exist.`)
  else return retValue
}

async function initProgramsArray(programs: puppeteer.ElementHandle<Element>[]) {
  for (const program of programs) {
    const url = await getValue(program, 'href')
    const naziv = await getValue(program)
    const studijskiProgram = new StudijskiProgram(naziv, url)
    studijskiProgrami.push(studijskiProgram)
  }
}

async function setProgramData(program: StudijskiProgram) {
  await page.goto(program.url)
  await navigationPromise
  await page.waitForSelector('#affix-info h4')
  const programInfos = await page.$$('#affix-info h4')

  // set fields on studijski program
  const nivoStudija = await programInfos[0].$('a')
  if (!nivoStudija) return console.error(`nivo studija not found for ${program.naziv}.`)
  program.nivoStudija = await getValue(nivoStudija)

  let zvanje = await programInfos[1].$('a')
  if (!zvanje) return console.error(`zvanje not found for ${program.naziv}.`)
  program.zvanje = await getValue(zvanje)

  const obrazovnoPolje = programInfos[2]
  if (!obrazovnoPolje) return console.error(`obrazovnoPolje not found for ${program.naziv}.`)
  program.obrazovnoPolje = (await getValue(obrazovnoPolje)).split('\n')[1]

  const naucnoStrucneOblasti = (await getValue(programInfos[3])).split('\n')[1]
  if (!naucnoStrucneOblasti) return console.error(`naucnoStrucneOblasti not found for ${program.naziv}.`)
  program.naucnoStrucneOblasti = naucnoStrucneOblasti

  const brojSemestara = parseInt((await getValue(programInfos[4])).split('\n')[1].split('\/')[1])
  if (!brojSemestara) return console.error(`brojSemestara not found for ${program.naziv}.`)
  program.brojSemestara = brojSemestara

  const espb = parseInt((await getValue(programInfos[5])).split('\n')[1])
  if (!espb) return console.error(`espb not found for ${program.naziv}.`)
  program.espb = espb
}

async function setCourseData(course: Predmet) {
  // TODO: popuniti sve za predmet
}

async function getGodinaAndSemestar(row: puppeteer.ElementHandle<Element>) {
  let godina: number | undefined;
  let semestar: 'zimski' | 'letnji' | undefined;
  const matches = (await getValue(row)).match(/Godina:.(\d), Semestar:.(.*)/)

  if (matches) {
    const [_, g, s] = matches
    godina = parseInt(g)
    if (s.toLowerCase() === 'zimski') semestar = 'zimski'
    else if (s.toLowerCase() === 'letnji') semestar = 'letnji'
    else throw new Error('semestar is not zimski nor letnji.')
    return { godina, semestar }
  }
  else {
    throw new Error('problem getting godina & semestar')
  }
}

async function getIzborniPredmeti(izborni: Predmet, godina: number | undefined, semestar: 'zimski' | 'letnji' | undefined) {
  // open modal dialog
  await page.waitForSelector(`#${izborni.id}`);
  await page.click(`#${izborni.id}`)

  await page.waitForSelector('#modalDialog  tbody')
  const izborniRows = await page.$$('#modalDialog tbody > tr > td:nth-child(1) > a')

  const izborniPredmeti: Predmet[] = []
  for (const izborniRow of izborniRows) {
    const naziv = await getValue(izborniRow)
    const url = await getValue(izborniRow, 'href')
    if (!godina || !semestar || !naziv || !url) throw new Error('missing fields.')
    izborniPredmeti.push(new Predmet(godina, semestar, naziv, url))
  }
  return izborniPredmeti
}
async function getAllIzborniPredmeti(izborniPredmeti: Predmet[]) {
  const newIzborniPredmeti: Predmet[] = []
  for (const izborni of izborniPredmeti) {
    await page.reload()
    await navigationPromise
    const ret = await getIzborniPredmeti(izborni, izborni.godina, izborni.semestar)
    newIzborniPredmeti.push(...ret)
  }
  return newIzborniPredmeti
}

async function getAllCourses(program: StudijskiProgram) {
  await page.goto(program.url)
  await navigationPromise
  await page.waitForSelector('#planTable > tbody > tr > td:nth-child(1)')
  const rows = await page.$$('#planTable > tbody > tr > td:nth-child(1)')

  let godina: number | undefined;
  let semestar: 'zimski' | 'letnji' | undefined;

  const _izborniPredmeti: Predmet[] = []

  for (const row of rows) {
    // check if a row is godina+semestar
    if ((await getValue(row)).match(/Godina:.(\d), Semestar:.(.*)/)) {
      const ret = await getGodinaAndSemestar(row)
      godina = ret.godina
      semestar = ret.semestar
    }
    // otherwise a row is a course
    else {
      // check if row iz 'izborna pozicija or izborni jezik'
      if ((await getValue(row)).toLowerCase().match(/izborn/)) {
        const izborniElem = await row.$('a')
        if (!izborniElem) throw new Error('izborni element not found')
        const izborniElemId = await getValue(izborniElem, 'id')
        if (!godina || !semestar) return console.error('missing fields.')
        const predmet = new Predmet(godina, semestar)
        predmet.id = izborniElemId
        _izborniPredmeti.push(predmet)
      }
      // if row is actually a course
      else {
        const courseElem = await row.$('a')
        if (!courseElem) return console.error('course element not found.')

        const naziv = await getValue(courseElem)
        const url = await getValue(courseElem, 'href')

        if (!godina || !semestar || !naziv || !url) return console.error('missing fields.')
        const predmet = new Predmet(godina, semestar, naziv, url)
        program.predmeti.push(predmet)
      }
    }
  }

  // dodaj izborne predmete u program
  const izborniPredmeti = await getAllIzborniPredmeti(_izborniPredmeti)
  program.predmeti = [...program.predmeti, ...izborniPredmeti]
}



async function test(program: puppeteer.ElementHandle<Element>) {
  const url = await getValue(program, 'href')
  const naziv = await getValue(program)
  if (!url || !naziv) return console.error('missing url or name for the program')

  const studijskiProgram = new StudijskiProgram(naziv, url)
  // await setProgramData(studijskiProgram)
  await getAllCourses(studijskiProgram)
  console.log(studijskiProgram.predmeti)
}

async function getAllPrograms() {
  // osnovne akademske studije
  await page.waitForSelector('#affix-osnovne > .panel-body')
  const osnovneAkademskeStudije = await page.$$('#affix-osnovne > .panel-body > a')
  await test(osnovneAkademskeStudije[24])
  // await initProgramsArray(osnovneAkademskeStudije)

  // for (const program of studijskiProgrami) {
  //   await setProgramData(program)
  // }
  await navigationPromise
}

(async () => {
  await init()
  await getAllPrograms()
  await terminate()
})();