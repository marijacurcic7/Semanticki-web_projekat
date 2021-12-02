import { ElementHandle, HTTPResponse, Page } from "puppeteer"
import { StudijskiProgram } from "./models/studijskiProgram.model"

/**
 * Get all programs from 'akademske studije'. Initialize array of programs.
 * Visit to every program page and set data for each program. Return programs array
 * @param page 
 * @param navigationPromise 
 * @returns array of programs
 */
async function getAllPrograms(page: Page, navigationPromise: Promise<HTTPResponse | null>) {
  await page.waitForSelector('#affix-osnovne > .panel-body')
  const osnovneAkademskeStudije = await page.$$('#affix-osnovne > .panel-body > a')

  const studijskiProgrami = await initProgramsArray(osnovneAkademskeStudije)

  for (const program of studijskiProgrami) {
    await setProgramData(program, page, navigationPromise)
  }
  
  await navigationPromise
  return studijskiProgrami
}

/**
 * Initialize, populate array of programs only once.
 * @param programs programs elements array
 */
async function initProgramsArray(programs: ElementHandle<Element>[]) {
  const studijskiProgrami: StudijskiProgram[] = []

  for (const program of programs) {
    const url = await getValue(program, 'href')
    const naziv = await getValue(program)
    let studijskiProgram = new StudijskiProgram(naziv, url)
    studijskiProgrami.push(studijskiProgram)
  }
  return studijskiProgrami
}

/**
 * Set, modifies properties and data for a given program: nivo studija, zvanje, broj semestara, espb,...
 * @param program program object for which we set properties
 * @param page 
 * @param navigationPromise 
 */
async function setProgramData(program: StudijskiProgram, page: Page, navigationPromise: Promise<HTTPResponse | null>) {
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

export {getAllPrograms, setProgramData}