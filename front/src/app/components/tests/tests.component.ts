import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Test } from 'src/app/model/test.model';

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.css']
})
export class TestsComponent implements OnInit {
  tests = []
  option: string | undefined
  displayedColumns: string[] = ['name', 'minDuration', 'maxDuration']
  dataSource!: MatTableDataSource<Test>

  constructor() { }

  ngOnInit(): void {
  }

  radioChange(event: any) {
    this.tests = [];

    if (this.option == '1') {
      // this.dataSource = new MatTableDataSource<Test>();
    }
    else {

    }
  }
}
