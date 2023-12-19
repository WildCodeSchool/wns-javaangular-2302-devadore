import { Component, OnInit } from '@angular/core';
import { RoomWebsocketService } from 'src/app/services/room-websocket.service';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss']
})
export class RoomListComponent implements OnInit {

  rooms: any[] = [];
  creator: string;
  roomName: string;

  constructor(private roomWebsocketService: RoomWebsocketService) {}

  ngOnInit(): void {
    this.roomWebsocketService.connectWebSocket().then(() => {
      this.roomWebsocketService.fetchRoom();
    }).catch(error => {
      console.error("Erreur de connexion au Websocket :", error);
    });
  
    this.roomWebsocketService.rooms$.subscribe(rooms => {
      this.rooms = rooms;
      console.log("Rooms updated:", this.rooms);
    });
  }
  
  createRoom(): void {
    this.roomWebsocketService.createRoom(this.creator, this.roomName);
  }

}
