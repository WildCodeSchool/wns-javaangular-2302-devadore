import {Component, ElementRef, ViewChild} from '@angular/core';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  faCircleUser = faCircleUser;

  isDropdownVisible: boolean = false;


  @ViewChild('dropdownMenu') dropdownMenu!: ElementRef;

  constructor(public authService: AuthService, private userService: UserService,private router: Router) { }
  isAdmin: boolean = false;

/*  constructor(private router: Router) {}*/

  showDropdown() {
    this.isDropdownVisible = true;
  }

  hideDropdown() {
    this.isDropdownVisible = false;
  }

  goToLoginPage() {
    this.router.navigateByUrl('/auth/login');
  }



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
