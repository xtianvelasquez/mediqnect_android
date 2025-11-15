import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { NotifService } from '../services/notif.service';
import { TokenService } from '../services/token.service';
import { MainService } from '../api/main.service';
import { AuthService } from '../api/auth.service';
import { environment } from 'src/environments/environment.prod';
import { Http } from '@capacitor-community/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class ProfilePage implements OnInit {
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
  showCleanCompartment = false;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private notifService: NotifService,
    private authService: AuthService,
    private tokenService: TokenService,
    private mainService: MainService
  ) { }

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

  openCleanCompartment() {
    this.showCleanCompartment = true;
  }

  closeCleanCompartment() {
    this.showCleanCompartment = false;
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

  validatePasswordChangeInput() {
    if (!this.new_password || !this.confirm_password || !this.password)
      return 'Please fill the necessary field.';

    if (this.new_password != this.confirm_password)
      return 'Password does not match with the confirmation password. Please try again.';

    if (this.new_password.length < 6 || this.new_password.length > 50)
      return 'Password must be at least 6 and at most 50 characters long.';

    return null;
  }

  async cleanCompartment(compartmentId: number) {
    this.notifService.showLoading('Please wait...');
    try {
      const active = this.tokenService.getActiveAccount();

      if (!active?.access_token || !active?.user) {
        await this.notifService.presentError('No access token found.');
        await this.router.navigate(['/login']);
        return;
      }

      const response = await this.mainService.cleanCompartment(
        active.access_token,
        compartmentId
      );
      await this.notifService.presentMessage(response);
      this.closeCleanCompartment();

      // Notify after 5 minutes, but without freezing the UI
      setTimeout(() => {
        this.notifService.presentMessage('Your compartment is now fully cleaned.');
      }, 300000);
    } catch (error: any) {
      const message = error?.message || 'An unexpected error occurred.';
      await this.notifService.presentError(message);
    } finally {
      this.notifService.hideLoading();
    }
  }

  async switchToUser(user_id: string) {
    this.notifService.showLoading('Loading profile...');
    try {
      const active = this.tokenService.getActiveAccount();

      if (user_id === active?.user) {
        await this.notifService.presentError(
          "You're already using this account."
        );
        return;
      }

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

  isDeleteAccount() {
    this.alertController
      .create({
        header: 'Confirm Deletion',
        message: 'This account will be deleted permanently.',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
          },
          {
            text: 'Yes',
            handler: () => {
              this.deleteAccount();
            },
          },
        ],
        mode: 'md',
      })
      .then((alert) => alert.present());
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

  async getUserData() {
    try {
      const active = this.tokenService.getActiveAccount();

      if (!active?.access_token || !active?.user) {
        await this.notifService.presentError('No access token found.');
        this.router.navigate(['/login']);
        return;
      }

      const response = await this.authService.getUserData(active.access_token);
      this.user_data = response;
    } catch (error: any) {
      const message = error?.message || 'An unexpected error occurred.';
      console.warn(message);
    }
  }

  async addNewAccount() {
    this.notifService.showLoading('Adding profile...');
    try {
      const saved_account = this.tokenService.getAccounts();

      if (saved_account.length > 6) {
        await this.notifService.presentError(
          'Maximum account limit reached. You can only save 6 accounts for quick switching.'
        );
        return;
      }

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

      // Process login success
      await this.tokenService.addAccount(response.user, response.access_token);
      this.tokenService.switchAccount(response.user);
      window.location.reload();
    } catch (error: any) {
      const message = error?.message || 'An unexpected error occurred.';
      await this.notifService.presentError(message);
    } finally {
      this.notifService.hideLoading();
    }
  }

  async savePasswordChange() {
    try {
      const active = this.tokenService.getActiveAccount();

      if (!active?.access_token || !active?.user) {
        await this.notifService.presentError('No access token found.');
        this.router.navigate(['/login']);
        return;
      }

      const input_error = this.validatePasswordChangeInput();
      if (input_error) {
        await this.notifService.presentError(input_error);
        return;
      }

      this.notifService.showLoading('Please wait...');

      const response = await this.authService.savePasswordChange(
        active.access_token,
        this.new_password,
        this.password
      );
      await this.notifService.presentMessage(response);
    } catch (error: any) {
      const message = error?.message || 'An unexpected error occurred.';
      await this.notifService.presentError(message);
    } finally {
      this.notifService.hideLoading();
    }
  }

  async logout() {
    this.notifService.showLoading('Logging out...');
    try {
      const active = this.tokenService.getActiveAccount();

      if (!active?.access_token || !active?.user) {
        await this.notifService.presentError('No access token found.');
        this.router.navigate(['/login']);
        return;
      }

      const response = await this.authService.logout(active.access_token);
      this.tokenService.removeAccount(active.user);
      console.log(response);
      window.location.reload();
    } catch (error: any) {
      const message = error?.message || 'An unexpected error occurred.';
      await this.notifService.presentError(message);
    } finally {
      this.notifService.hideLoading();
    }
  }

  async deleteAccount() {
    this.notifService.showLoading('Deleting account...');
    try {
      const active = this.tokenService.getActiveAccount();

      if (!active?.access_token || !active?.user) {
        await this.notifService.presentError('No access token found.');
        this.router.navigate(['/login']);
        return;
      }

      const response = await this.authService.deleteAccount(active.access_token);
      this.tokenService.removeAccount(active.user);
      console.log(response);
      window.location.reload();
    } catch (error: any) {
      const message = error?.message || 'An unexpected error occurred.';
      await this.notifService.presentError(message);
    } finally {
      this.notifService.hideLoading();
    }
  }

  async handleRefresh(event: CustomEvent) {
    try {
      await Promise.all([this.getAccounts(), this.getUserData()]);
    } catch (error) {
      console.warn('Error refreshing data:', error);
    } finally {
      (event.target as HTMLIonRefresherElement).complete();
    }
  }

  ngOnInit() {
    this.getUserData();
    this.getAccounts();
  }
}
