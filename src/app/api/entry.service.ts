import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class EntryService {
  constructor() {}

  async login(username: string, password: string): Promise<any> {
    try {
      const response = await axios.post(`${environment.urls.api}/token`, {
        username,
        password,
      });

      if (response.status === 200 || response.status === 201) {
        return response.data;
      }

      throw new Error(
        response.data?.detail || 'Something went wrong. Please try again later.'
      );
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(error.response.data?.detail);
        } else if (error.request) {
          throw new Error(
            'Unable to reach the server. Please try again later.'
          );
        } else {
          throw new Error(error.message);
        }
      } else {
        throw new Error('An unknown error occurred. Please try again later.');
      }
    }
  }

  async logout(token: string): Promise<any> {
    try {
      const response = await axios.post(
        `${environment.urls.api}/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 204) {
        return response.data.message;
      }

      throw new Error(
        response.data?.detail || 'Something went wrong. Please try again later.'
      );
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(error.response.data?.detail);
        } else if (error.request) {
          throw new Error(
            'Unable to reach the server. Please try again later.'
          );
        } else {
          throw new Error(error.message);
        }
      } else {
        throw new Error('An unknown error occurred. Please try again later.');
      }
    }
  }

  async signup(
    username: string,
    password: string,
    dispenser_code: string
  ): Promise<any> {
    try {
      const response = await axios.post(`${environment.urls.api}/signup`, {
        username,
        password,
        dispenser_code,
      });

      if (response.status === 200 || response.status === 201) {
        return response.data.message;
      }

      throw new Error(
        response.data?.detail || 'Something went wrong. Please try again later.'
      );
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(error.response.data?.detail);
        } else if (error.request) {
          throw new Error(
            'Unable to reach the server. Please try again later.'
          );
        } else {
          throw new Error(error.message);
        }
      } else {
        throw new Error('An unknown error occurred. Please try again later.');
      }
    }
  }

  async saveUsernameChange(
    token: string,
    new_username: string,
    password: string
  ): Promise<any> {
    try {
      const response = await axios.post(
        `${environment.urls.api}/update/username`,
        {
          username: new_username,
          password: password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        return response.data.message;
      }

      throw new Error(
        response.data?.detail || 'Something went wrong. Please try again later.'
      );
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(error.response.data?.detail);
        } else if (error.request) {
          throw new Error(
            'Unable to reach the server. Please try again later.'
          );
        } else {
          throw new Error(error.message);
        }
      } else {
        throw new Error('An unknown error occurred. Please try again later.');
      }
    }
  }

  async savePasswordChange(
    token: string,
    new_password: string,
    password: string
  ): Promise<any> {
    try {
      const response = await axios.post(
        `${environment.urls.api}/update/password`,
        {
          new_password,
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        return response.data.message;
      }

      throw new Error(
        response.data?.detail || 'Something went wrong. Please try again later.'
      );
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(error.response.data?.detail);
        } else if (error.request) {
          throw new Error(
            'Unable to reach the server. Please try again later.'
          );
        } else {
          throw new Error(error.message);
        }
      } else {
        throw new Error('An unknown error occurred. Please try again later.');
      }
    }
  }

  async getUserData(token: string): Promise<any> {
    try {
      const response = await axios.get(`${environment.urls.api}/read/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        return response.data;
      }

      throw new Error('Failed to fetch user data.');
    } catch (error) {
      throw error;
    }
  }
}
