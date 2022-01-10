import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { Test } from '../model/test.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TestsService {
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

  async getSortedTestsByDuration(sort: 'minDuration' | 'maxDuration') {
    await this.setHeaders()
    const params = new HttpParams().set('sort', sort)
    return this.http.get<Test[]>('http://localhost:8090/query_sorted_tests_by_duration',
      { headers: this.headers, params: params }).toPromise()
  }
}
