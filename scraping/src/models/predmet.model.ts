export class Predmet {
  naziv: string;
  url: string;
  godina: number;
  semestar: 'zimski' | 'letnji';
  kategorija: string;
  naucnaOblast: string;
  espb: number;
  osnovneInformacije: string;
  cilj: string;
  ishod: string;
  sadrzaj: string;
  metodologijaIzvodjenjaNastave: string;
  literatura: Knjiga[] = [];
  formiranjeOcene: FormiranjeOcene[] = [];
  izvodjaciNastave: IzvodjacNastave[] = [];
  id?: string

  constructor(godina: number, semestar: 'zimski' | 'letnji', naziv?: string, url?: string,) {
    this.godina = godina;
    this.semestar = semestar;
    naziv ? this.naziv = naziv : undefined;
    url ? this.url = url : undefined;
  }
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
  predispitna: boolean;
  obavezna: boolean;
  brojPoena: number;
}

interface IzvodjacNastave {
  punoIme: string;
  zvanje: string;
  vidNastave: string;
}