import { Component, OnInit } from '@angular/core';
import { RoomWebsocketService } from 'src/app/services/room-websocket.service';

@Component({
  selector: 'app-waiting-room',
  templateUrl: './waiting-room.component.html',
  styleUrls: ['./waiting-room.component.scss']
})
export class WaitingRoomComponent implements OnInit {

  usernames: String[] = [];

  constructor(private roomWebsocketService: RoomWebsocketService){}

  ngOnInit(): void {
    this.roomWebsocketService.newPlayer$.subscribe(data => {
      this.usernames.push(data.username);
    });
  }

}
