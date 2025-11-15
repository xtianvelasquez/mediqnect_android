import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { Http } from '@capacitor-community/http';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  constructor() { }

  async deleteSchedule(
    token: string,
    intake_id: number,
    schedule_id: number
  ): Promise<any> {
    try {
      const options = {
        url: `${environment.urls.api}/delete/schedule`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        params: {},
        data: { intake_id, schedule_id },
      };

      const response = await Http.post(options);

      if (response.status === 200 || response.status === 201) {
        return (
          response.data.message || 'The schedule has been successfully deleted.'
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

    async deleteIntake(
    token: string,
    intake_id: number
  ): Promise<any> {
    try {
      const options = {
        url: `${environment.urls.api}/delete/intake`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        params: {},
        data: { intake_id },
      };

      const response = await Http.post(options);

      if (response.status === 200 || response.status === 201) {
        return (
          response.data.message || 'The intake has been successfully deleted.'
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

  async deletePrescription(token: string, medicine_id: number): Promise<any> {
    try {
      const options = {
        url: `${environment.urls.api}/delete/prescription`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        params: {},
        data: { medicine_id },
      };

      const response = await Http.post(options);

      if (response.status === 200 || response.status === 201) {
        return (
          response.data.message ||
          'Prescription deleted and compartment marked as vacant.'
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

  async updateMedicine(
    token: string,
    medicine_id: number,
    medicine_name: string | null,
    net_content: number | null,
    expiration_date: string | null,
    color_name: string | null
  ) {
    try {
      const options = {
        url: `${environment.urls.api}/update/medicine`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        params: {},
        data: {
          medicine_id,
          medicine_name,
          net_content,
          expiration_date,
          color_name,
        },
      };

      const response = await Http.post(options);

      if (response.status === 200 || response.status === 201) {
        return (
          response.data.message ||
          'Your medicine has been successfully updated.'
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

  async updateMissedMedication(
    token: string,
    schedule_id: number,
    data_datetime: string,
    history_id: number
  ): Promise<any> {
    try {
      const options = {
        url: `${environment.urls.api}/update/history`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        params: {},
        data: {
          schedule_id: schedule_id,
          history_datetime: data_datetime,
          history_id: history_id,
        },
      };

      const response = await Http.post(options);

      if (response.status === 200 || response.status === 201) {
        return (
          response.data.message ||
          'Your missed medicine has been successfully updated.'
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

  async getSchedules(token: string): Promise<any> {
    try {
      const options = {
        url: `${environment.urls.api}/read/schedules`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        params: {},
      };

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

  async getPrescriptions(token: string): Promise<any> {
    try {
      const options = {
        url: `${environment.urls.api}/read/prescription`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        params: {},
      };

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

  async getHistories(token: string): Promise<any> {
    try {
      const options = {
        url: `${environment.urls.api}/read/histories`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        params: {},
      };

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

  async addMedicine(
    token: string,
    medicine_name: string,
    form_id: number,
    net_content: number | null,
    expiration_date: string | null,
    compartment_id: number,
  ) {
    try {
      const options = {
        url: `${environment.urls.api}/create/medicine`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        params: {},
        data: {
          medicine: {
            medicine_name,
            form_id,
            net_content,
            expiration_date,
          },
          medicine_compartment: {
            compartment_id,
          },
        },
      };

      const response = await Http.post(options);

      if (response.status === 200 || response.status === 201) {
        return (
          response.data.message ||
          'Your prescription details have been successfully added.'
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

  async addPrescription(
    token: string,
    color_name: string,
    medicine_id: number,
    start_datetime: string,
    end_datetime: string,
    hour_interval: number,
    dose: number,
    component_id: number
  ) {
    try {
      const options = {
        url: `${environment.urls.api}/create/prescription`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        params: {},
        data: {
          color: {
            color_name,
          },
          intake: {
            medicine_id,
            start_datetime,
            end_datetime,
            hour_interval,
            dose,
            component_id,
          },
        },
      };

      const response = await Http.post(options);

      if (response.status === 200 || response.status === 201) {
        return (
          response.data.message ||
          'Your prescription details have been successfully added.'
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

  async getMedicines(token: string) {
    try {
      const options = {
        url: `${environment.urls.api}/read/medicines`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        params: {},
      };

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

  async cleanCompartment(
    token: string,
    compartment_id: number
  ) {
    try {
      const options = {
        url: `${environment.urls.api}/clean/compartment`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        params: {},
        data: { compartment_id },
      };

      const response = await Http.post(options);

      if (response.status === 200 || response.status === 201) {
        return (
          response.data.message ||
          'Please wait for 5 minutes.'
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
