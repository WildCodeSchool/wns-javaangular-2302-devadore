import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {faCircleUser} from '@fortawesome/free-solid-svg-icons';
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {UserService} from "../../services/user.service";

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
  isLoggedIn = false;

  @ViewChild('dropdownMenu') dropdownMenu!: ElementRef;

  constructor(public authService: AuthService, private userService: UserService, private router: Router) {
  }

  showDropdown() {
    this.isDropdownVisible = true;
  }

  hideDropdown() {
    this.isDropdownVisible = false;
  }

  ngOnInit() {
    this.authService.isAdmin$.subscribe((isAdminValue) => {
      this.isAdmin = isAdminValue;
    });
    this.loadImage()
    this.isLoggedIn = this.authService.isAuthenticated();
  }

  loadImage(): void {
    // Vérifier l'authentification et récupérer le jeton
    if (this.authService.isAuthenticated()) {
      const token = this.authService.getToken();
      if (token) {
        // Décoder le jeton et récupérer le nom d'utilisateur
        const decodedToken = this.authService.decodeToken(token);
        if (typeof decodedToken === 'object' && 'sub' in decodedToken) {
          const username = decodedToken.sub;

          // Récupérer l'identifiant de l'utilisateur par son nom d'utilisateur
          this.userService.getUserIdByUsername(username).subscribe(
            (userId: number) => {
              // Utiliser l'ID de l'utilisateur récupéré pour obtenir l'image de l'utilisateur
              this.userService.getUserImage(userId).subscribe(
                (imageData: any) => {
                  // Convertir les données de l'image (Blob) en URL utilisable
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    this.userImage = reader.result;
                  };
                  reader.readAsDataURL(imageData);
                },
                error => {
                  console.log('Erreur lors de la récupération de l\'image :', error);
                }
              )
            }
          )
        }
      }
    }
  }


  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      console.log('Logged out');
      this.authService.setAdminState(false);
      this.isLoggedIn = false;
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
