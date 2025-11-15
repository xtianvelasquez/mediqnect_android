import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private tokenService: TokenService) {}

  async canActivate(): Promise<boolean> {
    const active = this.tokenService.getActiveAccount();

    if (active && active.access_token) {
      this.router.navigate(['/tabs']);
      return false;
    }

    return true;
  }
}
