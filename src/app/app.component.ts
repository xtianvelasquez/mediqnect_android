import { Component } from '@angular/core';
import { WebsocketService } from './services/websocket.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  active = this.authService.getActiveAccount();

  constructor(
    private websocketService: WebsocketService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    if (this.active?.access_token && this.active?.user) {
      this.websocketService.connectWebSocket();
    } else {
      console.log('No token found, WebSocket will not start.');
    }
  }
}
