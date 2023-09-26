import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {User} from "../../../models/user.model";
import {UserService} from "../../../services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Role} from "../../../models/role.model";
import {forkJoin} from "rxjs";
import {ToastService} from "../../../services/toastService";
import {AuthService} from "../../../services/auth.service";
import {QuizModel} from "../../../models/quiz.model";
import {QuizService} from "../../../services/quiz.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";


@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit, AfterViewInit {

  allRoles!: Role[];
  userRoles!: Role[];
  imageFile?: File;
  previewUrl: any = null;
  isAdmin: boolean = false;
  isUser: boolean = false;
  user = {} as User;
  quizzes: QuizModel[] = [];

  dataSource = new MatTableDataSource<QuizModel>;
  displayedColumns: string[] = ['title', 'image', 'description', 'createdAt', 'updatedAt', 'action'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    console.log(this.dataSource instanceof MatTableDataSource);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private quizService: QuizService,
    private route: ActivatedRoute,
    private router: Router,
    public toastService: ToastService
  ) {
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
    this.quizService.getAllQuizzesCreatedByUser(id).subscribe(data => {
      this.quizzes = data;
      this.dataSource.data = this.quizzes;
      console.log('quizzes', data)
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
      // TODO Après avoir navigué vers la page d'accueil, ?????
    });
  }

  // fonction quui renvoie le nombre de quiz dans la liste
  countQuizzes(): number {
    return this.quizzes.length;
  }

  onDeleteQuiz(id: number) {
    this.quizService.deleteQuiz(id).subscribe(
      response => {
        this.quizzes = this.quizzes.filter(quiz => quiz.id !== id);
        this.dataSource = new MatTableDataSource(this.quizzes);
        this.paginator._changePageSize(this.paginator.pageSize);
        console.log('Quiz deleted successfully!');
      },
      error => {
        console.error('There was an error during the deletion:', error);
      }
    );
  }

}
