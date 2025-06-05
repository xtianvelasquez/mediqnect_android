import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class ProtectedGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  async canActivate(): Promise<boolean> {
    const active = await this.authService.getActiveAccount();

    if (!active?.access_token || !active?.user) {
      this.router.navigate(['/login']);
      return false;
    }

    try {
      const response = await axios.get(`${environment.urls.api}/protected`, {
        headers: { Authorization: `Bearer ${active.access_token}` },
      });

      if (response.status === 200) {
        return true; // Allowed access
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Authentication failed:', error);

        if (
          error.response?.status === 401 ||
          error.response?.status === 404 ||
          error.response?.status === 500
        ) {
          this.authService.removeAccount(active.user);
          this.router.navigate(['/login']);
        }
      } else {
        console.error('Unexpected error in authentication:', error);
      }

      this.router.navigate(['/login']);
      return false;
    }

    // Ensure cleanup for any failed authentication cases
    this.authService.removeAccount(active.user);
    this.router.navigate(['/login']);
    return false;
  }
}
