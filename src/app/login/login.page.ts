import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotifService } from '../services/notif.service';
import { TokenService } from '../services/token.service';
import { AuthService } from '../api/auth.service';
import { environment } from 'src/environments/environment.prod';
import { Http } from '@capacitor-community/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  accounts: any = {};

  username: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private notifService: NotifService,
    private tokenService: TokenService,
    private authService: AuthService
  ) { }

  signup() {
    this.router.navigate(['/signup']);
  }

  async login() {
    this.notifService.showLoading('Logging in...');
    try {
      if (!this.username || !this.password) {
        await this.notifService.presentError(
          'Please fill in the necessary field.'
        );
        return;
      }

      const response = await this.authService.login(
        this.username,
        this.password
      );

      console.log('Login Response:', response);
      console.log('User:', response.user);
      console.log('Access Token:', response.access_token);

      // Process login success
      await this.tokenService.addAccount(response.user, response.access_token);
      this.tokenService.switchAccount(response.user);
      console.log('Login successful!');
      window.location.reload();
    } catch (error: any) {
      const message = error?.message || 'An unexpected error occurred.';
      await this.notifService.presentError(message);
    } finally {
      this.notifService.hideLoading();
    }
  }

  async getAccounts() {
    try {
      const saved_account = this.tokenService.getAccounts().map((account) => account.user);

      if (!saved_account) {
        console.log('No saved account yet.');
        return;
      }

      const options = {
        url: `${environment.urls.api}/get/accounts`,
        headers: { 'Content-Type': 'application/json' },
        params: {},
        data: { ids: saved_account },
      };

      const response = await Http.post(options);

      if (response.status === 200 || response.status === 201) {
        this.accounts = response.data;
      } else {
        this.notifService.presentError(
          response.data?.detail ||
          'Something went wrong. Please try again later.'
        );
      }
    } catch (error: any) {
      const detail =
        error?.response?.data?.detail ||
        error?.error?.detail ||
        error?.message ||
        'An unknown error occurred. Please try again later.';

      console.warn(detail);
    }
  }

  async switchToUser(user_id: string) {
    this.notifService.showLoading('Logging in...');
    try {
      this.tokenService.switchAccount(user_id);
      window.location.reload();
    } catch (error) {
      console.warn('Account switch failed:', error);
      await this.notifService.presentError(
        'Failed to switch account. Please try again later.'
      );
    } finally {
      this.notifService.hideLoading();
    }
  }

  ngOnInit() {
    this.getAccounts();
  }
}
