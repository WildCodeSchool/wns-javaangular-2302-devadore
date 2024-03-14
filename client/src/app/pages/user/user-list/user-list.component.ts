import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {User} from '../../../models/user.model';
import {UserService} from '../../../services/user.service';
import {AuthService} from '../../../services/auth.service';
import {MatTableDataSource} from '@angular/material/table';
import {tap} from 'rxjs/operators';
import {catchError, of} from 'rxjs';
import {ToastService} from '../../../services/toastService';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements AfterViewInit {
  User = {} as User;
  showToast = false;
  toastMessage: string;
  toastType: 'confirm' | 'success' | 'error' | 'warning';
  canShowButton: boolean = false;
  selectedUserId: number | null = null;

  displayedColumns: string[] = [
    'avatar',
    'id',
    'username',
    'email',
    'roles',
    'createdAt',
    'updatedAt',
    'actions',
  ];
  dataSource = new MatTableDataSource<User>();

  constructor(
    private userService: UserService,
    private router: Router,
    private authService: AuthService,
    public toastService: ToastService
  ) {
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.loadUsers();
    this.dataSource.sort = this.sort;
  }

  loadUsers(): void {
    const jwtToken = this.authService.getToken();

    if (jwtToken) {
      this.userService
        .getUsers()
        .pipe(
          tap((users) => {
            this.dataSource = new MatTableDataSource(users);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }),
          catchError((error) => {
            console.error(error);
            return of([]);
          })
        )
        .subscribe();
    } else {
      console.error('Pas de jeton JWT trouvé.');
    }
  }

  editUser(userId: number): void {
    this.router.navigate(['/user-detail', userId]);
  }

  onDeleteUser(userId: number) {
    const userToDelete = this.dataSource.data.find((u) => u.id === userId);
    if (!userToDelete) {
      console.error('User not found');
      return;
    }

    if (
      userToDelete.roles &&
      userToDelete.roles.some((role) => role.name === 'ADMIN')
    ) {
      // Si l'utilisateur a le rôle ADMIN
      this.toastMessage =
        'La suppression est impossible pour les utilisateurs avec un rôle ADMIN';
      this.toastType = 'warning';
      this.showToast = true;
      this.canShowButton = false;
    } else {
      this.toastMessage = `Êtes-vous sûr de vouloir supprimer l'utilisateur "${userToDelete.username}" ?`;
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
          this.loadUsers();
          this.showToast = false;
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  countUser(): number {
    return this.dataSource.data.length;
  }
}
