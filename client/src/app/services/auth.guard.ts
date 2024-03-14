import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const requiredRole = route.data['role'];
    const token = this.authService.getToken();

    if (token) {
      const decodedToken = this.authService.decodeToken(token);
      const hasRequiredRole = decodedToken && decodedToken.roles && decodedToken.roles.includes(requiredRole);

      if (hasRequiredRole) {
        return true;
      }
    }

    // Not the required role, so redirect to the home page
    this.router.navigate(['/home']);
    return false;
  }
}

