import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';

import { LocalNotifications } from '@awesome-cordova-plugins/local-notifications/ngx';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  ws!: WebSocket;
  active = this.authService.getActiveAccount();

  constructor(
    private authService: AuthService,
    private localNotifications: LocalNotifications
  ) {
    this.connectWebSocket();
  }

  async connectWebSocket() {
    const active = await this.authService.getActiveAccount();

    this.ws = new WebSocket(
      `${environment.urls.ws}/ws?token=${active?.access_token}`
    );

    this.ws.onopen = () => console.log('WebSocket connected');
    this.ws.onmessage = (event) => {
      console.log('Message received:', event.data);
      const data = JSON.parse(event.data);

      if (
        data.alarms &&
        typeof data.alarms === 'object' &&
        Object.keys(data.alarms).length > 0
      ) {
        console.log(data.alarms);

        this.localNotifications.schedule({
          id: data.alarms.schedule_id,
          title: data.alarms.medicine_name,
          text: data.alarms.medicine_name,
          trigger: { at: new Date() },
          sound: 'file://alarm',
          led: 'FF0000',
          vibrate: true,
          foreground: true,
        });
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
