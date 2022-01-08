import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProfessorsService {

  constructor(
    private http: HttpClient
  ) { }

  
  getProfessors(courseName: string) {
		let queryParams = {};

    queryParams = {
			params: new HttpParams()
				.set('courseName', String(courseName)),
    }
    
    return this.http.get<any[]>("http://localhost:8090/query_teachers_on_course", queryParams);
  }


  getProfessorsProgram(programName: string) {
		let queryParams = {};

    queryParams = {
			params: new HttpParams()
				.set('programName', String(programName)),
    }
    
    return this.http.get<any[]>("http://localhost:8090/query_teachers_on_programme", queryParams);
  }


  getAllProfessors() {
    return this.http.get<any[]>("http://localhost:8090/teachers");
  }
}
