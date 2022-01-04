import { Injectable } from '@angular/core';
import { Course } from '../model/course.model';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class CoursesService {


  constructor(private http: HttpClient) { }

  getAllCourses() {

    return this.http.get<string[]>("http://localhost:8090/courses");
    
  }
}
