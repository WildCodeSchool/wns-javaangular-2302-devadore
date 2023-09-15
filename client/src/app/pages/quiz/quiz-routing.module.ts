import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuizPreviewComponent } from './components/quiz-preview/quiz-preview.component';
import { QuizPlayComponent } from './components/quiz-play/quiz-play.component';

const routes: Routes = [
  {path: 'preview', component: QuizPreviewComponent},
  {path: 'play/:id', component: QuizPlayComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuizRoutingModule { }
