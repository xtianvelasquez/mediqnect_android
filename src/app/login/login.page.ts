import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { AuthService } from '../services/auth.service';
import { LoadService } from '../services/load.service';
import { EntryService } from '../api/entry.service';
import { environment } from 'src/environments/environment';
import axios from 'axios';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  accounts: any = {};

  username: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private alertService: AlertService,
    private authService: AuthService,
    private loadService: LoadService,
    private entryService: EntryService
  ) {}

  signup() {
    this.router.navigate(['/signup']);
  }

  async login() {
    try {
      if (!this.username || !this.password) {
        await this.alertService.presentError(
          'Please fill in the necessary field.'
        );
        return;
      }

      this.loadService.showLoading('Logging in...');

      const response = await this.entryService.login(
        this.username,
        this.password
      );

      // Process login success
      this.authService.addAccount(response.user, response.access_token);
      this.authService.switchAccount(response.user);
      console.log('Login successful!');
      window.location.reload();
    } catch (error: any) {
      await this.alertService.presentError(error.message);
    } finally {
      this.loadService.hideLoading();
    }
  }

  async getAccounts() {
    try {
      const saved_account = await this.authService.getAccounts();

      if (!saved_account) {
        return;
      }

      const response = await axios.post(
        `${environment.urls.api}/get/accounts`,
        {
          ids: saved_account,
        }
      );

      if (response.status === 200 || response.status === 201) {
        this.accounts = response.data;
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  }

  async switchToUser(user_id: string) {
    try {
      this.authService.switchAccount(user_id);
      window.location.reload();
    } catch (error) {
      console.error('Account switch failed:', error);
      await this.alertService.presentError(
        'Failed to switch account. Please try again later.'
      );
    }
  }

  ngOnInit() {
    this.getAccounts();
  }
}
