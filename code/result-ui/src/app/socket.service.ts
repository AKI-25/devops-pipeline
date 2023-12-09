import { Injectable, NgZone } from '@angular/core';
import { io } from 'socket.io-client';
import { Observable, fromEvent } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: any;

  constructor(private readonly ngZone: NgZone) {
    this.ngZone.runOutsideAngular(() => {
      this.socket = io('http://localhost:4000/', {
        reconnection: true,
        reconnectionDelay: 5000,
        reconnectionAttempts: 5,
      });
      this.on$('connection').subscribe();
    });
    
  }
  on$(channel: string) {
    return fromEvent(this.socket, channel);
  }

}
