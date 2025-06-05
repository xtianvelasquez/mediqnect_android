import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';

import { LocalNotifications } from '@awesome-cordova-plugins/local-notifications/ngx';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  ws!: WebSocket;
  max_retries = 10;
  retry_count = 0;

  constructor(
    private authService: AuthService,
    private localNotifications: LocalNotifications
  ) {
    this.connectWebSocket();
  }

  async connectWebSocket() {
    if (this.ws && this.ws.readyState !== WebSocket.CLOSED) {
      console.log('WebSocket is already running. Skipping new connection.');
      return;
    }

    const active = await this.authService.getActiveAccount();

    if (!active?.access_token || !active?.user) {
      console.log('No active session, WebSocket will not start.');
      return;
    }

    this.ws = new WebSocket(
      `${environment.urls.ws}/ws?token=${active?.access_token}`
    );

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.retry_count = 0;
    };
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
      if (
        [1006, 1011].includes(event.code) &&
        this.retry_count < this.max_retries
      ) {
        this.retry_count++;
        console.log(
          `Temporary issue, reconnecting in 5s... (Attempt ${this.retry_count})`
        );
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
