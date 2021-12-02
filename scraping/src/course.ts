import { ElementHandle, HTTPResponse, Page } from "puppeteer"
import { Predmet } from "./models/predmet.model"
import { StudijskiProgram } from "./models/studijskiProgram.model"

/**
 * Returns all courses (elective & compulsory) for a given program. Visit program page and find all courses.
 * @param program program object for which we find courses 
 * @param page 
 * @param navigationPromise 
 * @returns a list of all program courses
 */
async function getAllCourses(program: StudijskiProgram, page: Page, navigationPromise: Promise<HTTPResponse | null>) {
  await page.goto(program.url)
  await navigationPromise
  await page.waitForSelector('#planTable > tbody > tr > td:nth-child(1)')
  const rows = await page.$$('#planTable > tbody > tr > td:nth-child(1)')

  let electiveCourses: Predmet[] = []
  let compulsoryCourses: Predmet[] = []

  let godina: number | undefined;
  let semestar: 'zimski' | 'letnji' | undefined;

  // row can represent compulsory course, elective course or year+semester
  for (const row of rows) {
    // if a row is year+semester
    if ((await getValue(row)).match(/Godina:.(\d), Semestar:.(.*)/)) {
      const ret = await getGodinaAndSemestar(row,)
      godina = ret.godina
      semestar = ret.semestar
    }
    else {
      // if row iz 'izborna pozicija or izborni jezik'
      if ((await getValue(row)).toLowerCase().match(/izborn/)) {
        electiveCourses.push(await initElectiveCourse(row, godina, semestar))
      }
      // if row is a compulsory course
      else {
        compulsoryCourses.push(await getCompulsoryCourse(row, godina, semestar))
      }
    }
  }

  // dodaj izborne predmete
  electiveCourses = await getAllIzborniPredmeti(electiveCourses, page, navigationPromise)

  await navigationPromise
  return [...compulsoryCourses, ...electiveCourses]
}

/**
 * Just initialize elective course. Set properties godina, semestar & id, where id identifies html popup element.
 * We need id in order to open that modal window later, to get elective courses for the row.
 * @param row an element which represents elective course
 * @returns created course
 */
async function initElectiveCourse(row: ElementHandle<Element>, godina: number | undefined, semestar: 'zimski' | 'letnji' | undefined) {
  const izborniElem = await row.$('a')
  if (!izborniElem) throw new Error('izborni element not found')
  const izborniElemId = await getValue(izborniElem, 'id')
  if (!godina || !semestar) throw new Error('missing fields godina or semestar.')

  const predmet = new Predmet(godina, semestar)
  // based on id, we know how to open elective course with puppeteer.
  predmet.id = izborniElemId

  return predmet
}

/**
 * Create compulsory course for a given row. Sets properties: godina, semestar, naziv & url.
 * @param row an element which represents compulsory course
 * @returns created course
 */
async function getCompulsoryCourse(row: ElementHandle<Element>, godina: number | undefined, semestar: 'zimski' | 'letnji' | undefined) {
  const courseElem = await row.$('a')
  if (!courseElem) throw new Error('course element not found.')

  const naziv = await getValue(courseElem)
  const url = await getValue(courseElem, 'href')

  if (!godina || !semestar || !naziv || !url) throw new Error('missing fields.')
  const predmet = new Predmet(godina, semestar, naziv, url)
  return predmet
}

/**
 * @returns godina and semestar as an object
 */
