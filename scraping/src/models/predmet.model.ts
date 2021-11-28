export class Predmet {
  godina: number;
  semestar: 'zimski' | 'letnji';
  espb: number;
  naziv: string;
  kategorija: string;
  naucnaOblast: string;
  osnovneInformacije: string;
  cilj: string;
  ishod: string;
  sadrzaj: string;
  metodologijaIzvodjenjaNastave: string;
  literatura: Knjiga[];
  formiranjeOcene: FormiranjeOcene[];
  izvodjaciNastave: IzvodjacNastave[];
  id?: string
}

interface Knjiga {
  autori: string;
  naziv: string;
  godina: number;
  izdavac: string;
  jezik: string;
}

interface FormiranjeOcene {
  predmetnaAktivnost: string;
  predispitna: string;
  obavezna: string;
  brojPoena: number;
}

interface IzvodjacNastave {
  punoIme: string;
  zvanje: string;
  vidNastave: string;
}