import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoomListComponent } from './components/room-list/room-list.component';
import { CreateRoomComponent } from './components/create-room/create-room.component';
import { WaitingRoomComponent } from './components/waiting-room/waiting-room.component';

const routes: Routes = [
  { path: "room-list", component: RoomListComponent },
  { path: "create", component: CreateRoomComponent },
  { path: "waiting-room", component: WaitingRoomComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuizMultijoueurRoutingModule { }
