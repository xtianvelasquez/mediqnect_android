import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { LoadService } from '../services/load.service';
import { EntryService } from '../api/entry.service';

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
    private alertService: AlertService,
    private loadService: LoadService,
    private entryService: EntryService
  ) {}

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
      await this.alertService.presentError(input_error);
      return;
    }

    this.signupStep = 2;
  }

  async signup() {
    this.loadService.showLoading('Signing up...');
    try {
      const response = await this.entryService.signup(
        this.username,
        this.password,
        this.dispenser_code
      );

      await this.alertService.presentMessage(response);
      this.router.navigate(['/login']);
    } catch (error: any) {
      await this.alertService.presentError(error.message);
    } finally {
      this.loadService.hideLoading();
    }
  }
}
