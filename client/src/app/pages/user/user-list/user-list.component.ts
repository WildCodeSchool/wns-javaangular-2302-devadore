import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {User} from "../../../models/user.model";
import {UserService} from "../../../services/user.service";
import {AuthService} from "../../../services/auth.service";
import {MatTableDataSource} from "@angular/material/table";
import {tap} from "rxjs/operators";
import {catchError, of} from "rxjs";
import {ToastService} from "../../../services/toastService";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  users!: MatTableDataSource<User>;
  displayedColumns: string[] = ['avatar', 'id', 'username', 'email', 'roles', 'actions', 'createdAt', 'updatedAt'];
  
  constructor(private userService: UserService, private router: Router, private authService: AuthService, public toastService: ToastService) {
  }

  ngOnInit(): void {
    this.loadUsers();
  }


  loadUsers(): void {
    const jwtToken = this.authService.getToken();

    if (jwtToken) {
      this.userService.getUsers().pipe(
        tap(users => {
          this.users = new MatTableDataSource(users);
          console.log('userlist: ', users);
        }),
        catchError(error => {
          console.error(error);
          return of([]);
        })
      ).subscribe();
    } else {
      console.error('Pas de jeton JWT trouvé.');
    }
  }

  updateUser(user: User): void {
    this.userService.updateUser(user).subscribe(() => {
      this.loadUsers();
    });
  }

  editUser(userId: number): void {
    this.router.navigate(['/user-detail', userId]);
  }

  addUser(user: User): void {
    this.userService.createUser(user).subscribe(() => {
      this.loadUsers();
    });
  }

  deleteUser(userId: number): void {
    // Trouvez l'utilisateur par son ID dans la liste des utilisateurs
    const user = this.users.data.find(u => u.id === userId);

    // Si l'utilisateur a été trouvé et que son rôle est "admin", arrêtez la fonction ici
    if (user && user.roles.some(role => role.name === 'ADMIN')) {
      this.toastService.showToast('Impossible de supprimer un utilisateur ADMIN', 'error');
      return;
    }

    // Si l'utilisateur n'est pas un admin, continuez avec la suppression
    this.userService.deleteUser(userId).subscribe(() => {
      this.toastService.showToast('Profil supprimé avec succès', 'success');
      this.loadUsers();
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.users.filter = filterValue.trim().toLowerCase();
  }

  goToHome() {
    this.router.navigateByUrl('../home').then(() => {
      // Après avoir navigué vers la page d'accueil, déclenchez la vérification
    });
  }

}
