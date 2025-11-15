import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { Http } from '@capacitor-community/http';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  constructor() { }

  async getMedicineForms(): Promise<any> {
    try {
      const options = {
        url: `${environment.urls.api}/get/forms`,
        headers: {
          'Content-Type': 'application/json',
        },
        params: {},
      };

      const response = await Http.get(options);

      if (response.status === 200) {
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

  async getDoseComponents(): Promise<any> {
    try {
      const options = {
        url: `${environment.urls.api}/get/components`,
        headers: {
          'Content-Type': 'application/json',
        },
        params: {},
      };

      const response = await Http.get(options);

      if (response.status === 200) {
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

  async getCompartments(): Promise<any> {
    try {
      const options = {
        url: `${environment.urls.api}/get/compartments`,
        headers: {
          'Content-Type': 'application/json',
        },
        params: {},
      };

      const response = await Http.get(options);

      if (response.status === 200) {
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
}
