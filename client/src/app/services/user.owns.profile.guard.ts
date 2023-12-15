import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {catchError, map, Observable, of} from 'rxjs';
import {AuthService} from "./auth.service";
import {UserService} from "./user.service";

@Injectable({
  providedIn: 'root',
})
export class UserOwnsProfileGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const username = this.authService.decodeToken(this.authService.getToken() ?? '')?.sub;
    const userRole = this.authService.decodeToken(this.authService.getToken() ?? '')?.roles;
    const userId = route.params['id'];

    if (!username) {
      this.router.navigate(['/login']);
      return false;
    }
    const isAdmin = userRole?.includes('ADMIN');
    if (isAdmin) {
      // Autoriser l'accès si l'utilisateur est un administrateur
      return true;
    } else {
      return this.userService.getUserIdByUsername(username).pipe(
        map((userIdFromServer) => {
          const numericRouteId = +userId;
          if (userIdFromServer === numericRouteId) {
            return true;
          } else {
            this.router.navigate(['/unauthorized']);
            return false;
          }
        }),
        catchError((err) => {
          this.router.navigate(['/error']);
          return of(false);
        })
      );
    }
  }
}


