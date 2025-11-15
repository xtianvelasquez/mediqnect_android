import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { environment } from 'src/environments/environment.prod';
import { LocalNotifications } from '@awesome-cordova-plugins/local-notifications/ngx';

@Injectable({
  providedIn: 'root'
})
export class AlarmService {
  ws!: WebSocket;
  max_retries = 10;
  retry_count = 0;

  constructor(
    private tokenService: TokenService,
    private localNotifications: LocalNotifications
  ) {
    this.connectWebSocket();
  }

  async connectWebSocket() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('WebSocket is already open. Skipping new connection.');
      return;
    }

    const active = this.tokenService.getActiveAccount();

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

      if (Array.isArray(data.alarms) && data.alarms.length > 0) {
        data.alarms.forEach((alarm: any) => {
          console.log('Scheduling notification for:', alarm);

          this.localNotifications.schedule({
            id: alarm.schedule_id,
            title: alarm.medicine_name || 'Medication Reminder',
            text: `Time to take your ${alarm.medicine_name}` || 'Time to take your medicine',
            trigger: { at: new Date() },
            foreground: true
          });
        });
      } else {
        console.warn('No alarm data received:', data.alarms);
      }
    };
    this.ws.onclose = (event) => {
      console.log(
        `WebSocket disconnected. Code: ${event.code}, Reason: ${event.reason}`
      );
      if (this.retry_count < this.max_retries) {
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

  closeWebSocket() {
    if (this.ws) {
      console.log('Closing WebSocket connection...');
      this.ws.close();
    }
  }
}
