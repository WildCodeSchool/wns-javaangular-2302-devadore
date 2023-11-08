import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserComponent} from './user.component';
import {UserListComponent} from "./user-list/user-list.component";
import {UserDetailComponent} from "./user-detail/user-detail.component";
import {UserOwnsProfileGuard} from "../../services/user.owns.profile.guard";

const routes: Routes = [
  {path: 'user', component: UserComponent},
  {path: 'user-list', component: UserListComponent, canActivate: [UserOwnsProfileGuard]},
  {path: `user-detail/:id`, component: UserDetailComponent, canActivate: [UserOwnsProfileGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {
}
