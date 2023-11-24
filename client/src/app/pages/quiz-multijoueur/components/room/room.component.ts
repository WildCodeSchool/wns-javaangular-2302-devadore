import { Component } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent {
  
  webSocketSubject!: WebSocketSubject<any>;

  constructor() {}

  connectToWebSocket(): void {
    this.webSocketSubject = webSocket('ws://localhost:8080/websocket/room');

    this.webSocketSubject.subscribe({
      next: (msg) => console.log('message reçu: ', msg),
      error: (err) => console.error(err),
      complete: () => console.log('complete')
    });    
  }

  closeConnection(): void {
    if (this.webSocketSubject) {
      this.webSocketSubject.complete();
    }
  }
}
