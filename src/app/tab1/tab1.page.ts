import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { AlertService } from '../services/alert.service';
import { AuthService } from '../services/auth.service';
import { MainService } from '../api/main.service';
import { LoadService } from '../services/load.service';
import { environment } from 'src/environments/environment';
import axios from 'axios';

interface Forms {
  form_id: number;
  form_name: string;
}

interface Components {
  component_id: number;
  component_name: string;
}

interface Compartments {
  compartment_name: string;
  compartment_id: number;
  status_name: string;
  set_name: string;
}

interface Schedules {
  user_id: number;
  intake_id: number;
  scheduled_datetime: Date;
  schedule_id: number;
  medicine_name: string;
  color_name: string;
}

interface Prescriptions {
  user_id: number;
  intake_id: number;
  start_datetime: Date;
  end_datetime: Date;
  medicine_id: number;
  medicine_name: string;
  net_content: number;
  expiration_date: Date;
  color_name: string;
  status_name: string;
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Tab1Page {
  prescriptionModal = false;
  editMedicineModal = false;
  tracker_step = 1;
  tracker_name = 'Show Medicines';

  forms: Forms[] = [];
  components: Components[] = [];
  compartments: Compartments[] = [];
  schedules: Schedules[] = [];
  prescriptions: Prescriptions[] = [];

  medicine_name: string = '';
  net_content: number = 0;
  expiration_date: Date | string = '';
  medicine_form: number = 0;
  compartment: number = 0;
  start_datetime: Date | string = '';
  end_date: Date | string = '';
  hour_interval: number = 0;
  dose: number = 0;
  dose_component: number = 0;
  color: string = '#ff0000';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private alertService: AlertService,
    private authService: AuthService,
    private loadService: LoadService,
    private mainService: MainService
  ) {}

  profile() {
    this.router.navigate(['/profile']);
  }

  openAddPrescription() {
    this.prescriptionModal = true;
  }

  closeAddPrescription() {
    this.prescriptionModal = false;
  }

  openEditMedicine() {
    this.resetAddPrescription();
    this.editMedicineModal = true;
  }

  closeEditMedicine() {
    this.resetEditMedicine();
    this.editMedicineModal = false;
  }

  private resetAddPrescription() {
    this.medicine_name = '';
    this.net_content = 0;
    this.expiration_date = '';
    this.medicine_form = 0;
    this.compartment = 0;
    this.start_datetime = '';
    this.end_date = '';
    this.hour_interval = 0;
    this.dose = 0;
    this.dose_component = 0;
    this.color = '#ff0000';
  }

  private resetEditMedicine() {
    this.medicine_name = '';
    this.net_content = 0;
    this.expiration_date = '';
  }

  async nextStep() {
    if (this.tracker_step === 1) {
      this.tracker_step = 2;
      this.tracker_name = 'Show Schedules';
    } else {
      this.tracker_step = 1;
      this.tracker_name = 'Show Medicines';
    }
  }

  validatePrescriptionInputs() {
    if (
      !this.color ||
      !this.medicine_name ||
      !this.medicine_form ||
      !this.dose ||
      !this.dose_component ||
      !this.hour_interval ||
      !this.start_datetime ||
      !this.end_date
    )
      return 'Please fill in the necessary field.';

    if (this.net_content < 0 || this.dose <= 0 || this.hour_interval <= 0)
      return 'The number fields should not be negative.';

    if (this.hour_interval < 3)
      return 'The hour interval is too short. Minimum interval is 3 hours.';

    return null;
  }

  validateDateInputs(start: Date, end: Date, now: Date) {
    const isStartToday = start.toDateString() === now.toDateString();

    if (this.net_content < 0 || this.dose < 0 || this.hour_interval < 0)
      return 'The number fields should not be negative.';

    if (start.getTime() > end.getTime())
      return 'Start datetime must be before end datetime.';

    if (isStartToday && start.getTime() <= now.getTime())
      return 'Start time must be in the future.';

    if (end.getTime() - start.getTime() > 1000 * 60 * 60 * 24 * 30)
      return 'The duration between start and end is too long. Maximum schedule duration is 30 days.';

    return null;
  }

  validateEditMedicine() {
    let now = new Date();

    if (
      !this.color &&
      !this.medicine_name &&
      !this.net_content &&
      !this.expiration_date
    )
      return 'Please fill in any fields you wish to edit.';

    if (new Date(this.expiration_date) <= now)
      return 'Your medicine is already expired.';

    return;
  }

