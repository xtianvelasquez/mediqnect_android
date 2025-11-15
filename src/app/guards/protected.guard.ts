import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { environment } from 'src/environments/environment';
import { Http } from '@capacitor-community/http';

@Injectable({
  providedIn: 'root',
})
export class ProtectedGuard implements CanActivate {
  constructor(private router: Router, private tokenService: TokenService) { }

  async canActivate(): Promise<boolean> {
    const active = this.tokenService.getActiveAccount();

    if (!active?.access_token || !active?.user) {
      this.router.navigate(['/login']);
      return false;
    }

    console.log('Active Account:', active);
    console.log('Access Token:', active?.access_token);
    console.log('User:', active?.user);

    try {
      const options = {
        url: `${environment.urls.api}/protected`,
        headers: {
          Authorization: `Bearer ${active.access_token}`,
        },
        params: {},
      };

      const response = await Http.get(options);

      if (response.status === 200) {
        return true; // Allowed access
      }
    } catch (error: any) {
      const detail =
        error?.response?.data?.detail ||
        error?.error?.detail ||
        error?.message ||
        'An unknown error occurred. Please try again later.';

      console.warn('Authentication failed:', detail);

      // Cleanup in case response wasn't 200
      this.tokenService.removeAccount(active.user);
      this.router.navigate(['/login']);
      return false;
    }

    // Cleanup in case response wasn't 200
    this.tokenService.removeAccount(active.user);
    this.router.navigate(['/login']);
    return false;
  }
}
