import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
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
  programs: string[] = [];
  program: string = "";
  dataSource!: MatTableDataSource<Professor>;
  option: string | undefined;


  constructor(
    private coursesService: CoursesService,
    private professorsService: ProfessorsService
  ) { 
    this.dataSource = new MatTableDataSource<Professor>();
  }

  ngOnInit(): void {
    this.coursesService.getAllCourses().subscribe(result => {
      this.courses = result;
    });

    this.professorsService.getAllPrograms().subscribe(result => {
      this.programs = result;
    });
  }


  onCourseChange(event: any): void {
    this.course = event.value;

    this.professorsService.getProfessors(this.course).subscribe(result => {
      this.professors = result;
    });

    // this.professorsService.getStudentsCourse(this.course).subscribe(result => {
    //   console.log(result);
    // });

  }


  onProgramChange(event: any): void {
    this.program = event.value;

    // this.professorsService.getStudentsCourse(this.course).subscribe(result => {
    //   console.log(result);
    // });

    this.professorsService.getProfessorsProgram(this.program).subscribe(result => {
      this.professors = result;
    });


  }

}
