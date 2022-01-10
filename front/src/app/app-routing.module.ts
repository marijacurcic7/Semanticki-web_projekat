import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoursesComponent } from './components/courses/courses.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ProfessorsComponent } from './components/professors/professors.component';
import { StudentsComponent } from './components/students/students.component';
import { TestsComponent } from './components/tests/tests.component';
import { AuthGuard } from './guards/role.guard';

const routes: Routes = [
  { 
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'professors',
        component: ProfessorsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'students',
        component: StudentsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'courses',
        component: CoursesComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'tests',
        component: TestsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'login',
        component: LoginComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