async function getGodinaAndSemestar(row: ElementHandle<Element>) {
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

/**
 * Takes all rows with elective subjects. 
 * Opens modal dialog for each row and adds elective subjects to the list.
 * @param izborniPredmeti list of all elective rows for a given program
 * @returns a list of all elective subject 
 */
async function getAllIzborniPredmeti(izborniPredmeti: Predmet[], page: Page, navigationPromise: Promise<HTTPResponse | null>) {
  const newIzborniPredmeti: Predmet[] = []
  for (const izborni of izborniPredmeti) {
    await page.reload()
    await navigationPromise
    const ret = await getIzborniPredmetiForAGivenRow(izborni, izborni.godina, izborni.semestar, page, navigationPromise)
    newIzborniPredmeti.push(...ret)
  }
  return newIzborniPredmeti
}

/**
 * Each row when clicked, opens a modal dialog. 
 * Modal dialog contains elective subjects for a given row. 
 * Pass a course with ID property (id of a modal dialog).
 * Function goes through each row, opens modal dialogs 
 * and sets properties: naziv, url for each elective subject.
 * @param izborni elective subject with ID field. ID is ID of a modal dialg
 * @returns created list of elective subjects for a given row
 */
async function getIzborniPredmetiForAGivenRow(izborni: Predmet, godina: number | undefined, semestar: 'zimski' | 'letnji' | undefined, page: Page, navigationPromise: Promise<HTTPResponse | null>) {
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

/**
 * Set properties on a given course like: espb, kategorija, literatura, izvodjaci nastave, ... 
 * @param course a given course
 */
async function setCourseData(course: Predmet, page: Page, navigationPromise: Promise<HTTPResponse | null>) {
  await page.goto(course.url)
  await navigationPromise

  await page.waitForSelector('.col-xs-12 > .table-fixer > tbody > tr')
  const kategorija = await page.$('.col-xs-12 > .table-fixer > tbody > tr:nth-child(1) > td:nth-child(2)')
  const naucnaOblast = await page.$('.col-xs-12 > .table-fixer > tbody > tr:nth-child(2)> td:nth-child(2)')
  const espb = await page.$('.col-xs-12 > .table-fixer > tbody > tr:nth-child(4) > td:nth-child(2)')
  if (!kategorija || !naucnaOblast || !espb) throw new Error('missing kategorija or naucnaOblast or espb')
  course.kategorija = await getValue(kategorija)
  course.naucnaOblast = await getValue(naucnaOblast)
  course.espb = parseInt((await getValue(espb)).trim())

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
    let autori = ''
    const autoriElem = await knjigaElem.$('td:nth-child(1)')
    try { if (autoriElem) autori = await getValue(autoriElem) }
    catch (error) { }

    let naziv = ''
    const nazivElem = await knjigaElem.$('td:nth-child(2)')
    try { if (nazivElem) naziv = await getValue(nazivElem) }
    catch (error) { }

    let godina = 0
    const godinaElem = await knjigaElem.$('td:nth-child(3)')
    try { if (godinaElem) godina = parseInt(await getValue(godinaElem)) }
    catch (error) { }

    let izdavac = ''
    const izdavacElem = await knjigaElem.$('td:nth-child(4)')
    try { if (izdavacElem) izdavac = await getValue(izdavacElem) }
    catch (error) { }

    let jezik = ''
    const jezikElem = await knjigaElem.$('td:nth-child(5)')
    try { if (jezikElem) jezik = await getValue(jezikElem) }
    catch (error) { }

    course.literatura.push({ autori, naziv, godina, izdavac, jezik })
  }

  // formiranje ocene
  const formiranjeOceneElements = await tabs[6].$$('tbody > tr')
  for (const formiranjeOceneElem of formiranjeOceneElements) {

    let predmetnaAktivnost = ''
    const predmetnaAktivnostElem = await formiranjeOceneElem.$('td:nth-child(1)')
    try { if (predmetnaAktivnostElem) predmetnaAktivnost = await getValue(predmetnaAktivnostElem) }
    catch (error) { }

    let predispitna = false
    const predispitnaElem = await formiranjeOceneElem.$('td:nth-child(2)')
    try { if (predispitnaElem) predispitna = await getValue(predispitnaElem) === 'da' }
    catch (error) { }

    let obavezna = false
    const obaveznaElem = await formiranjeOceneElem.$('td:nth-child(3)')
    try { if (obaveznaElem) obavezna = await getValue(obaveznaElem) === 'da' }
    catch (error) { }

    let brojPoena = 0
    const brojPoenaElem = await formiranjeOceneElem.$('td:nth-child(4)')
    try { if (brojPoenaElem) brojPoena = parseInt(await getValue(brojPoenaElem)) }
    catch (error) { }

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

    course.izvodjaciNastave.push({ punoIme, zvanje, vidNastave })

    await navigationPromise
  }
}

/**
 * @param elem Object for which property is returned
 * @param property default is innerHTML
 * @returns Returns the property value of a specified html element. Default property value is innerHTML
 */
async function getValue(elem: ElementHandle<Element>, property: string = 'innerText') {
  const retValue = await (await elem.getProperty(property))?.jsonValue() as string | undefined
  if (!retValue) throw new Error(`property ${property} does not exist.`)
  else return retValue
}

export { getAllCourses, setCourseData }