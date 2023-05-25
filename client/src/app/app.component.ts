import {Component, OnInit} from '@angular/core';
import {AuthService} from "./services/auth.service";
import {Router} from "@angular/router";
import {UserService} from "./services/user.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'client';
  constructor(public authService: AuthService, private userService: UserService,private router: Router) { }
  isAdmin: boolean = false;



  ngOnInit() {
    const jwtToken = localStorage.getItem('jwtToken');
    if (jwtToken) {
      const decodedToken = this.authService.decodeToken(jwtToken);
      const isAdmin = decodedToken && decodedToken.roles && decodedToken.roles.includes('ADMIN');
      this.authService.setAdminState(isAdmin);
        console.log(this.isAdmin);
      }
      this.authService.isAdmin$.subscribe((isAdminValue) => {
        this.isAdmin = isAdminValue;
        console.log(this.isAdmin);
      });
  }
  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      console.log('Logged out');
      this.authService.setAdminState(false);
    });
  }
  handleButtonClick(): void {
    if (this.isAuthenticated()) {
      this.logout();
    } else {
      this.router.navigate(['/auth/login']);
    }
  }
}
