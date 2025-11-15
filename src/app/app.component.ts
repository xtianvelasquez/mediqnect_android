import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AlarmService } from './services/alarm.service';
import { TokenService } from './services/token.service';
import { LocalNotifications } from '@awesome-cordova-plugins/local-notifications/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private alarmService: AlarmService,
    private tokenService: TokenService,
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

  ngOnInit() {
    const active = this.tokenService.getActiveAccount();

    if (active?.access_token && active?.user) {
      this.alarmService.connectWebSocket();
    } else {
      console.log('No token found, WebSocket will not start.');
    }
  }
}
