import {Component, OnInit} from '@angular/core';
import {User} from "../../../models/user.model";
import {UserService} from "../../../services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Role} from "../../../models/role.model";
import {forkJoin} from "rxjs";


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

  user: User = {
    id: 0,
    username: '',
    email: '',
    password: '',
    image: '',
    score: 0,
    roles: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router) { }

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

  onImageSelected(event: Event) {
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
    if(this.user) {
      if(this.imageFile){
        this.userService.updateUserImage(this.user.id, this.imageFile).subscribe({
          next: () => {
            this.updateUserDetails();
            alert('Profil mis à jour avec succès');
            this.router.navigate(['/user-list']);
          },
          error: (error) => {
            console.error('Erreur lors de la mise à jour du profil:', error);
          }
        });
      } else {
        this.updateUserDetails();
      }
    }

  }
  private updateUserDetails(): void {
    this.userService.updateUser(this.user).subscribe({
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
