import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';

import {QuizRoutingModule} from './quiz-routing.module';
import {QuizPreviewComponent} from './components/quiz-preview/quiz-preview.component';
import {QuizPlayComponent} from './components/quiz-play/quiz-play.component';
import {QuizCreateComponent} from './components/quiz-create/quiz-create.component';
import {ReactiveFormsModule} from "@angular/forms";
import {QuizListUserComponent} from './components/quiz-list-user/quiz-list-user.component';
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import {MatTableModule} from "@angular/material/table";
import {SharedModule} from "../../shared/shared.module";


@NgModule({
  declarations: [
    QuizPreviewComponent,
    QuizPlayComponent,
    QuizCreateComponent,
    QuizListUserComponent
  ],
  imports: [
    CommonModule,
    QuizRoutingModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    NgOptimizedImage,
    SharedModule
  ]
})
export class QuizModule {
}
