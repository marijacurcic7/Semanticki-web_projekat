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
  // browser = await puppeteer.launch({ headless: false, slowMo: 50 }) // za testiranje
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



async function setCourseData(course: Predmet) {
  // TODO: popuniti sve za predmet
  await page.waitForSelector('.col-xs-12 > .table-fixer > tbody > tr')
  const kategorija = await page.$('.col-xs-12 > .table-fixer > tbody > tr:nth-child(1)')
  const naucnaOblast = await page.$('.col-xs-12 > .table-fixer > tbody > tr:nth-child(2)')
  const espb = await page.$('.col-xs-12 > .table-fixer > tbody > tr:nth-child(4)')
  if (!kategorija || !naucnaOblast || !espb) throw new Error('missing kategorija or naucnaOblast or espb')
  course.kategorija = await getValue(kategorija)
  course.naucnaOblast = await getValue(naucnaOblast)
  course.espb = parseInt(await getValue(espb))

  await page.waitForSelector('#ppTabs .tab-content > .tab-pane')
  const tabs = await page.$$('#ppTabs .tab-content > .tab-pane')
  course.osnovneInformacije = await getValue(tabs[0])
  course.cilj = await getValue(tabs[1])
  course.ishod = await getValue(tabs[2])
  course.sadrzaj = await getValue(tabs[3])
  course.metodologijaIzvodjenjaNastave = await getValue(tabs[4])

  // literatura
  const knjigaElems = await tabs[5].$$('tbody > tr')
  for (const knjigaElem of knjigaElems) {
    const autoriElem = await knjigaElem.$('td:nth-child(1)')
    if (!autoriElem) throw new Error('autori knjige not found')
    const autori = await getValue(autoriElem)

    const nazivElem = await knjigaElem.$('td:nth-child(2)')
    if (!nazivElem) throw new Error('naziv knjige not found.')
    const naziv = await getValue(nazivElem)

    const godinaElem = await knjigaElem.$('td:nth-child(3)')
    if (!godinaElem) throw new Error('godina knjige not found.')
    const godina = parseInt(await getValue(godinaElem))

    const izdavacElem = await knjigaElem.$('td:nth-child(4)')
    if (!izdavacElem) throw new Error('izdavac knjige not found.')
    const izdavac = await getValue(izdavacElem)

    const jezikElem = await knjigaElem.$('td:nth-child(5)')
    if (!jezikElem) throw new Error('jezik knjige not found.')
    const jezik = await getValue(jezikElem)

    course.literatura.push({ autori, naziv, godina, izdavac, jezik })
  }

  // formiranje ocene
  const formiranjeOceneElements = await tabs[6].$$('tbody > tr')
  for (const formiranjeOceneElem of formiranjeOceneElements) {
    const predmetnaAktivnostElem = await formiranjeOceneElem.$('td:nth-child(1)')
    if (!predmetnaAktivnostElem) throw new Error('predmetna aktivnost not found.')
    const predmetnaAktivnost = await getValue(predmetnaAktivnostElem)

    const predispitnaElem = await formiranjeOceneElem.$('td:nth-child(2)')
    if (!predispitnaElem) throw new Error('predispitna not found.')
    const predispitna = await getValue(predispitnaElem) === 'da'

    const obaveznaElem = await formiranjeOceneElem.$('td:nth-child(3)')
    if (!obaveznaElem) throw new Error('obavezna not found.')
    const obavezna = await getValue(obaveznaElem) === 'da'

    const brojPoenaElem = await formiranjeOceneElem.$('td:nth-child(4)')
    if (!brojPoenaElem) throw new Error('brojPoena not found.')
    const brojPoena = parseInt(await getValue(brojPoenaElem))

    course.formiranjeOcene.push({ predmetnaAktivnost, predispitna, obavezna, brojPoena })
  }

  // izvodjaci nastave
  const izvodjaciNastaveElements = await tabs[7].$$('tbody > tr')
  for (const izvodjacElem of izvodjaciNastaveElements) {
    const punoImeElem = await izvodjacElem.$('td:nth-child(2) > h4 > a')
    if (!punoImeElem) throw new Error('punoIme not found.')
    const punoIme = (await getValue(punoImeElem, 'innerText')).replace(/\s\s+/g, ' ').trim()

    const zvanjeElem = await izvodjacElem.$('td:nth-child(2) > h4 > small')
    if (!zvanjeElem) throw new Error('zvanje not found.')
    const zvanje = await getValue(zvanjeElem)

    const vidNastaveElem = await izvodjacElem.$('td:nth-child(3)')
    if (!vidNastaveElem) throw new Error('vidNastave not found.')
    const vidNastave = await getValue(vidNastaveElem)

    course.izvodjaciNastave.push({punoIme, zvanje, vidNastave})
  }
}



async function test(program: puppeteer.ElementHandle<Element>) {
  const url = await getValue(program, 'href')
  const naziv = await getValue(program)
  if (!url || !naziv) return console.error('missing url or name for the program')

  const studijskiProgram = new StudijskiProgram(naziv, url)
  await setProgramData(studijskiProgram)
  // await getAllCourses(studijskiProgram)
  // console.log(studijskiProgram.predmeti)
  const tempUrl = 'http://www.ftn.uns.ac.rs/n1095546779/osnove-programiranja'
  await page.goto(tempUrl)
  await navigationPromise
  await setCourseData(new Predmet(1, 'zimski', 'Osnove programiranja', tempUrl))

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