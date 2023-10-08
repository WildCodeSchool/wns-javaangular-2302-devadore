import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {QuizPreviewComponent} from './components/quiz-preview/quiz-preview.component';
import {QuizPlayComponent} from './components/quiz-play/quiz-play.component';
import {QuizCreateComponent} from "./components/quiz-create/quiz-create.component";
import {QuizListUserComponent} from "./components/quiz-list-user/quiz-list-user.component";
import {QuizEditComponent} from "./components/quiz-edit/quiz-edit.component";

const routes: Routes = [
  {path: 'preview', component: QuizPreviewComponent},
  {path: 'play/:id', component: QuizPlayComponent},
  {path: 'create-quiz', component: QuizCreateComponent},
  {path: 'quiz-list-user/:id', component: QuizListUserComponent},
  {path: 'edit-quiz/:id', component: QuizEditComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuizRoutingModule {
}
