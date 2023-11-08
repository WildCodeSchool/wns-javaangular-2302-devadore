import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class CreateQuizGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    const roles = this.authService.decodeToken(this.authService.getToken() ?? '')?.roles;

    const hasRequiredRole = roles?.includes('USER') || roles?.includes('ADMIN');

    if (hasRequiredRole) {
      return true;
    } else {

      this.router.navigate(['/error']);
      return false;
    }
  }
}



