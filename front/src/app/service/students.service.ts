import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {
  headers: HttpHeaders

  constructor(
    private http: HttpClient,
    private auth: AuthService,
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

  async getStudentsCourse(courseName: string) {
    await this.setHeaders()
    const params = new HttpParams()
      .set('courseName', String(courseName))

    return this.http.get<any[]>("http://localhost:8090/query_students_on_course",
      { headers: this.headers, params: params }).toPromise()

  }

  async getStudentsByTestResults(sort: string) {
    await this.setHeaders()
    const params = new HttpParams()
      .set('sort', String(sort))

    return this.http.get<any[]>("http://localhost:8090/query_sorted_students_by_test_results",
      { headers: this.headers, params: params }).toPromise()
  }

}
