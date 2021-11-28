import { Predmet } from "./predmet.model";

export class StudijskiProgram {
  naziv: string;
  nivoStudija: string;
  obrazovnoPolje: string;
  nauconStrucneOblasti: string;
  brojSemestara: number;
  espb: number;
  rukovodilac: Person;
  predmeti: Predmet[];
  url: string;
  id?: string;
}

interface Person {
  punoIme: string,
  telefon: string,
  mejl: string
}