import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';
import axios from 'axios';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage {
  user_data: any = {};

  new_username: string = '';
  new_password: string = '';
  confirm_password: string = '';
  password: string = '';

  token: string = localStorage.getItem('access_token') || '';

  showChangeUsernamePopup = false;
  showChangePasswordPopup = false;

  constructor(private router: Router, private alertService: AlertService) {}

  openChangeUsernamePopup() {
    this.resetUsernamePopup();
    this.showChangeUsernamePopup = true;
  }

  closeChangeUsernamePopup() {
    this.showChangeUsernamePopup = false;
  }

  openChangePasswordPopup() {
    this.resetPasswordPopup();
    this.showChangePasswordPopup = true;
  }

  closeChangePasswordPopup() {
    this.showChangePasswordPopup = false;
  }

  private resetUsernamePopup() {
    this.new_username = '';
    this.password = '';
  }

  private resetPasswordPopup() {
    this.new_password = '';
    this.confirm_password = '';
    this.password = '';
  }

  async getUserData() {
    try {
      if (!this.token) {
        await this.alertService.presentMessage(
          'Error!',
          'No access token found.'
        );
        this.router.navigate(['/login']);
        return;
      }

      const response = await axios.get('http://127.0.0.1:8000/user', {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        this.user_data = response.data;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  async saveUsernameChange() {
    try {
      if (!this.token) {
        await this.alertService.presentMessage(
          'Error!',
          'No access token found.'
        );
        this.router.navigate(['/login']);
        return;
      }

      if (!this.new_username || !this.password) {
        await this.alertService.presentMessage(
          'Error!',
          'Please fill the necessary field.'
        );
        return;
      }

      if (this.new_username.length < 6 || this.new_username.length > 50) {
        await this.alertService.presentMessage(
          'Error!',
          'Username must be at least 6 and at most 50 characters long.'
        );
        return;
      }

      const response = await axios.post(
        'http://127.0.0.1:8000/username',
        {
          username: this.new_username,
          password: this.password,
        },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        await this.alertService.presentMessage(
          'Success!',
          response.data.message
        );
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
    }
  }

  async savePasswordChange() {
    try {
      if (!this.token) {
        await this.alertService.presentMessage(
          'Error!',
          'No access token found'
        );
        this.router.navigate(['/login']);
        return;
      }

      if (!this.new_password || !this.confirm_password || !this.password) {
        await this.alertService.presentMessage(
          'Error!',
          'Please fill the necessary field.'
        );
        return;
      }

      if (this.new_password != this.confirm_password) {
        await this.alertService.presentMessage(
          'Error!',
          'Password does not match with the confirmation password. Please try again.'
        );
        return;
      }

      if (this.new_password.length < 6 || this.new_password.length > 50) {
        await this.alertService.presentMessage(
          'Error!',
          'Password must be at least 6 and at most 50 characters long.'
        );
        return;
      }

      const response = await axios.post(
        'http://127.0.0.1:8000/password',
        {
          new_password: this.new_password,
          password: this.password,
        },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        await this.alertService.presentMessage(
          'Success!',
          response.data.message
        );
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
    }
  }

  async logout() {
    try {
      if (!this.token) {
        await this.alertService.presentMessage(
          'Error!',
          'No access token found.'
        );
        this.router.navigate(['/login']);
        return;
      }

      const response = await axios.post(
        'http://127.0.0.1:8000/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );

      if (response.status === 204) {
        await this.alertService.presentMessage(
          'Success!',
          response.data.message
        );
        localStorage.removeItem('access_token');
        this.router.navigate(['/login']);
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
          'Error',
          'An unexpected error occured. Please try again later.'
        );
      }
    }
  }

  ngOnInit() {
    this.getUserData();
  }
}
