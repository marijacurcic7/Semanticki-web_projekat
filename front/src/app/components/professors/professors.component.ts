import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
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

  async ngOnInit() {
    this.courses = await this.coursesService.getAllCourses()
    this.programs = await this.professorsService.getAllPrograms()
  }


  async onCourseChange(event: any) {
    this.course = event.value;
    this.professors = await this.professorsService.getProfessors(this.course)
  }

  async onProgramChange(event: any) {
    this.program = event.value;
    this.professors = await this.professorsService.getProfessorsProgram(this.program)
  }
}
