import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfessorsService {
  headers: HttpHeaders

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) { }

  async setHeaders() {
    const user = await this.auth.user$.pipe(take(1)).toPromise()
    const authToken = await user?.getIdToken()
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${authToken}`,
    })
    this.headers = headers
  }


  async getProfessors(courseName: string) {
    await this.setHeaders()
    const params = new HttpParams()
      .set('courseName', String(courseName))
    return this.http.get<any[]>("http://localhost:8090/query_teachers_on_course",
      { headers: this.headers, params: params }).toPromise()
  }


  async getProfessorsProgram(programName: string) {
    await this.setHeaders()
    const params = new HttpParams()
      .set('programName', String(programName))
    return this.http.get<any[]>("http://localhost:8090/query_teachers_on_programme",
      { headers: this.headers, params: params }).toPromise()
  }

  async getAllProfessors() {
    await this.setHeaders()
    return this.http.get<any[]>("http://localhost:8090/teachers",
    { headers: this.headers }).toPromise()

  }

  async getAllPrograms() {
    await this.setHeaders()
    return this.http.get<any[]>("http://localhost:8090/programs",
    { headers: this.headers }).toPromise()
  }
}
