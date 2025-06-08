import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  constructor() {}

  async deleteSchedule(
    token: string,
    intake_id: number,
    schedule_id: number
  ): Promise<any> {
    try {
      const response = await axios.post(
        `${environment.urls.api}/delete/schedule`,
        {
          intake_id,
          schedule_id,
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

  async deletePrescription(token: string, medicine_id: number): Promise<any> {
    try {
      const response = await axios.post(
        `${environment.urls.api}/delete/prescription`,
        {
          medicine_id,
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

  async updateMedicine(
    token: string,
    medicine_id: number,
    medicine_name: string,
    net_content: number,
    expiration_date: Date,
    color_name: string
  ) {
    try {
      const response = await axios.post(
        `${environment.urls.api}/update/medicine`,
        {
          medicine_id,
          medicine_name,
          net_content,
          expiration_date,
          color_name,
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

  async updateMissedMedication(
    token: string,
    schedule_id: number,
    data_datetime: string,
    history_id: number
  ): Promise<any> {
    try {
      const response = await axios.post(
        `${environment.urls.api}/update/history`,
        {
          schedule_id: schedule_id,
          history_datetime: data_datetime,
          history_id: history_id,
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
          throw new Error('Unable to reach the server. Please try again later');
        } else {
          throw new Error(error.message);
        }
      } else {
        throw new Error('An unknown error occurred. Please try again later.');
      }
    }
  }

  async getSchedules(token: string): Promise<any> {
    try {
      const response = await axios.get(
        `${environment.urls.api}/read/schedules`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        return response.data;
      }

      throw new Error('Failed to fetch schedules.');
    } catch (error) {
      throw error;
    }
  }

  async getPrescriptions(token: string): Promise<any> {
    try {
      const response = await axios.get(
        `${environment.urls.api}/read/prescription`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        return response.data;
      }

      throw new Error('Failed to fetch prescriptions.');
    } catch (error) {
      throw error;
    }
  }

  async getHistories(token: string): Promise<any> {
    try {
      const response = await axios.get(
        `${environment.urls.api}/read/histories`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        return response.data;
      }

      throw new Error('Failed to fetch intake histories.');
    } catch (error) {
      throw error;
    }
  }

  async getMedicineForms(): Promise<any> {
    try {
      const response = await axios.get(`${environment.urls.api}/get/forms`);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.warn(error);
      throw error;
    }
  }

  async getDoseComponents(): Promise<any> {
    try {
      const response = await axios.get(
        `${environment.urls.api}/get/components`
      );
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.warn(error);
      throw error;
    }
  }

  async getCompartments(): Promise<any> {
    try {
      const response = await axios.get(
        `${environment.urls.api}/get/compartments`
      );
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.warn(error);
      throw error;
    }
  }
}
