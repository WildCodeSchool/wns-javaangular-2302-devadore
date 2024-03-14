import {Injectable} from '@angular/core';
import {AuthService} from "./auth.service";
import {UserService} from "./user.service";
import {BehaviorSubject, Observable} from "rxjs";
import {User} from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  userImage: any;
  user: any;
  private userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  private userImageSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  userImage$ = this.userImageSubject.asObservable();

  constructor(private authService: AuthService, private userService: UserService) {

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
          this.userService.getUserIdByUsername(username).subscribe({
            next: (userId: number) => {
              this.userService.getUserById(userId).subscribe(user => {
                this.userSubject.next(user); // <-- Use the BehaviorSubject here
              });

              // Utiliser l'ID de l'utilisateur récupéré pour obtenir l'image de l'utilisateur
              this.userService.getUserImage(userId).subscribe({
                next: (imageData: any) => {
                  // Convertir les données de l'image (Blob) en URL utilisable
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    this.userImageSubject.next(reader.result); // <-- Use the BehaviorSubject here
                  };
                  reader.readAsDataURL(imageData);
                }
              });
            }
          });
        }
      }
    }
  }

  getUserImage(): Observable<any> {
    this.loadImage();
    return this.userImage$;
  }

  getUser(): Observable<User | null> {
    this.loadImage();
    return this.user$;
  }

}




