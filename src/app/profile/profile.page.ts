import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AlertService } from '../services/alert.service';
import { AuthService } from '../services/auth.service';
import { LoadService } from '../services/load.service';
import { EntryService } from '../api/entry.service';
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

  username: string = '';
  new_username: string = '';
  new_password: string = '';
  confirm_password: string = '';
  password: string = '';

  showChangeUsernamePopup = false;
  showChangePasswordPopup = false;
  isSwitchUserModalOpen = false;
  showAddUserPopup = false;

  constructor(
    private router: Router,
    private alertService: AlertService,
    private authService: AuthService,
    private loadService: LoadService,
    private entryService: EntryService
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

  openAddUserPopup() {
    this.resetAddUserPopup();
    this.showAddUserPopup = true;
  }

  closeAddUserPopup() {
    this.showAddUserPopup = false;
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

  private resetAddUserPopup() {
    this.username = '';
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

  async switchToUser(user_id: string) {
    this.loadService.showLoading('Loading profile...');
    try {
      const active = await this.authService.getActiveAccount();

      if (user_id === active?.user) {
        await this.alertService.presentError(
          "You're already using this account."
        );
        return;
      }

      this.authService.switchAccount(user_id);
      window.location.reload();
    } catch (error) {
      console.error('Account switch failed:', error);
      await this.alertService.presentError(
        'Failed to switch account. Please try again later.'
      );
    } finally {
      this.loadService.hideLoading();
    }
  }

  async addNewAccount() {
    this.loadService.showLoading('Adding profile...');
    try {
      const saved_account = await this.authService.getAccounts();

      if (saved_account.length > 6) {
        await this.alertService.presentError(
          'Maximum account limit reached. You can only save 6 accounts for quick switching.'
        );
        return;
      }

      if (!this.username || !this.password) {
        await this.alertService.presentError(
          'Please fill in the necessary field.'
        );
        return;
      }

      const response = await this.entryService.login(
        this.username,
        this.password
      );

      // Process login success
      this.authService.addAccount(response.user, response.access_token);
      this.authService.switchAccount(response.user);
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

  async getUserData() {
    try {
      const active = await this.authService.getActiveAccount();

      if (!active?.access_token || !active?.user) {
        await this.alertService.presentError('No access token found.');
        this.router.navigate(['/login']);
        return;
      }

      const response = await this.entryService.getUserData(active.access_token);
      this.user_data = response;
    } catch (error: any) {
      await this.alertService.presentError(error.message);
    }
  }

  async saveUsernameChange() {
    try {
      const active = await this.authService.getActiveAccount();

      if (!active?.access_token || !active?.user) {
        await this.alertService.presentError('No access token found.');
        this.router.navigate(['/login']);
        return;
      }

      const input_error = this.validateUsernameChangeInput();
      if (input_error) {
        await this.alertService.presentError(input_error);
        return;
      }

      this.loadService.showLoading('Please wait...');

      const response = await this.entryService.saveUsernameChange(
        active.access_token,
        this.new_username,
        this.password
      );

      await this.alertService.presentMessage(response);
      this.getUserData();
    } catch (error: any) {
      await this.alertService.presentError(error.message);
    } finally {
      this.loadService.hideLoading();
    }
  }

  async savePasswordChange() {
    try {
      const active = await this.authService.getActiveAccount();

      if (!active?.access_token || !active?.user) {
        await this.alertService.presentError('No access token found.');
        this.router.navigate(['/login']);
        return;
      }

      const input_error = this.validatePasswordChangeInput();
      if (input_error) {
        await this.alertService.presentError(input_error);
        return;
      }

      this.loadService.showLoading('Please wait...');

      const response = await this.entryService.savePasswordChange(
        active.access_token,
        this.new_password,
        this.password
      );
      await this.alertService.presentMessage(response);
    } catch (error: any) {
      await this.alertService.presentError(error.message);
    } finally {
      this.loadService.hideLoading();
    }
  }

  async logout() {
    try {
      const active = await this.authService.getActiveAccount();

      if (!active?.access_token || !active?.user) {
        await this.alertService.presentError('No access token found.');
        this.router.navigate(['/login']);
        return;
      }

      this.loadService.showLoading('Logging out...');

      const response = await this.entryService.logout(active.access_token);
      this.authService.removeAccount(active.user);
      console.log(response);
      window.location.reload();
    } catch (error: any) {
      await this.alertService.presentError(error.message);
    } finally {
      this.loadService.hideLoading();
    }
  }

  ngOnInit() {
    this.getUserData();
    this.getAccounts();
  }
}
