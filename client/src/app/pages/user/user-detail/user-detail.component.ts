import {Component, OnInit} from '@angular/core';
import {User} from "../../../models/user.model";
import {UserService} from "../../../services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Role} from "../../../models/role.model";
import {forkJoin} from "rxjs";
import {ToastService} from "../../../services/toastService";
import {AuthService} from "../../../services/auth.service";


@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {

  allRoles!: Role[];
  userRoles!: Role[];
  imageFile?: File;
  previewUrl: any = null;
  isAdmin: boolean = false;
  isUser: boolean = false;
  user: User = {
    id: 0,
    username: '',
    email: '',
    /*    password: '',*/
    image: '',
    score: 0,
    roles: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  constructor(private authService: AuthService, private userService: UserService, private route: ActivatedRoute, private router: Router, public toastService: ToastService) {
  }

  ngOnInit(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id') ?? '0', 10);

    forkJoin([this.userService.getAllRoles(), this.userService.getUserById(id)])
      .subscribe(([roles, user]) => {
        this.allRoles = roles;
        this.user = user;
        this.userRoles = user.roles;
        console.log(user);
      });
    this.authService.checkAdminStatus();
    this.authService.isAdmin$.subscribe((isAdminValue) => {
      this.isAdmin = isAdminValue;
      console.log('isAdminValue', isAdminValue)
    });
    this.authService.checkUserStatus();
    this.authService.isUser$.subscribe((isUserValue) => {
      this.isUser = isUserValue;
      console.log('isUserValue', isUserValue)
    });
  }


  isRoleSelected(role: Role): boolean {
    return this.userRoles?.some(userRole => userRole.id === role.id);
  }

  toggleRoleSelection(role: Role): void {
    const roleIndex = this.userRoles.findIndex(userRole => userRole.id === role.id);

    if (roleIndex !== -1) {
      this.userRoles.splice(roleIndex, 1);
    } else {
      this.userRoles.push(role);
    }
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const filenameDisplay = document.getElementById('selectedFilename');

    if (filenameDisplay) {
      if (input.files && input.files[0]) {
        filenameDisplay.textContent = input.files[0].name;
      } else {
        filenameDisplay.textContent = 'Aucun fichier sélectionné';
      }
    }
    const file = (event.target as HTMLInputElement).files;
    if (file && file.length) {
      this.imageFile = file[0];
      this.previewImage(this.imageFile);
    }
  }


  previewImage(file: File) {
    // show preview
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result;
    };
    reader.readAsDataURL(file);
  }

  updateUser(): void {
    if (this.user) {
      if (this.imageFile) {
        const mimeType = this.imageFile.type;
        const userId = this.user.id;
        const imageFile = this.imageFile;

        this.userService.updateUserImage(userId, imageFile, mimeType).subscribe({
          next: () => {
            // Mettre à jour uniquement les détails de l'utilisateur après la mise à jour de l'image
            if (this.isAdmin) {
              this.toastService.showToast('Image du profil mise à jour avec succès', 'success');
              setTimeout(() => {
                this.router.navigate(['/user-list']);
              }, 2000);
            } else if (this.isUser) {
              this.toastService.showToast('Profil mis à jour avec succès', 'success');
              setTimeout(() => {
                this.router.navigate(['/home']).then(() => {
                });
              }, 2000);
            }
          },
          error: () => {
            this.toastService.showToast('Erreur lors de la mise à jour de l\'image', 'error');
          }
        });

      } else {
        // Si aucune image n'est spécifiée, mettre à jour uniquement les détails de l'utilisateur
        this.updateUserDetails();
      }
    }
  }

  private updateUserDetails(): void {
    this.userService.updateUser(this.user).subscribe({
      next: () => {
        if (this.isAdmin) {
          console.log(this.isAdmin)
          this.toastService.showToast('Profil mis à jour avec succès', 'success');
          setTimeout(() => {
            this.router.navigate(['/user-list']).then(() => {
            });
          }, 2000);
        } else if (this.isUser) {
          this.toastService.showToast('Profil mis à jour avec succès', 'success');
          setTimeout(() => {
            this.router.navigate(['/home']).then(() => {
            });
          }, 2000);
        }
      },
      error: (error) => {
        this.toastService.showToast('Erreur lors de la mise à jour du profil', 'error');
        console.error('Erreur lors de la mise à jour du profil:', error);
      }
    });
  }

  deleteUser(userId: number): void {
    if (this.user.roles.some(role => ['ADMIN'].includes(role.name))) {
      // Si l'utilisateur a le rôle ADMIN
      this.toastService.showToast('La suppression est impossible pour les utilisateurs avec un rôle ADMIN', 'warning');
    } else if (this.user.roles.some(role => ['USER'].includes(role.name))) {
      // Si l'utilisateur a le rôle USER
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.toastService.showToast('Profil supprimé avec succès', 'success');
          this.logoutAfterDelete(); // Déconnexion après la suppression de l'utilisateur
        },
        error: (error) => {
          this.toastService.showToast('Erreur lors de la suppression du profil', 'error');
          console.error('Erreur lors de la suppression du profil:', error);
        }
      });
    } else {
      // Cas pour d'autres rôles mais y en a pas !
      this.toastService.showToast('Rôle non reconnu', 'warning');
    }
  }

  logoutAfterDelete(): void {
    console.log('Removing tokens...');
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('refreshToken');
    this.router.navigate(['/home']);
  }


  goToUserlist() {
    this.router.navigateByUrl('user-list').then(() => {
      // Après avoir navigué vers la page d'accueil, ?????
    });
  }

}
