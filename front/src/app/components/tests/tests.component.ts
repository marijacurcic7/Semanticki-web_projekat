import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Test } from 'src/app/model/test.model';
import { TestsService } from 'src/app/service/tests.service';

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.css']
})
export class TestsComponent implements OnInit {
  tests: Test[] = []
  option: string | undefined
  displayedColumns: string[] = ['name', 'minDuration', 'maxDuration']
  dataSource = new MatTableDataSource<Test>(this.tests)

  constructor(private testsService: TestsService) { }

  ngOnInit(): void {
  }

  async radioChange(event: any) {
    let sort: 'minDuration' | 'maxDuration' = 'minDuration'
    if (this.option == '1') sort = 'minDuration'
    else sort = 'maxDuration'
    
    this.tests = await this.testsService.getSortedTestsByDuration(sort).toPromise()
    this.dataSource = new MatTableDataSource<Test>(this.tests);
  }
}
