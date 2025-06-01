import { Component } from '@angular/core';
import { WebsocketService } from './services/websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  get token(): string {
    return localStorage.getItem('access_token') || '';
  }

  constructor(private websocketService: WebsocketService) {}

  ngOnInit() {
    if (this.token) {
      this.websocketService.connectWebSocket();
    } else {
      console.log('No token found, WebSocket will not start.');
    }
  }
}
