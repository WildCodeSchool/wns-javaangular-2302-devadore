import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { UserProfileService } from '../../services/user-profile-service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  faCircleUser = faCircleUser;
  isDropdownVisible: boolean = false;
  userImage: any;
  isAdmin: boolean = false;
  isUser: boolean = false;
  isLoggedIn = false;
  @ViewChild('dropdownMenu') dropdownMenu!: ElementRef;
  user: User | null;
  isMenuHovered: boolean = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private userProfileService: UserProfileService
  ) {}

  showDropdown() {
    this.isDropdownVisible = true;
  }

  hideDropdown() {
    this.isDropdownVisible = false;
  }

  showSubMenu(): void {
    this.isMenuHovered = true;
  }

  hideSubMenu(): void {
    this.isMenuHovered = false;
  }

  ngOnInit() {
    this.authService.checkAdminStatus();
    console.log(environment.URL, 'environment.URL');
    this.authService.isAdmin$.subscribe((isAdminValue) => {
      this.isAdmin = isAdminValue;
      console.log('isAdminValue', isAdminValue);
    });
    this.authService.checkUserStatus();
    this.authService.isUser$.subscribe((isUserValue) => {
      this.isUser = isUserValue;
      console.log('isUserValue', isUserValue);
    });
    this.userProfileService.getUserImage().subscribe((image) => {
      this.userImage = image;
    });
    this.userProfileService.getUser().subscribe((user) => {
      this.user = user;
    });
    /*   this.loadImage()*/
    this.isLoggedIn = this.authService.isAuthenticated();
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      console.log('Logged out');
      this.authService.setAdminState(false);
      this.authService.setUserState(false);
      this.isLoggedIn = false;
    });
  }

  editUser(userId: number): void {
    if (!this.user) {
      console.error('User data is missing.');
      // TODO Gérer l'erreur en affichant un message à l'utilisateur
      return;
    }

    if (this.user.id !== userId) {
      console.error(
        `User ID mismatch. Expected ${this.user.id}, but got ${userId}.`
      );
      // TODO Gérer l'erreur en affichant un message à l'utilisateur
      return;
    }

    this.router.navigate(['/user-detail', userId]).then((success) => {
      if (!success) {
        console.error('Failed to navigate to user detail page.');
        // TODO Gérer l'erreur en affichant un message à l'utilisateur
      }
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
