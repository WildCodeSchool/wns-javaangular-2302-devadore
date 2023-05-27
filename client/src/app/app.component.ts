import {Component, OnInit} from '@angular/core';
import {AuthService} from "./services/auth.service";
import {Router} from "@angular/router";
import {UserService} from "./services/user.service";
import { ImageService } from './services/image.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'client';
  imageId: number | undefined;
  imageToShow: any;
  constructor(public authService: AuthService, private userService: UserService,private router: Router, private imageService: ImageService) { }
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

  onFileChanged(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files ? target.files[0] : null;
    if (file) {
      this.imageService.uploadImage(file).subscribe(response => {
        console.log(`Response from upload endpoint:`, response);

        const id = response.id;
        if (id !== undefined && !isNaN(id)) {
          this.imageId = id;
        } else {
          console.error('Received invalid ID from the upload endpoint');
        }
      });
    }
  }

  showImage(id?: number) {
    if (id === undefined || isNaN(id)) {
      console.error('No valid image ID provided');
      return;
    }
    this.imageService.getImage(id).subscribe(
      data => {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.imageToShow = e.target.result;
        }
        reader.readAsDataURL(data);
      },
      error => {
        console.error('Image retrieval failed:', error);
      }
    );
  }


}
