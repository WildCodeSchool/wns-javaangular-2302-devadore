import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';

import {MatTableModule} from "@angular/material/table";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    UserComponent,
    UserListComponent,
    UserDetailComponent
  ],
    imports: [
        CommonModule,
        UserRoutingModule,
        FormsModule,
        MatTableModule,
        MatButtonModule,
        MatInputModule
    ]
})
export class UserModule { }
