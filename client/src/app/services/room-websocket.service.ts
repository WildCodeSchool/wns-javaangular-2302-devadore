import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

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
        console.log(event.data);
        console.log(this.webSocket.readyState);

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

  fetchRoom() {
    const message = { messageType: 'FETCH_ROOM'};
    this.webSocket.send(JSON.stringify(message));
  }

  createRoom(creator: string, roomName: string) {
    const message = { messageType: 'CREATE_ROOM', roomName: roomName, creator: creator };
    this.webSocket.send(JSON.stringify(message));
  }

}
