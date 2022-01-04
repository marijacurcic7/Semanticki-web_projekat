import { Injectable } from '@angular/core';
import { Course } from '../model/course.model';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  constructor() { }

  getAllCourses(program: string) {
    
  }
}
