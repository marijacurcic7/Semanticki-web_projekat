import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { take } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  headers: HttpHeaders

  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) {
  }

  async setHeaders() {
    const user = await this.auth.user$.pipe(take(1)).toPromise()
    const authToken = await user?.getIdToken()
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${authToken}`,
    })
    this.headers = headers
  }

  async getAllCourses() {
    await this.setHeaders()
    return this.http.get<string[]>("http://localhost:8090/courses", { headers: this.headers }).toPromise()

  }

  getCourses(teacher: string) {

    const params = new HttpParams().set('teacherName', String(teacher))

    return this.http.get<string[]>("http://localhost:8090/query_courses_for_a_given_teacher",
      { headers: this.headers, params: params });

  }

  getCourses3Books() {

    return this.http.get<any[]>("http://localhost:8090/query_courses_with_more_than_3_books", { headers: this.headers });

  }

  getCoursesESPBYear(espb: string, year: string) {
    const params = new HttpParams()
      .set('espbLimit', String(espb))
      .append('year', String(year))

    return this.http.get<any[]>("http://localhost:8090/query_courses_with_espb_and_year",
      { headers: this.headers, params: params });
  }

  getCoursesByTestResults(sort: string) {
    const params = new HttpParams()
      .set('sort', String(sort))

    return this.http.get<any[]>("http://localhost:8090/query_sorted_courses_by_test_results",
      { headers: this.headers, params: params });
  }

  getScientificFields(semester: string) {
    const params = new HttpParams()
      .set('semester', String(semester))


    return this.http.get<any[]>("http://localhost:8090/scientific_fields_in_semester",
      { headers: this.headers, params: params });
  }

  getCoursesWithSemesterAndScientificField(semester: string, scientificField: string) {
    const params = new HttpParams()
      .set('semester', String(semester))
      .append('scientificField', String(scientificField))

    return this.http.get<any[]>("http://localhost:8090/query_courses_with_semester_and_scientific_field",
      { headers: this.headers, params: params });
  }
}
