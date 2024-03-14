import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Room } from '../models/room.model';
import { Router } from '@angular/router';
import {environment} from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class RoomWebsocketService {

  private webSocket: WebSocket;
  private roomsSubject = new Subject<string[]>();
  rooms$ = this.roomsSubject.asObservable();
  private newPlayerSubject = new Subject<any>();
  newPlayer$ = this.newPlayerSubject.asObservable();

  constructor(private router: Router) { }

  connectWebSocket(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.webSocket = new WebSocket('ws://'+ environment.URL+'/websocket/room');

      this.webSocket.onopen = () => {
        console.log("Connexion websocket réussi");
        resolve();
      };

      this.webSocket.onclose = () => {
        this.webSocket.close();
      }

      this.webSocket.onerror = (error) => {
        console.error("WebSocket error:", error);
        reject(error);
      };

      this.webSocket.onmessage = (event) => {
        console.log(event);
        // console.log(this.webSocket.readyState);

        if (event.data !== "X") {
          const data = JSON.parse(event.data);

          switch (data.type) {
            case 'FETCHING_ROOM_LIST':
              this.roomsSubject.next(data.rooms);
              console.log(data.rooms);
              break;
            case 'NEW_PLAYER_JOINED':
              this.newPlayerSubject.next(data);
              break;
            case 'CURRENT_PLAYERS':
              this.newPlayerSubject.next(data);
              break;
            case 'UPDATED_PLAYER_LIST':
              this.newPlayerSubject.next(data);
              break;
          }
        }
      };
    });
  }

  getRoomInfos(){

    this.connectWebSocket().then((): void => {
      const message = { messageType: 'GET_ROOM_INFOS'};
      this.webSocket.send(JSON.stringify(message));
    })
  }

  fetchRoom() {
    const message = { messageType: 'FETCH_ROOM'};
    this.webSocket.send(JSON.stringify(message));
  }

  createRoom(newRoom: Room): void {
    this.connectWebSocket().then(() => {
      const message = JSON.stringify({
        messageType: 'CREATE_ROOM',
        room: newRoom
      });
      console.log(message)
      this.webSocket.send(message);
      this.router.navigate(['/multijoueur/waiting-room']);
    });
  }

  joinRoom(roomName: String, username: String): void {
    const message = { messageType: 'JOIN_ROOM', roomName: roomName, username: username };
    console.log(message);
    this.webSocket.send(JSON.stringify(message));
    this.router.navigate(['/multijoueur/waiting-room']);
  }

}
