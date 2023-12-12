import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuizMultijoueurRoutingModule } from './quiz-multijoueur-routing.module';
import { RoomComponent } from './components/room/room.component';
import { CreateRoomComponent } from './components/create-room/create-room.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    RoomComponent,
    CreateRoomComponent
  ],
  imports: [
    CommonModule,
    QuizMultijoueurRoutingModule,
    FormsModule
  ]
})
export class QuizMultijoueurModule { }
