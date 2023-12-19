import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Room } from '../models/room.model';

@Injectable({
  providedIn: 'root'
})
export class RoomWebsocketService {

  private webSocket: WebSocket;
  private roomsSubject = new Subject<string[]>();
  rooms$ = this.roomsSubject.asObservable();


  constructor() { }

  connectWebSocket(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.webSocket = new WebSocket('ws://localhost:8080/websocket/room');
  
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

        if (event.data != "X") {
          const data = JSON.parse(event.data);
    
          if (data.type === 'FETCHING_ROOM_LIST') {
            this.roomsSubject.next(data.rooms); 
            console.log("Received FETCHING_ROOM_LIST:", data.rooms);
          }
        }
      };
    });
  }  

  getRoomInfos(){
    
    this.connectWebSocket().then(() => {
      const message = { messageType: 'GET_ROOM_INFOS'};
      this.webSocket.send(JSON.stringify(message));
    })
  }

  fetchRoom() {
    const message = { messageType: 'FETCH_ROOM'};
    this.webSocket.send(JSON.stringify(message));
  }

  createRoom(newRoom: Room) {
    this.connectWebSocket().then(() => {
      const message = { messageType: 'CREATE_ROOM', roomName: newRoom.name, creator: newRoom.creator, categorie: newRoom.categorie };
      console.log(message);
      this.webSocket.send(JSON.stringify(message));
    });
  }

}
