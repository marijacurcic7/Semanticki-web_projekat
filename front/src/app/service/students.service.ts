import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {

  constructor(
    private http: HttpClient
  ) { }

  getStudentsCourse(courseName: string) {
    let queryParams = {};

    queryParams = {
			params: new HttpParams()
				.set('courseName', String(courseName)),
    }
    
    return this.http.get<any[]>("http://localhost:8090/query_students_on_course", queryParams);
  }

  getStudentsByTestResults(sort: string) {
    let queryParams = {};

    queryParams = {
			params: new HttpParams()
				.set('sort', String(sort)),
    }
    
    return this.http.get<any[]>("http://localhost:8090/query_sorted_students_by_test_results", queryParams);
  }

}
