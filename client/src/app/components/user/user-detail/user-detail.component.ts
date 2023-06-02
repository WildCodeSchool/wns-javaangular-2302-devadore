import {Component, OnInit} from '@angular/core';
import {User} from "../../../models/user.model";
import {UserService} from "../../../services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Role} from "../../../models/role.model";
import {forkJoin} from "rxjs";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {

  allRoles!: Role[];
  userRoles!: Role[];

  user: User = {
    id: 0,
    username: '',
    email: '',
    password: '',
    score: 0,
    roles: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router, private domSanitizer: DomSanitizer) { }

  ngOnInit(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id') || '0', 10);

    forkJoin([this.userService.getAllRoles(), this.userService.getUserById(id)])
      .subscribe(([roles, user]) => {
        this.allRoles = roles;
        this.user = user;
        this.userRoles = user.roles;
        console.log(user);
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
  updateUser(user: User): void {
    this.userService.updateUser(user).subscribe({
      next: () => {
        alert('Profil mis à jour avec succès');
        this.router.navigate(['/user-list']);
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du profil:', error);
      }
    });
  }

  deleteUser(userId: number): void {
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        alert('Profil supprimé avec succès');
      },
      error: (error) => {
        console.error('Erreur lors de la suppression du profil:', error);
      }
    });
  }

}
