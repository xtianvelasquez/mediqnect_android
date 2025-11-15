import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NotifService } from '../services/notif.service';
import { AuthService } from '../api/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: false,
})
export class SignupPage {
  username: string = '';
  password: string = '';
  confirm_password: string = '';
  dispenser_code: string = '';

  signupStep = 1;

  constructor(
    private router: Router,
    private notifService: NotifService,
    private authService: AuthService
  ) { }

  login() {
    this.router.navigate(['/login']);
  }

  validateSignupInput() {
    if (
      !this.username ||
      !this.password.trim() ||
      !this.confirm_password.trim()
    )
      return 'Please fill in the necessary field.';

    if (this.username.length < 6 || this.username.length > 50)
      return 'Username must be at least 6 and at most 50 characters long.';

    if (this.password.length < 6 || this.password.length > 50)
      return 'Password must be at least 6 and at most 50 characters long.';

    if (this.password != this.confirm_password)
      return 'Password does not match with the confirmation password. Please try again.';

    return null;
  }

  async nextStep() {
    const input_error = this.validateSignupInput();
    if (input_error) {
      await this.notifService.presentError(input_error);
      return;
    }

    this.signupStep = 2;
  }

  async signup() {
    this.notifService.showLoading('Signing up...');
    try {
      if (!this.dispenser_code) {
        await this.notifService.presentError(
          'Please fill in the necessary field.'
        );
        return;
      }

      const response = await this.authService.signup(
        this.username,
        this.password,
        this.dispenser_code
      );

      await this.notifService.presentMessage(response);
      this.router.navigate(['/login']);
    } catch (error: any) {
      const message = error?.message || 'An unexpected error occurred.';
      await this.notifService.presentError(message);
    } finally {
      this.notifService.hideLoading();
    }
  }
}
