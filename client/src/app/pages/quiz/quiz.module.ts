import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {QuizRoutingModule} from './quiz-routing.module';
import {QuizPreviewComponent} from './components/quiz-preview/quiz-preview.component';
import {QuizPlayComponent} from './components/quiz-play/quiz-play.component';
import {QuizCreateComponent} from './components/quiz-create/quiz-create.component';
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    QuizPreviewComponent,
    QuizPlayComponent,
    QuizCreateComponent
  ],
  imports: [
    CommonModule,
    QuizRoutingModule,
    ReactiveFormsModule
  ]
})
export class QuizModule {
}
