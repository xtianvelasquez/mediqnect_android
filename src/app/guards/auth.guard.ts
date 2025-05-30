import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('access_token');

    if (token && token.trim() !== 'null') {
      this.router.navigate(['/tabs']); // Redirect authenticated users
      return false; // Prevent access to login/signup
    }

    return true; // Allow access if not logged in
  }
}
