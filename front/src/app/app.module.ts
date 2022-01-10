import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './components/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
//firestore
import { AngularFireModule } from '@angular/fire/compat'
import { environment } from 'src/environments/environment';
//auth
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/compat/auth';

/* 
This function is necessary to properly load logged in user after page refresh.
Otherwise, user will be logged out.
There is a bug in angularfire which is fixed by delaying auth emulator.
Use this function only in development environment!
*/
export function initializeApp1(afa: AngularFireAuth) {
  return () => {
    if (environment.production) return Promise.resolve()
    else return afa.useEmulator(`http://localhost:8083`);
  };
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,

  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp1,
      deps: [AngularFireAuth],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
