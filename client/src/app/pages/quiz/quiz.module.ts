import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

import { QuizRoutingModule } from './quiz-routing.module';
import { QuizPreviewComponent } from './components/quiz-preview/quiz-preview.component';
import { QuizPlayComponent } from './components/quiz-play/quiz-play.component';
import { QuizCreateComponent } from './components/quiz-create/quiz-create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { QuizListUserComponent } from './components/quiz-list-user/quiz-list-user.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SharedModule } from '../../shared/shared.module';
import { QuizEditComponent } from './components/quiz-edit/quiz-edit.component';
import { QuizChooseCatComponent } from './components/quiz-choose-cat/quiz-choose-cat.component';
import { QuizHistoryComponent } from './components/quiz-history/quiz-history.component';

@NgModule({
  declarations: [
    QuizPreviewComponent,
    QuizPlayComponent,
    QuizCreateComponent,
    QuizListUserComponent,
    QuizEditComponent,
    QuizChooseCatComponent,
    QuizHistoryComponent,
  ],

  imports: [
    CommonModule,
    QuizRoutingModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    NgOptimizedImage,
    SharedModule,
  ],
})
export class QuizModule {}