  isDeleteSchedule(intake_id: number, schedule_id: number) {
    this.alertController
      .create({
        header: 'Confirm Deletion',
        message: 'This schedule will be deleted permanently.',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
          },
          {
            text: 'Yes',
            handler: () => {
              this.deleteSchedule(intake_id, schedule_id);
            },
          },
        ],
        mode: 'md',
      })
      .then((alert) => alert.present());
  }

  isDeletePrescription(medicine_id: number) {
    this.alertController
      .create({
        header: 'Confirm Deletion',
        message: 'This medication will be deleted permanently.',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
          },
          {
            text: 'Yes',
            handler: () => {
              this.deletePrescription(medicine_id);
            },
          },
        ],
        mode: 'md',
      })
      .then((alert) => alert.present());
  }

  async isEditMedicine(medicine_id: number) {
    try {
      const active = await this.authService.getActiveAccount();

      if (!active?.access_token && !active?.user) {
        await this.alertService.presentError('No access token found.');
        this.router.navigate(['/login']);
        return;
      }

      const input_error = this.validateEditMedicine();
      if (input_error) {
        await this.alertService.presentError(input_error);
        return;
      }

      this.loadService.showLoading('Please wait...');

      const response = await this.mainService.updateMedicine(
        active.access_token,
        medicine_id,
        this.medicine_name,
        this.net_content,
        new Date(this.expiration_date),
        this.color
      );
      await this.alertService.presentMessage(response);
      this.closeEditMedicine();
    } catch (error: any) {
      await this.alertService.presentError(error.message);
    } finally {
      this.loadService.hideLoading();
    }
  }

  async getSchedules() {
    try {
      const active = await this.authService.getActiveAccount();

      if (!active?.access_token && !active?.user) {
        await this.alertService.presentError('No access token found.');
        this.router.navigate(['/login']);
        return;
      }

      const response = await this.mainService.getSchedules(active.access_token);
      this.schedules = response;
      console.log(this.schedules);
    } catch (error: any) {
      await this.alertService.presentError(error.message);
    }
  }

  async getPrescriptions() {
    try {
      const active = await this.authService.getActiveAccount();

      if (!active?.access_token && !active?.user) {
        await this.alertService.presentError('No access token found.');
        this.router.navigate(['/login']);
        return;
      }

      const response = await this.mainService.getPrescriptions(
        active.access_token
      );
      this.prescriptions = response;
      console.log(this.prescriptions);
    } catch (error: any) {
      await this.alertService.presentError(error.message);
    }
  }

  async getMedicineForms() {
    try {
      const response = await this.mainService.getMedicineForms();
      this.forms = response;
    } catch (error: any) {
      await this.alertService.presentError(error.message);
    }
  }

  async getDoseComponents() {
    try {
      const response = await this.mainService.getDoseComponents();
      this.components = response;
    } catch (error: any) {
      await this.alertService.presentError(error.message);
    }
  }

  async getCompartments() {
    try {
      const response = await this.mainService.getCompartments();
      this.compartments = response;
    } catch (error: any) {
      await this.alertService.presentError(error.message);
    }
  }

  async deleteSchedule(intake_id: number, schedule_id: number) {
    try {
      const active = await this.authService.getActiveAccount();

      if (!active?.access_token && !active?.user) {
        await this.alertService.presentError('No access token found.');
        this.router.navigate(['/login']);
        return;
      }

      this.loadService.showLoading('Deleting schedule...');

      const response = await this.mainService.deleteSchedule(
        active.access_token,
        intake_id,
        schedule_id
      );
      await this.alertService.presentMessage(response);
      this.getSchedules();
      this.getPrescriptions();
    } catch (error: any) {
      await this.alertService.presentError(error.message);
    } finally {
      this.loadService.hideLoading();
    }
  }

  async deletePrescription(medicine_id: number) {
    try {
      const active = await this.authService.getActiveAccount();

      if (!active?.access_token && !active?.user) {
        await this.alertService.presentError('No access token found.');
        this.router.navigate(['/login']);
        return;
      }

      this.loadService.showLoading('Deleting prescription...');

      const response = await this.mainService.deletePrescription(
        active.access_token,
        medicine_id
      );
      await this.alertService.presentMessage(response);
      this.getPrescriptions();
      this.getSchedules();
    } catch (error: any) {
      await this.alertService.presentError(error.message);
    } finally {
      this.loadService.hideLoading();
    }
  }

  async addPrescription() {
    try {
      const active = await this.authService.getActiveAccount();

      if (!active?.access_token || !active?.user) {
        await this.alertService.presentError('No access token found.');
        this.router.navigate(['/login']);
        return;
      }

      const start = new Date(this.start_datetime);
      const end = new Date(this.end_date);
      const now = new Date();

      const input_error = this.validatePrescriptionInputs();
      if (input_error) {
        await this.alertService.presentError(input_error);
        return;
      }

      const date_error = this.validateDateInputs(start, end, now);
      if (date_error) {
        await this.alertService.presentError(date_error);
        return;
      }

      const full_end = new Date(`${this.end_date}T23:59:00.000Z`).toISOString();
      const expiration = this.expiration_date
        ? new Date(this.expiration_date).toISOString().slice(0, 10)
        : null;

      this.loadService.showLoading('Generating schedule/s...');

      const response = await axios.post(
        `${environment.urls.api}/create/prescription`,
        {
          color: {
            color_name: this.color,
          },
          medicine: {
            medicine_name: this.medicine_name,
            form_id: this.medicine_form,
            net_content: this.net_content || null,
            expiration_date: expiration,
          },
          medicine_compartment: {
            compartment_id: this.compartment,
          },
          intake: {
            start_datetime: start.toISOString(),
            end_datetime: full_end,
            hour_interval: this.hour_interval,
            dose: this.dose,
            component_id: this.dose_component,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${active.access_token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        await this.alertService.presentMessage(response.data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          await this.alertService.presentError(error.response.data?.detail);
        } else if (error.request) {
          await this.alertService.presentError(
            'Unable to reach the server. Please try again later.'
          );
        } else {
          await this.alertService.presentError(error.message);
        }
      } else {
        await this.alertService.presentError(
          'An unexpected error occurred. Please try again later.'
        );
      }
    } finally {
      this.loadService.hideLoading();
    }
  }

  ngOnInit() {
    this.getSchedules();
    this.getPrescriptions();
    this.getMedicineForms();
    this.getDoseComponents();
    this.getCompartments();
  }
}
