import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';

import {FormsModule} from "@angular/forms";

import {UserRoutingModule} from './user-routing.module';
import {UserComponent} from './user.component';
import {UserListComponent} from './user-list/user-list.component';
import {UserDetailComponent} from './user-detail/user-detail.component';

import {MatTableModule} from "@angular/material/table";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatSortModule} from "@angular/material/sort";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatCheckboxModule} from "@angular/material/checkbox";


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
        MatCheckboxModule,
        MatInputModule,
        MatSortModule,
        NgOptimizedImage,
        MatPaginatorModule
    ]

})
export class UserModule {
}
