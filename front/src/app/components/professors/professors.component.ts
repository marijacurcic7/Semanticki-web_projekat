import { Component, OnInit } from '@angular/core';
import { Course } from 'src/app/model/course.model';
import { Professor } from 'src/app/model/professor.model';

@Component({
  selector: 'app-professors',
  templateUrl: './professors.component.html',
  styleUrls: ['./professors.component.css']
})
export class ProfessorsComponent implements OnInit {

  displayedColumns: string[] = ['name', 'teaching', 'title'];
  professors: Professor[] = [];
  courses: Course[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
