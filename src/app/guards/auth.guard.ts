import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(): boolean {
    const active = this.authService.getActiveAccount();

    if (active && active.access_token) {
      // User is already authenticated
      this.router.navigate(['/tabs']);
      return false;
    }

    // No active session, allow access (to login/signup)
    return true;
  }
}
