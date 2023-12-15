import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuizPreviewComponent } from './components/quiz-preview/quiz-preview.component';
import { QuizPlayComponent } from './components/quiz-play/quiz-play.component';
import { QuizCreateComponent } from './components/quiz-create/quiz-create.component';
import { QuizListUserComponent } from './components/quiz-list-user/quiz-list-user.component';
import { QuizEditComponent } from './components/quiz-edit/quiz-edit.component';
import { UserOwnsProfileGuard } from '../../services/user.owns.profile.guard';
import { EditQuizGuard } from '../../services/edit.quiz.guard';
import { CreateQuizGuard } from '../../services/create.quiz.guard';
import { QuizChooseCatComponent } from './components/quiz-choose-cat/quiz-choose-cat.component';
import { QuizHistoryComponent } from './components/quiz-history/quiz-history.component';

const routes: Routes = [
  { path: 'preview', component: QuizPreviewComponent },
  { path: 'choose-cat', component: QuizChooseCatComponent },
  { path: 'play/:id', component: QuizPlayComponent },
  {
    path: 'create-quiz',
    component: QuizCreateComponent,
    canActivate: [CreateQuizGuard],
  },
  {
    path: 'quiz-list-user/:id',
    component: QuizListUserComponent,
    canActivate: [UserOwnsProfileGuard],
  },
  {
    path: 'edit-quiz/:id',
    component: QuizEditComponent,
    canActivate: [EditQuizGuard],
  },
  {
    path: 'quiz-history',
    component: QuizHistoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuizRoutingModule {}
