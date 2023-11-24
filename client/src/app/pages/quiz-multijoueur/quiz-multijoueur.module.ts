import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuizMultijoueurRoutingModule } from './quiz-multijoueur-routing.module';
import { RoomComponent } from './components/room/room.component';

@NgModule({
  declarations: [
    RoomComponent
  ],
  imports: [
    CommonModule,
    QuizMultijoueurRoutingModule
  ]
})
export class QuizMultijoueurModule { }
