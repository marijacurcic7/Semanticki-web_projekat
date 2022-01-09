import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Test } from '../model/test.model';

@Injectable({
  providedIn: 'root'
})
export class TestsService {

  constructor(private http: HttpClient) { }

  getSortedTestsByDuration(sort: 'minDuration' | 'maxDuration') {
    const queryParams = { params: new HttpParams().set('sort', sort)}
    return this.http.get<Test[]>('http://localhost:8090/query_sorted_tests_by_duration', queryParams)
  }
}
