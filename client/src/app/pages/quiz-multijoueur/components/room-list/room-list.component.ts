import { Component, OnInit } from '@angular/core';
import { RoomWebsocketService } from 'src/app/services/room-websocket.service';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss']
})
export class RoomListComponent implements OnInit {

  rooms: any[] = [];
  username: string;
  roomName: string;
  faExclamationCircle = faExclamationCircle;

  constructor(
    private roomWebsocketService: RoomWebsocketService,
    private authService: AuthService) {}

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

  joinRoom(roomName: String): void {

    const token = this.authService.getToken();
    if(token){
      const decodedToken = this.authService.decodeToken(token);
      this.username = decodedToken.sub;
    } else {
      console.log("Pas de token");
    }

    this.roomWebsocketService.joinRoom(roomName, this.username);
  }
}
