import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Course } from 'src/app/model/course.model';
import { CoursesService } from 'src/app/service/courses.service';
import { ProfessorsService } from 'src/app/service/professors.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {

  displayedColumns: string[] = ['name'];
  dataSource!: MatTableDataSource<Course>;
  option: string | undefined;
  option3Form!: FormGroup;
  sortType: string = "ASC";
  semester: string | undefined;

  professors: string[] = [];
  courses: Course[] = [];
  fields: string[] = [];
  // prof: string = "";


  constructor(
    private coursesService: CoursesService,
    private professorsService: ProfessorsService,
    private formBuilder: FormBuilder,
  ) {
    this.dataSource = new MatTableDataSource<Course>();
    this.option3Form = this.formBuilder.group({
      'espb': [''],
      'year': ['']
    });
  }

  ngOnInit(): void {
    this.professorsService.getAllProfessors().subscribe(result => {
      this.professors = result;
    });
  }

  onTeacherChange(event: any): void {
    this.courses = [];
    this.coursesForTeacher(event.value);

  }

  async coursesForTeacher(teacher: string) {
    const result = await this.coursesService.getCourses(teacher)
    for (let r of result) {
      r = r + '';
      let courseName = r.split(',')[0];
      let course: Course = {
        naziv: courseName
      }
      this.courses.push(course);
    }
    this.dataSource = new MatTableDataSource<Course>(this.courses);
  }

  async courses3Books() {
    const result = await this.coursesService.getCourses3Books()
    for (let r of result) {
      let course: Course = {
        naziv: r.courseTitle,
        brojKnjiga: r.bookCount
      }
      this.courses.push(course);
    }
    this.dataSource = new MatTableDataSource<Course>(this.courses);
  }

  radioChange(event: any) {
    this.courses = [];
    this.dataSource = new MatTableDataSource<Course>();

    if (this.option == '1') {
      this.displayedColumns = ['name'];
    }
    else if (this.option == '2') {
      this.displayedColumns = ['name', 'count'];
      this.courses3Books();
    }
    else if (this.option == '4') {
      this.displayedColumns = ['name'];
    }
    else if (this.option == '5') {
      this.displayedColumns = ['name', 'points'];
      this.coursesByTestResults();
    }
  }

  async onSubmit() {
    this.courses = [];
    let espb = this.option3Form.controls['espb'].value;
    let year = this.option3Form.controls['year'].value;

    const result = await this.coursesService.getCoursesESPBYear(espb, year)
    this.displayedColumns = ['name', 'espb', 'year'];
    for (let r of result) {
      let course: Course = {
        naziv: r.courseTitle,
        espb: r.espb,
        godina: r.year
      }
      this.courses.push(course);
    }
    this.dataSource = new MatTableDataSource<Course>(this.courses);
  }

  onSortChange(event: any): void {
    this.courses = [];
    this.sortType = event.value;
    this.coursesByTestResults();
  }

  async coursesByTestResults() {
    const result = await this.coursesService.getCoursesByTestResults(this.sortType)
    for (let r of result) {
      let course: Course = {
        naziv: r[1],
        avgPoints: r[0],
      }
      this.courses.push(course);
    }
    this.dataSource = new MatTableDataSource<Course>(this.courses);
  }

  async onSemesterChange(event: any) {
    this.courses = [];
    this.fields = [];
    this.semester = event.value;
    if (!this.semester) return;
    this.fields = await this.coursesService.getScientificFields(this.semester)
  }

  async onScientificFieldChange(event: any) {
    let scientificField = event.value;
    if (!this.semester) return;
    const result = await this.coursesService.getCoursesWithSemesterAndScientificField(this.semester, scientificField)
    for (let r of result) {
      let course: Course = {
        naziv: r,
      }
      this.courses.push(course);
    }
    this.dataSource = new MatTableDataSource<Course>(this.courses);
  }
}
