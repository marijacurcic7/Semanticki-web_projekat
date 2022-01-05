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


  professors: string[] = [];
  courses: Course[] = [];
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
      console.log(result);
      this.professors = result;
    });
  }

  onTeacherChange(event: any): void {
    this.courses = [];
    this.coursesForTeacher(event.value);

  }

  coursesForTeacher(teacher: string) {
    this.coursesService.getCourses(teacher).subscribe(result => {
      for (let r of result) {
        r = r + '';
        let courseName = r.split(',')[0];
        let course: Course = {
          naziv: courseName
        }
        this.courses.push(course);
      }
      this.dataSource = new MatTableDataSource<Course>(this.courses);
    });
  }

  courses3Books() {
    this.coursesService.getCourses3Books().subscribe(result => {
      this.displayedColumns = ['name', 'count'];
      for (let r of result) {
        let course: Course = {
          naziv: r.courseTitle,
          brojKnjiga: r.bookCount
        }
        this.courses.push(course);
      }
      this.dataSource = new MatTableDataSource<Course>(this.courses);
    });
  }

  radioChange(event: any) {
    this.courses = [];

    if (this.option == '1') {
      this.displayedColumns = ['name'];

      this.dataSource = new MatTableDataSource<Course>();
    }
    else if (this.option == '2') {
      
      this.courses3Books();
    }
  }

  onSubmit(): void {
    this.courses = [];

    let espb = this.option3Form.controls['espb'].value;
    let year = this.option3Form.controls['year'].value;

    this.coursesService.getCoursesESPBYear(espb, year).subscribe(result => {
      console.log(result);
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

    });
    
  }


}
