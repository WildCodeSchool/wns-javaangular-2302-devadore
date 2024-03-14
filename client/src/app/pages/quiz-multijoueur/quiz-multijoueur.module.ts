import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuizMultijoueurRoutingModule } from './quiz-multijoueur-routing.module';
import { RoomListComponent } from './components/room-list/room-list.component';
import { CreateRoomComponent } from './components/create-room/create-room.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WaitingRoomComponent } from './components/waiting-room/waiting-room.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    RoomListComponent,
    CreateRoomComponent,
    WaitingRoomComponent
  ],
  imports: [
    CommonModule,
    QuizMultijoueurRoutingModule,
    FormsModule,
    FontAwesomeModule,
    ReactiveFormsModule
  ]
})
export class QuizMultijoueurModule { }
