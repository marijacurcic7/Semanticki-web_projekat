import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Student } from 'src/app/model/student.model';
import { CoursesService } from 'src/app/service/courses.service';
import { StudentsService } from 'src/app/service/students.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {

  displayedColumns: string[] = ['name'];
  students: Student[] = [];
  courses: string[] = [];
  course: string = "";
  option: string | undefined;
  sortType: string = "ASC";
  dataSource!: MatTableDataSource<Student>;


  constructor(
    private coursesService: CoursesService,
    private studentsService: StudentsService
  ) {
    this.dataSource = new MatTableDataSource<Student>();
  }

  async ngOnInit() {
    this.courses = await this.coursesService.getAllCourses()
  }

  async onCourseChange(event: any) {
    this.course = event.value;

    const result = await this.studentsService.getStudentsCourse(this.course)
    for (let r of result) {
      let student: Student = {
        name: r,
      }
      this.students.push(student);
    }
    console.log(this.students);
    this.dataSource = new MatTableDataSource<Student>(this.students);
  }

  radioChange(event: any) {
    this.students = [];
    if (this.option == '1') {
      this.displayedColumns = ['name'];
    }
    else if (this.option == '2') {
      this.displayedColumns = ['name', 'points', 'test'];
      this.studentsByTestResults();
    }
  }

  onSortChange(event: any): void {
    this.students = [];
    this.sortType = event.value;
    this.studentsByTestResults();
  }

  async studentsByTestResults() {
    const result = await this.studentsService.getStudentsByTestResults(this.sortType)
    for (let r of result) {
      let student: Student = {
        name: r[0],
        points: r[1],
        testName: r[2]
      }
      this.students.push(student);
    }

    this.dataSource = new MatTableDataSource<Student>(this.students);

  }

}
