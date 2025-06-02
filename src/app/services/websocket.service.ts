import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  ws!: WebSocket;
  active = this.authService.getActiveAccount();

  constructor(private authService: AuthService) {
    this.connectWebSocket();
  }

  connectWebSocket() {
    this.ws = new WebSocket(
      `${environment.urls.ws}/ws?token=${this.active?.access_token}`
    );

    this.ws.onopen = () => console.log('WebSocket connected');
    this.ws.onmessage = (event) => {
      console.log('Message received:', event.data);
      const data = JSON.parse(event.data);

      if (data.alarms) {
        console.log(data.alarms);
      }
    };
    this.ws.onclose = (event) => {
      console.log(
        `WebSocket disconnected. Code: ${event.code}, Reason: ${event.reason}`
      );
      if ([1006, 1011].includes(event.code)) {
        console.log('Temporary issue, reconnecting in 5s...');
        setTimeout(() => this.connectWebSocket(), 5000);
      } else {
        console.warn('Permanent issue detected. No automatic reconnection.');
      }
    };
  }

  sendMessage(message: string) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(message);
    }
  }
}
