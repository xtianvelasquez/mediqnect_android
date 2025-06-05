import { Component } from '@angular/core';
import { WebsocketService } from './services/websocket.service';
import { Platform } from '@ionic/angular';
import { AuthService } from './services/auth.service';
import { LocalNotifications } from '@awesome-cordova-plugins/local-notifications/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(
    private websocketService: WebsocketService,
    private platform: Platform,
    private authService: AuthService,
    private localNotifications: LocalNotifications
  ) {
    this.requestNotificationPermission();

    this.platform.ready().then(() => {
      if (this.platform.is('ios')) {
        this.requestNotificationPermission();
      }
    });
  }

  requestNotificationPermission() {
    this.localNotifications.hasPermission().then((granted) => {
      if (!granted) {
        this.localNotifications.requestPermission().then((result) => {
          if (result) {
            console.log('Notification permission granted!');
          } else {
            console.warn('Notification permission denied!');
          }
        });
      }
    });
  }

  async ngOnInit() {
    const active = await this.authService.getActiveAccount();

    if (active?.access_token && active?.user) {
      this.websocketService.connectWebSocket();
    } else {
      console.log('No token found, WebSocket will not start.');
    }
  }
}
