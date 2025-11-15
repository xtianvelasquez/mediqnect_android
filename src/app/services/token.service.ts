import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private accounts_key = 'accounts';
  private active_account = 'active_account';

  constructor() { }

  async addAccount(user: string, access_token: string): Promise<void> {
    const accounts = this.getAccounts();
    const existing = accounts.find((acc) => acc.user === user);

    if (!existing) {
      accounts.push({ user, access_token });
      localStorage.setItem(this.accounts_key, JSON.stringify(accounts));
    }
  }

  // Get all stored accounts
  getAccounts(): { user: string; access_token: string }[] {
    const storedAccounts = localStorage.getItem(this.accounts_key);
    return storedAccounts ? JSON.parse(storedAccounts) : [];
  }

  // Switch to a different account by user_id
  switchAccount(user: string): boolean {
    const accounts = this.getAccounts();
    const account = accounts.find((acc) => acc.user === user);
    if (account) {
      localStorage.setItem(this.active_account, JSON.stringify(account));
      return true;
    }
    return false;
  }

  // Get the currently active account
  getActiveAccount(): { user: string; access_token: string } | null {
    const storedAccount = localStorage.getItem(this.active_account);
    return storedAccount ? JSON.parse(storedAccount) : null;
  }

  // Optional: Remove an account
  removeAccount(user: string): void {
    let accounts = this.getAccounts();
    accounts = accounts.filter((acc) => acc.user !== user);
    localStorage.setItem(this.accounts_key, JSON.stringify(accounts));

    // If the removed account was active, clear active_account
    const active = this.getActiveAccount();
    if (active && active.user === user) {
      localStorage.removeItem(this.active_account);
    }
  }
}