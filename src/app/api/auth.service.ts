import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { Http } from '@capacitor-community/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() { }

  async login(username: string, password: string): Promise<any> {
    try {
      const options = {
        url: `${environment.urls.api}/token`,
        headers: { 'Content-Type': 'application/json' },
        params: {},
        data: { username, password },
      };

      const response = await Http.post(options);

      if (response.status === 200 || response.status === 201) {
        return response.data;
      }

      throw new Error(
        response?.data?.detail || 'Something went wrong. Please try again later.'
      );
    } catch (error: any) {
      const detail =
        error?.response?.data?.detail ||
        error?.error?.detail ||
        error?.message ||
        'An unknown error occurred. Please try again later.';

      console.warn(detail);
      throw new Error(detail);
    }
  }

  async logout(token: string): Promise<any> {
    try {
      const options = {
        url: `${environment.urls.api}/logout`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        params: {},
        data: {},
      };

      const response = await Http.post(options);

      if (response.status === 200 || response.status === 204) {
        return (
          response.data.message || 'You have been logged out.'
        );
      }

      throw new Error(
        response?.data?.detail || 'Something went wrong. Please try again later.'
      );
    } catch (error: any) {
      const detail =
        error?.response?.data?.detail ||
        error?.error?.detail ||
        error?.message ||
        'An unknown error occurred. Please try again later.';

      console.warn(detail);
      throw new Error(detail);
    }
  }

  async signup(
    username: string,
    password: string,
    dispenser_code: string | null
  ): Promise<any> {
    try {
      const options = {
        url: `${environment.urls.api}/signup`,
        headers: {
          'Content-Type': 'application/json',
        },
        params: {},
        data: { username, password, dispenser_code },
      };

      const response = await Http.post(options);

      if (response.status === 200 || response.status === 201) {
        return (
          response.data.message || 'Your account has been successfully created.'
        );
      }

      throw new Error(
        response?.data?.detail || 'Something went wrong. Please try again later.'
      );
    } catch (error: any) {
      const detail =
        error?.response?.data?.detail ||
        error?.error?.detail ||
        error?.message ||
        'An unknown error occurred. Please try again later.';

      console.warn(detail);
      throw new Error(detail);
    }
  }

  async saveUsernameChange(
    token: string,
    new_username: string,
    password: string
  ): Promise<any> {
    try {
      const options = {
        url: `${environment.urls.api}/update/username`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        params: {},
        data: { username: new_username, password: password },
      };

      const response = await Http.post(options);

      if (response.status === 200 || response.status === 201) {
        return (
          response.data?.message ||
          `Your username has been changed successfully.`
        );
      }

      throw new Error(
        response?.data?.detail || 'Something went wrong. Please try again later.'
      );
    } catch (error: any) {
      const detail =
        error?.response?.data?.detail ||
        error?.error?.detail ||
        error?.message ||
        'An unknown error occurred. Please try again later.';

      console.warn(detail);
      throw new Error(detail);
    }
  }

  async savePasswordChange(
    token: string,
    new_password: string,
    password: string
  ): Promise<any> {
    try {
      const options = {
        url: `${environment.urls.api}/update/password`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        params: {},
        data: { new_password, password },
      };

      const response = await Http.post(options);

      if (response.status === 200 || response.status === 201) {
        return (
          response.data.message ||
          `Your password has been changed successfully.`
        );
      }

      throw new Error(
        response?.data?.detail || 'Something went wrong. Please try again later.'
      );
    } catch (error: any) {
      const detail =
        error?.response?.data?.detail ||
        error?.error?.detail ||
        error?.message ||
        'An unknown error occurred. Please try again later.';

      console.warn(detail);
      throw new Error(detail);
    }
  }

  async getUserData(token: string): Promise<any> {
    try {
      const options = {
        url: `${environment.urls.api}/read/user`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        params: {},
      };

      console.log(options);

      const response = await Http.get(options);

      if (response.status === 200 || response.status === 201) {
        return response.data;
      }

      throw new Error(
        response?.data?.detail || 'Something went wrong. Please try again later.'
      );
    } catch (error: any) {
      const detail =
        error?.response?.data?.detail ||
        error?.error?.detail ||
        error?.message ||
        'An unknown error occurred. Please try again later.';

      console.warn(detail);
      throw new Error(detail);
    }
  }

  async deleteAccount(token: string): Promise<any> {
    try {
      const options = {
        url: `${environment.urls.api}/delete/user`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        params: {},
        data: {},
      };

      const response = await Http.post(options);

      if (response.status === 200 || response.status === 201) {
        return (
          response.data.message || 'User deleted successfully!'
        );
      }

      throw new Error(
        response?.data?.detail || 'Something went wrong. Please try again later.'
      );
    } catch (error: any) {
      const detail =
        error?.response?.data?.detail ||
        error?.error?.detail ||
        error?.message ||
        'An unknown error occurred. Please try again later.';

      console.warn(detail);
      throw new Error(detail);
    }
  }
}
