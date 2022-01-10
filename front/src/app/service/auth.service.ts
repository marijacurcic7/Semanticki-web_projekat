import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FirebaseError } from '@firebase/util';
import { Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<firebase.default.User | null>;

  constructor(
    private auth: AngularFireAuth,
    private snackBar: MatSnackBar,
    private http: HttpClient,
  ) {

    this.user$ = this.auth.authState.pipe(
      switchMap(user => {
        console.log(user?.displayName)
        return of(user)
      })
    )
  }

  async loginWithEmailAndPassword(email: string, password: string) {
    try {
      const credentials = await this.auth.signInWithEmailAndPassword(email, password)
      if (credentials.user === null) return
      this.openSuccessSnackBar('Successfully logged in.')
    } catch (error) {
      if (error instanceof FirebaseError) this.openFailSnackBar(error.code)
      else this.openFailSnackBar()
      throw error
    }
  }

  logout() {
    this.auth.signOut()
  }

  async testFirebaseToken() {
    const user = await this.user$.pipe(take(1)).toPromise()
    const authToken = await user?.getIdToken()
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${authToken}`,
    })

    const response = await this.http.get<string>(
      "http://localhost:8090/test-firebase-token",
       { headers: headers }
    ).toPromise()
    console.log(response)
  }

  openSuccessSnackBar(message: string): void {
    this.snackBar.open(message, 'Dismiss', {
      verticalPosition: 'top',
      panelClass: ['green-snackbar'],
      duration: 4000,
    });
  }
  openFailSnackBar(message = 'Something went wrong.'): void {
    this.snackBar.open(message, 'Dismiss', {
      verticalPosition: 'top',
      panelClass: ['red-snackbar']
    });
  }


}
