import { Predmet } from "./predmet.model";

export class StudijskiProgram {
  naziv: string;
  url: string;
  nivoStudija: string;
  zvanje: string;
  obrazovnoPolje: string;
  naucnoStrucneOblasti: string;
  brojSemestara: number;
  espb: number;
  rukovodilac: Person;
  predmeti: Predmet[];
  id?: string;

  constructor(naziv: string, url: string) {
    this.naziv = naziv;
    this.url = url
  }
}

interface Person {
  punoIme: string,
  telefon: string,
  mejl: string
}