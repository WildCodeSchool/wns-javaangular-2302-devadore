import {Component, OnInit} from '@angular/core';
import {AuthService} from "./services/auth.service";
import {Router} from "@angular/router";
import {UserService} from "./services/user.service";



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit { // en attendant un navbar ?
  title = 'client';
  imageId: number | undefined;
  imageToShow: any;
  constructor(public authService: AuthService, private userService: UserService,private router: Router) { }
  isAdmin: boolean = false;



  ngOnInit() {
    this.authService.isAdmin$.subscribe((isAdminValue) => {
      this.isAdmin = isAdminValue;
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
