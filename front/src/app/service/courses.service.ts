import { Injectable } from '@angular/core';
import { Course } from '../model/course.model';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class CoursesService {


  constructor(private http: HttpClient) { }

  getAllCourses() {

    return this.http.get<string[]>("http://localhost:8090/courses");
    
  }

  getCourses(teacher: string) {

    let queryParams = {};

    queryParams = {
			params: new HttpParams()
				.set('teacherName', String(teacher)),
    }

    return this.http.get<string[]>("http://localhost:8090/query_courses_for_a_given_teacher", queryParams);

  }

  getCourses3Books() {

    return this.http.get<any[]>("http://localhost:8090/query_courses_with_more_than_3_books");
    
  }

  getCoursesESPBYear(espb: string, year: string) {

    let queryParams = {};

    queryParams = {
			params: new HttpParams()
				.set('espbLimit', String(espb))
        .append('year', String(year))
    }

    return this.http.get<any[]>("http://localhost:8090/query_courses_with_espb_and_year", queryParams);
    
  }
}
