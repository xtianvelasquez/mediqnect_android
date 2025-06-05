import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AlertService } from '../services/alert.service';
import { AuthService } from '../services/auth.service';
import { LoadService } from '../services/load.service';
import { environment } from 'src/environments/environment';
import axios from 'axios';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class ProfilePage {
  user_data: any = {};
  accounts: any = {};

  new_username: string = '';
  new_password: string = '';
  confirm_password: string = '';
  password: string = '';

  showChangeUsernamePopup = false;
  showChangePasswordPopup = false;
  isSwitchUserModalOpen = false;
  isDisabled = false;

  constructor(
    private router: Router,
    private alertService: AlertService,
    private authService: AuthService,
    private loadService: LoadService
  ) {}

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

  openSwitchUserModal() {
    this.isSwitchUserModalOpen = true;
  }

  closeSwitchUserModal() {
    this.isSwitchUserModalOpen = false;
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

  validateUsernameChangeInput() {
    if (!this.new_username || !this.password)
      return 'Please fill the necessary field.';

    if (this.new_username.length < 6 || this.new_username.length > 50)
      return 'Username must be at least 6 and at most 50 characters long.';

    return null;
  }

  validatePasswordChangeInput() {
    if (!this.new_password || !this.confirm_password || !this.password)
      return 'Please fill the necessary field.';

    if (this.new_password != this.confirm_password)
      return 'Password does not match with the confirmation password. Please try again.';

    if (this.new_password.length < 6 || this.new_password.length > 50)
      return 'Password must be at least 6 and at most 50 characters long.';

    return null;
  }

  switchToUser(user_id: string) {
    if (this.accounts.user === user_id) {
      this.isDisabled = true;
    } else {
      this.isDisabled = false;
    }

    this.authService.switchAccount(user_id);
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

  async getUserData() {
    try {
      const active = await this.authService.getActiveAccount();

      if (!active?.access_token || !active?.user) {
        await this.alertService.presentMessage(
          'Error!',
          'No access token found.'
        );
        this.router.navigate(['/login']);
        return;
      }

      const response = await axios.get(`${environment.urls.api}/read/user`, {
        headers: {
          Authorization: `Bearer ${active.access_token}`,
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
      const active = await this.authService.getActiveAccount();

      if (!active?.access_token || !active?.user) {
        await this.alertService.presentMessage(
          'Error!',
          'No access token found.'
        );
        this.router.navigate(['/login']);
        return;
      }

      const input_error = this.validateUsernameChangeInput();
      if (input_error) {
        await this.alertService.presentMessage('Error!', input_error);
        return;
      }

      this.loadService.showLoading('Please wait...');

      const response = await axios.post(
        `${environment.urls.api}/update/username`,
        {
          username: this.new_username,
          password: this.password,
        },
        {
          headers: {
            Authorization: `Bearer ${active.access_token}`,
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
    } finally {
      this.loadService.hideLoading();
    }
  }

  async savePasswordChange() {
    try {
      const active = await this.authService.getActiveAccount();

      if (!active?.access_token || !active?.user) {
        await this.alertService.presentMessage(
          'Error!',
          'No access token found.'
        );
        this.router.navigate(['/login']);
        return;
      }

      const input_error = this.validatePasswordChangeInput();
      if (input_error) {
        await this.alertService.presentMessage('Error!', input_error);
        return;
      }

      this.loadService.showLoading('Please wait...');

      const response = await axios.post(
        `${environment.urls.api}/update/password`,
        {
          new_password: this.new_password,
          password: this.password,
        },
        {
          headers: {
            Authorization: `Bearer ${active.access_token}`,
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
    } finally {
      this.loadService.hideLoading();
    }
  }

  async logout() {
    try {
      const active = await this.authService.getActiveAccount();

      if (!active?.access_token || !active?.user) {
        await this.alertService.presentMessage(
          'Error!',
          'No access token found.'
        );
        this.router.navigate(['/login']);
        return;
      }

      this.loadService.showLoading('Logging out...');

      const response = await axios.post(
        `${environment.urls.api}/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${active.access_token}`,
          },
        }
      );

      if (response.status === 204) {
        this.authService.removeAccount(active.user);
        window.location.reload();
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
    } finally {
      this.loadService.hideLoading();
    }
  }

  ngOnInit() {
    this.getUserData();
    this.getAccounts();
  }
}
