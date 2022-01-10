import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    public auth: AuthService,
    public router: Router,
  ) { }
  canActivate(route: ActivatedRouteSnapshot) {
    let roles: string[] = route.data['roles']

    return this.auth.user$.pipe(
      map(user => {
        // if user object is null or undefined -> return false -> means that no one is logged in
        if (!user) {
          this.router.navigate(['/'])
          console.error('access denied')
          return false
        }
        else return true
      })
    )
  }

}
