import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { LoadService } from '../services/load.service';
import { environment } from 'src/environments/environment';
import axios from 'axios';

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
  dispenser_code: String | null = null;

  signupStep = 1;

  constructor(
    private router: Router,
    private alertService: AlertService,
    private loadService: LoadService
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
      await this.alertService.presentMessage('Error!', input_error);
      return;
    }

    this.signupStep = 2;
  }

  async signup() {
    this.loadService.showLoading('Signing up...');
    try {
      const response = await axios.post(`${environment.urls.api}/signup`, {
        username: this.username.trim(),
        password: this.password.trim(),
        dispenser_code: this.dispenser_code,
      });

      if (response.status === 200 || response.status === 201) {
        this.alertService.presentMessage('Success!', response.data.message);
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
    } finally {
      this.loadService.hideLoading();
    }
  }
}
