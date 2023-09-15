import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {User} from "../../../models/user.model";
import {UserService} from "../../../services/user.service";
import {AuthService} from "../../../services/auth.service";
import {MatTableDataSource} from "@angular/material/table";
import {tap} from "rxjs/operators";
import {catchError, of} from "rxjs";
import {ToastService} from "../../../services/toastService";
import {MatSort, Sort} from "@angular/material/sort";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {MatPaginator} from "@angular/material/paginator";

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements AfterViewInit {

    displayedColumns: string[] = ['avatar', 'id', 'username', 'email', 'roles', 'actions', 'createdAt', 'updatedAt'];
    dataSource = new MatTableDataSource<User>;

    constructor(private userService: UserService, private router: Router, private authService: AuthService, public toastService: ToastService, private _liveAnnouncer: LiveAnnouncer) {
    }

    /*    ngOnInit(): void {
            /!*  this.loadUsers();*!/
        }*/
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    ngAfterViewInit() {
        this.loadUsers();
        console.log(this.dataSource instanceof MatTableDataSource);
        this.dataSource.sort = this.sort;
        console.log('actvie: ', this.dataSource.sort.active);
        console.log(this.dataSource.sort.direction);
    }

    loadUsers(): void {
        const jwtToken = this.authService.getToken();

        if (jwtToken) {
            this.userService.getUsers().pipe(
                tap(users => {
                    this.dataSource = new MatTableDataSource(users);
                    console.log('userlist: ', users);
                    console.log(this.dataSource instanceof MatTableDataSource);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                    console.log('actvie: ', this.dataSource.sort.active);
                    console.log(this.dataSource.sort.direction);
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
        const user = this.dataSource.data.find(u => u.id === userId);

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
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    goToHome() {
        this.router.navigateByUrl('../home').then(() => {
            // Après avoir navigué vers la page d'accueil, déclenchez la vérification
        });
    }

}
