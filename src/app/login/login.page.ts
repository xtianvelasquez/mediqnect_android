import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';
import { LoadService } from '../services/load.service';
import axios from 'axios';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  username: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private alertService: AlertService,
    private authService: AuthService,
    private loadService: LoadService
  ) {}

  signup() {
    this.router.navigate(['/signup']);
  }

  async login() {
    try {
      if (!this.username || !this.password) {
        await this.alertService.presentMessage(
          'Error!',
          'Please fill in the necessary field.'
        );
        return;
      }

      this.loadService.showLoading('Logging in...');

      const response = await axios.post(`${environment.urls.api}/token`, {
        username: this.username,
        password: this.password,
      });

      if (response.status === 200 || response.status === 201) {
        this.authService.addAccount(
          response.data.user,
          response.data.access_token
        );
        this.authService.switchAccount(response.data.user);
        console.log('Login successful!');
        this.router.navigate(['/tabs/tab2']);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const status = error.response.status;
          const detail = error.response.data?.detail;

          console.error('Status:', status);
          console.error('Detail:', detail);
          this.alertService.presentError(detail);
        } else if (error.request) {
          this.alertService.presentMessage(
            'Network Error!',
            'Could not reach the server. Check your internet connection or try again later.'
          );
        } else {
          this.alertService.presentError(error.message);
        }
      } else {
        this.alertService.presentMessage(
          'Error!',
          'An unexpected error occured. Please try again later.'
        );
      }
    } finally {
      this.loadService.hideLoading();
    }
  }
}
