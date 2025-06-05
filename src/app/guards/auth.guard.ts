import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  async canActivate(): Promise<boolean> {
    const active = await this.authService.getActiveAccount();

    if (active && active.access_token) {
      this.router.navigate(['/tabs']);
      return false;
    }

    return true;
  }
}
