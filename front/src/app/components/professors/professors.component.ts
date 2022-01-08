import { Component, OnInit } from '@angular/core';
import { Course } from 'src/app/model/course.model';
import { Professor } from 'src/app/model/professor.model';
import { CoursesService } from 'src/app/service/courses.service';
import { ProfessorsService } from 'src/app/service/professors.service';

@Component({
  selector: 'app-professors',
  templateUrl: './professors.component.html',
  styleUrls: ['./professors.component.css']
})
export class ProfessorsComponent implements OnInit {

  displayedColumns: string[] = ['name'];
  // professors: Professor[] = [];
  professors: string[] = [];
  courses: string[] = [];
  course: string = "";

  constructor(
    private coursesService: CoursesService,
    private professorsService: ProfessorsService
  ) { }

  ngOnInit(): void {
    this.coursesService.getAllCourses().subscribe(result => {
      this.courses = result;
    });

    // this.professorsService.getProfessorsProgram("softversko inzenjerstvo i informacione tehnologije").subscribe(result => {
    //   console.log(result);
    // });

  }

  onCourseChange(event: any): void {
    this.course = event.value;

    this.professorsService.getProfessors(this.course).subscribe(result => {
      this.professors = result;
    });

    this.professorsService.getStudentsCourse(this.course).subscribe(result => {
      console.log(result);
    });


  }

}
