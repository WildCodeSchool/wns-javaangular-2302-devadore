import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from '../../../models/role.model';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit {
  allRoles!: Role[];
  userRoles!: Role[];
  imageFile?: File;
  previewUrl: any = null;
  isAdmin: boolean = false;
  isUser: boolean = false;
  user = {} as User;
  showToast = false;
  toastMessage: string;
  toastType: 'confirm' | 'success' | 'error' | 'warning';
  canShowButton: boolean = false;
  selectedUserId: number | null = null;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id') ?? '0', 10);

    forkJoin([
      this.userService.getAllRoles(),
      this.userService.getUserById(id),
    ]).subscribe(([roles, user]) => {
      this.allRoles = roles;
      this.user = user;
      this.userRoles = user.roles;
      console.log(user);
    });
    this.authService.checkAdminStatus();
    this.authService.isAdmin$.subscribe((isAdminValue) => {
      this.isAdmin = isAdminValue;
      console.log('isAdminValue', isAdminValue);
    });
    this.authService.checkUserStatus();
    this.authService.isUser$.subscribe((isUserValue) => {
      this.isUser = isUserValue;
      console.log('isUserValue', isUserValue);
    });
  }

  isRoleSelected(role: Role): boolean {
    return this.userRoles?.some((userRole) => userRole.id === role.id);
  }

  toggleRoleSelection(role: Role): void {
    const roleIndex = this.userRoles.findIndex(
      (userRole) => userRole.id === role.id
    );

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

        this.userService
          .updateUserImage(userId, imageFile, mimeType)
          .subscribe({
            next: () => {
              // Met à jour uniquement les détails de l'utilisateur après la mise à jour de l'image
              if (this.isAdmin) {
                this.toastMessage = 'Image du profil mise à jour avec succès';
                this.toastType = 'success';
                this.showToast = true;
              } else if (this.isUser) {
                this.toastMessage = 'Profil mis à jour avec succès';
                this.toastType = 'success';
                this.showToast = true;
              }
            },
            error: (error) => {
              this.toastMessage =
                "Une erreur s'est produite. Veuillez réessayer plus tard.";
              this.toastType = 'error';
              this.showToast = true;
              console.error('Erreur lors de la suppression du profil:', error);
            },
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
          console.log(this.isAdmin);
          this.toastMessage = 'Profil mise à jour avec succès';
          this.toastType = 'success';
          this.showToast = true;
        } else if (this.isUser) {
          this.toastMessage = 'Profil mis à jour avec succès';
          this.toastType = 'success';
          this.showToast = true;
        }
      },
      error: (error) => {
        this.toastMessage =
          "Une erreur s'est produite. Veuillez réessayer plus tard.";
        this.toastType = 'error';
        this.showToast = true;
        console.error('Erreur lors de la mise à jour du profil:', error);
      },
    });
  }

  onDeleteUser(userId: number) {
    if (!this.user || this.user.id !== userId) {
      return;
    }

    if (this.user.roles.some((role) => ['ADMIN'].includes(role.name))) {
      // Si l'utilisateur a le rôle ADMIN
      this.toastMessage =
        'La suppression est impossible pour les utilisateurs avec un rôle ADMIN';
      this.toastType = 'warning';
      this.showToast = true;
      this.canShowButton = false;
    } else {
      this.toastMessage = `Êtes-vous sûr de vouloir supprimer l'utilisateur "${this.user.username}" ?`;
      this.toastType = 'confirm';
      this.showToast = true;
      this.canShowButton = true;
      this.selectedUserId = userId;
    }
  }

  onToastConfirmed() {
    if (this.selectedUserId !== null) {
      this.userService.deleteUser(this.selectedUserId).subscribe({
        next: () => {
          this.logoutAfterDelete();
        },
        error: (error) => {
          this.toastMessage =
            "Une erreur s'est produite. Veuillez réessayer plus tard.";
          this.toastType = 'error';
          this.showToast = true;
          console.error('Erreur lors de la suppression du profil:', error);
        },
      });

      this.selectedUserId = null;
    }
  }

  logoutAfterDelete(): void {
    console.log('Removing tokens...');
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('refreshToken');
    this.router.navigate(['/home']);
  }

  goToUserlist() {
    this.router.navigateByUrl('user-list').then(() => {});
  }

  goToQuizlistUser() {
    if (this.user)
      this.router
        .navigateByUrl(`quiz/quiz-list-user/${this.user.id}`)
        .then(() => {});
  }
}
