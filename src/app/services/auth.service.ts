import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private accountsKey = 'accounts';
  private activeAccountKey = 'active_account';

  constructor() {}

  // Add a new account (only if not already present)
  addAccount(userId: string, accessToken: string): void {
    const accounts = this.getAccounts();
    const existing = accounts.find((acc) => acc.user_id === userId);

    if (!existing) {
      accounts.push({ user_id: userId, access_token: accessToken });
      localStorage.setItem(this.accountsKey, JSON.stringify(accounts));
    }
  }

  // Get all stored accounts
  getAccounts(): { user_id: string; access_token: string }[] {
    return JSON.parse(localStorage.getItem(this.accountsKey) || '[]');
  }

  // Switch to a different account by user_id
  switchAccount(userId: string): boolean {
    const accounts = this.getAccounts();
    const account = accounts.find((acc) => acc.user_id === userId);
    if (account) {
      localStorage.setItem(this.activeAccountKey, JSON.stringify(account));
      return true;
    }
    return false;
  }

  // Get the currently active account
  getActiveAccount(): { user_id: string; access_token: string } | null {
    const data = localStorage.getItem(this.activeAccountKey);
    return data ? JSON.parse(data) : null;
  }

  // Optional: Remove an account
  removeAccount(userId: string): void {
    let accounts = this.getAccounts();
    accounts = accounts.filter((acc) => acc.user_id !== userId);
    localStorage.setItem(this.accountsKey, JSON.stringify(accounts));

    // If the removed account was active, clear active_account
    const active = this.getActiveAccount();
    if (active && active.user_id === userId) {
      localStorage.removeItem(this.activeAccountKey);
    }
  }
}
