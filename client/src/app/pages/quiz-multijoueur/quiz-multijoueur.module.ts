import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuizMultijoueurRoutingModule } from './quiz-multijoueur-routing.module';
import { RoomListComponent } from './components/room-list/room-list.component';
import { CreateRoomComponent } from './components/create-room/create-room.component';
import { FormsModule } from '@angular/forms';
import { WaitingRoomComponent } from './components/waiting-room/waiting-room.component';

@NgModule({
  declarations: [
    RoomListComponent,
    CreateRoomComponent,
    WaitingRoomComponent
  ],
  imports: [
    CommonModule,
    QuizMultijoueurRoutingModule,
    FormsModule
  ]
})
export class QuizMultijoueurModule { }
