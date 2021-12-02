import * as admin from 'firebase-admin';
import { StudijskiProgram } from './models/studijskiProgram.model';

async function initializeDatabaseConnection() {
  process.env['FIRESTORE_EMULATOR_HOST'] = 'localhost:8080'
  const serviceAccount = require('../../serviceAccountKey.json')
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
}

async function testDatabaseConnection() {
  const users = await admin.firestore().collection('users').get()
  users.forEach(user => console.log(user.data()))
}

async function saveProgram(program: StudijskiProgram) {
  // add program
  await admin.firestore().collection('programs').doc('siit').set({
    naziv: program.naziv,
    url: program.url,
    nivoStudija: program.nivoStudija,
    zvanje: program.zvanje,
    obrazovnoPolje: program.obrazovnoPolje,
    naucnoStrucneOblasti: program.naucnoStrucneOblasti,
    brojSemestara: program.brojSemestara,
    espb: program.espb,
  })

  // add courses
  // Object serialization is disabled by default.
  // One must use parse & stringify methods
  // https://github.com/googleapis/nodejs-firestore/issues/143#issuecomment-452336611
  program.predmeti.forEach(async predmet => {
    await admin.firestore().collection('programs/siit/courses').add(
      JSON.parse(JSON.stringify(predmet))
    )
  })
}

export { initializeDatabaseConnection, saveProgram, testDatabaseConnection }