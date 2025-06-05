import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private accounts_key = 'accounts';
  private active_account = 'active_account';

  constructor() {}

  async addAccount(user: string, access_token: string): Promise<void> {
    const accounts = await this.getAccounts();
    const existing = accounts.find((acc) => acc.user === user);

    if (!existing) {
      accounts.push({ user, access_token });
      await Preferences.set({
        key: this.accounts_key,
        value: JSON.stringify(accounts),
      });
    }
  }

  // Get all stored accounts
  async getAccounts(): Promise<{ user: string; access_token: string }[]> {
    const storedAccounts = (await Preferences.get({ key: this.accounts_key }))
      .value;
    return storedAccounts ? JSON.parse(storedAccounts) : [];
  }

  // Switch to a different account by user_id
  async switchAccount(user: string): Promise<boolean> {
    const accounts = await this.getAccounts();
    const account = accounts.find((acc) => acc.user === user);
    if (account) {
      await Preferences.set({
        key: this.active_account,
        value: JSON.stringify(account),
      });
      return true;
    }
    return false;
  }

  // Get the currently active account
  async getActiveAccount(): Promise<{
    user: string;
    access_token: string;
  } | null> {
    const storedAccount = (await Preferences.get({ key: this.active_account }))
      .value;
    return storedAccount ? JSON.parse(storedAccount) : null;
  }

  // Optional: Remove an account
  async removeAccount(user: string): Promise<void> {
    let accounts = await this.getAccounts();
    accounts = accounts.filter((acc) => acc.user !== user);
    await Preferences.set({
      key: this.accounts_key,
      value: JSON.stringify(accounts),
    });

    // If the removed account was active, clear active_account
    const active = await this.getActiveAccount();
    if (active && active.user === user) {
      await Preferences.remove({ key: this.active_account });
    }
  }
}
