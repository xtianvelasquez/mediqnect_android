import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { NotifService } from '../services/notif.service';
import { TokenService } from '../services/token.service';
import { MainService } from '../api/main.service';
import { GeneralService } from '../api/general.service';

import { LocalNotifications } from '@awesome-cordova-plugins/local-notifications/ngx';

import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions } from '@fullcalendar/core';

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
  compartment_name: string;

  notified_expired?: boolean; // optional
}

interface Medicines {
  medicine_name: string;
  form_id: number;
  net_content: number;
  expiration_date: Date;
  medicine_id: number;
  user_id: number;
  created_at: Date;
  modified_at: Date;
  status_name: string;
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, FullCalendarModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Tab1Page {
  medicineModal = false;
  prescriptionModal = false;
  editMedicineModal = false;

  tracker_step = 1;
  tracker_name = 'Show Medications';

  forms: Forms[] = [];
  components: Components[] = [];
  compartments: Compartments[] = [];
  schedules: Schedules[] = [];
  prescriptions: Prescriptions[] = [];
  medicines: Medicines[] = [];

  selectedMedicine: Medicines | null = null;
  selectedPrescription: any = null;
  selectedDate: string = new Date().toISOString().split('T')[0];

  medicine_name: string = '';
  net_content: number = 0;
  expiration_date: Date | string = '';
  medicine_form: number = 0;
  compartment: number = 0;

  start_datetime: Date | string = '';
  hour_interval: number = 0;
  dose: number = 0;
  dose_component: number = 0;
  color: string = '#ff0000';

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek'
    },
    events: [],
    editable: true,
    selectable: true,
    initialDate: this.selectedDate,
    height: 'auto',
    aspectRatio: window.innerWidth < 768 ? 1.1 : 1.5,
    expandRows: true,
    handleWindowResize: true,
    contentHeight: 'auto',
    dayMaxEventRows: true,
    dayMaxEvents: true,
    titleFormat: { year: 'numeric', month: 'long' },
    buttonText: {
      today: 'Today',
      month: 'Month',
      week: 'Week'
    },
    select: (selectionInfo) => {
      this.selectedDate = selectionInfo.startStr;
      console.log('Date selected:', this.selectedDate);
    },
    dateClick: (info) => {
      this.selectedDate = info.dateStr;
      console.log('Date clicked:', this.selectedDate);
    },
    eventClick: (info) => {
      const clickedDate = new Date(info.event.start!);
      this.selectedDate = clickedDate.toISOString().split('T')[0];
      console.log('Event clicked:', this.selectedDate);
    }
  };

  constructor(
    private router: Router,
    private alertController: AlertController,
    private notifService: NotifService,
    private tokenService: TokenService,
    private mainService: MainService,
    private generalService: GeneralService,
    private localNotifications: LocalNotifications
  ) {
    window.addEventListener('resize', () => {
      this.calendarOptions.aspectRatio = window.innerWidth < 768 ? 1.1 : 1.5;
    });
  }

  getCurrentDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  getCurrentDateTime(): string {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localDate = new Date(now.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16);
  }

  profile() {
    this.router.navigate(['/profile']);
  }

  isTabletSelected(): boolean {
    return this.forms.find(f => f.form_id === this.medicine_form)?.form_name.toLowerCase() === 'tablet';
  }

  isSyrupSelected(): boolean {
    return this.forms.find(f => f.form_id === this.medicine_form)?.form_name.toLowerCase() === 'syrups';
  }

  onFormSelect(value: number) {
    this.medicine_form = value;
    this.compartment = 0;
  }

  isMedicinePrescribed(medicineId: number): boolean {
    return this.prescriptions.some(p => p.medicine_id === medicineId);
  }

  getTabletCompartments(): Compartments[] {
    return this.compartments.filter(c => c.set_name === 'tablet');
  }

  getSyrupCompartments(): Compartments[] {
    return this.compartments.filter(c => c.set_name === 'syrups');
  }

  getDoseUnit(): string {
    const component = this.components.find(c => c.component_id === this.selectedMedicine?.form_id);
    return component?.component_name || '';
  }

  openAddMedicine() {
    this.medicineModal = true;
  }

  closeAddMedicine() {
    this.resetAddMedicine();
    this.medicineModal = false;
  }

  openAddPrescription() {
    this.prescriptionModal = true;
  }

  closeAddPrescription() {
    this.resetAddPrescription();
    this.prescriptionModal = false;
  }

  openEditMedicine(prescription: any) {
    if (!prescription) {
      console.warn('Prescription data is missing!');
      return;
    }

    this.selectedPrescription = prescription;
    this.editMedicineModal = true;
  }

  closeEditMedicine() {
    this.selectedPrescription = null;
    this.editMedicineModal = false;
  }

  private resetAddMedicine() {
    this.medicine_name = '';
    this.net_content = 0;
    this.expiration_date = '';
    this.medicine_form = 0;
    this.compartment = 0;
  }

  private resetAddPrescription() {
    this.selectedMedicine = null;
    this.start_datetime = '';
    this.hour_interval = 0;
    this.dose = 0;
    this.dose_component = 0;
    this.color = '#ff0000';
  }

  async nextStep() {
    if (this.tracker_step === 1) {
      this.tracker_step = 2;
      this.tracker_name = 'Show Schedules';
    } else {
      this.tracker_step = 1;
      this.tracker_name = 'Show Medications';
    }
  }

  validateMedicineInputs() {
    if (!this.medicine_name) return 'Medicine name is required.';
    if (this.medicine_form === null || this.medicine_form === undefined) return 'Medicine form is required.';
    if (!this.net_content || this.net_content <= 0) return 'Net content must be greater than 0.';
    if (this.medicine_form === 1 && this.net_content > 60) return 'Net content for tablets must be at most 60.';
    if (this.medicine_form === 2 && this.net_content > 300) return 'Net content for syrups must be at most 300.';
    if (!this.expiration_date) return 'Expiration date is required.';
    if (this.compartment == null) return 'Please select a compartment.';

    return null
  }

  validatePrescriptionInputs() {
    if (!this.selectedMedicine) return 'Please select a medicine.';
    if (!this.start_datetime) return 'Start date is required.';
    if (!this.hour_interval || this.hour_interval < 3) return 'Hour interval must be at least 3.';
    if (!this.dose || this.dose <= 0) return 'Dose must be greater than 0.';

    return null;
  }

  validateDateInputs(start: Date, now: Date) {
    const isStartToday = start.toDateString() === now.toDateString();

    if (isNaN(start.getTime()))
      return 'Invalid date inputs.';

    if (isStartToday && start.getTime() <= now.getTime())
      return 'Start time must be in the future.';

    return null;
  }

  validateEditMedicine() {
    if (
      !this.selectedPrescription.color_name &&
      !this.selectedPrescription.medicine_name &&
      !this.selectedPrescription.net_content &&
      !this.selectedPrescription.expiration_date
    )
      return 'Please fill in the necessary field.';

    if (new Date(this.selectedPrescription.expiration_date).toISOString().split('T')[0] <= new Date().toISOString().split('T')[0])
      return 'Your medicine is already expired.';

    if (this.selectedPrescription.net_content <= 0)
      return 'The number fields should not be none or negative.'

    return null;
  }

  calculateEndDate(): string {
    if (!this.selectedMedicine || !this.dose || !this.hour_interval || !this.start_datetime) {
      return '';
    }

    const start = new Date(this.start_datetime);
    const intakes = Math.floor(this.selectedMedicine.net_content / this.dose);
    const totalHours = intakes * this.hour_interval;

    const end = new Date(start.getTime() + totalHours * 60 * 60 * 1000);
    return end.toISOString().slice(0, 16); // returns 'YYYY-MM-DDTHH:mm'
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

  async isEditMedicine() {
    try {
      const active = this.tokenService.getActiveAccount();

      if (!active?.access_token && !active?.user) {
        await this.notifService.presentError('No access token found.');
        this.router.navigate(['/login']);
        return;
      }

      const input_error = this.validateEditMedicine();
      if (input_error) {
        await this.notifService.presentError(input_error);
        return;
      }

      const expiration = this.selectedPrescription.expiration_date
        ? new Date(this.selectedPrescription.expiration_date).toISOString().slice(0, 10)
        : null;

      this.notifService.showLoading('Please wait...');

      const response = await this.mainService.updateMedicine(
        active.access_token,
        this.selectedPrescription.medicine_id,
        this.selectedPrescription.medicine_name,
        this.selectedPrescription.net_content,
        expiration,
        this.selectedPrescription.color_name
      );
      await this.notifService.presentMessage(response);
      this.getPrescriptions(),
        this.getSchedules(),
        this.closeEditMedicine();
    } catch (error: any) {
      const message = error?.message || 'An unexpected error occurred.';
      await this.notifService.presentError(message);
    } finally {
      this.notifService.hideLoading();
    }
  }

  async getSchedules() {
    try {
      const active = this.tokenService.getActiveAccount();

      if (!active?.access_token && !active?.user) {
        await this.notifService.presentError('No access token found.');
        this.router.navigate(['/login']);
        return;
      }

      const response = await this.mainService.getSchedules(active.access_token);
      this.schedules = response;
      console.log(this.schedules);

      this.calendarOptions.events = [];

      this.schedules.forEach(schedule => {
        const event = {
          title: schedule.medicine_name,
          start: new Date(schedule.scheduled_datetime).toISOString(),
          color: schedule.color_name,
          extendedProps: {
            intakeId: schedule.intake_id,
            scheduleId: schedule.schedule_id
          },
          display: 'block'
        };
        this.calendarOptions.events = [
          ...(this.calendarOptions.events as any[]),
          event
        ];
      });

      this.calendarOptions = { ...this.calendarOptions };
    } catch (error: any) {
      const message = error?.message || 'An unexpected error occurred.';
      await this.notifService.presentError(message);
    }
  }

  async getPrescriptions() {
    try {
      const active = this.tokenService.getActiveAccount();

      if (!active?.access_token && !active?.user) {
        await this.notifService.presentError('No access token found.');
        this.router.navigate(['/login']);
        return;
      }

      const response = await this.mainService.getPrescriptions(
        active.access_token
      );
      this.prescriptions = response;
      console.log(this.prescriptions);
    } catch (error: any) {
      const message = error?.message || 'An unexpected error occurred.';
      await this.notifService.presentError(message);
    }
  }

  async deleteSchedule(intake_id: number, schedule_id: number) {
    try {
      const active = this.tokenService.getActiveAccount();

      if (!active?.access_token && !active?.user) {
        await this.notifService.presentError('No access token found.');
        this.router.navigate(['/login']);
        return;
      }

      this.notifService.showLoading('Deleting schedule...');

      const response = await this.mainService.deleteSchedule(
        active.access_token,
        intake_id,
        schedule_id
      );
      await this.notifService.presentMessage(response);
      this.getSchedules();
      this.getPrescriptions();
      this.getCompartments()
    } catch (error: any) {
      const message = error?.message || 'An unexpected error occurred.';
      await this.notifService.presentError(message);
    } finally {
      this.notifService.hideLoading();
    }
  }

  async deletePrescription(medicine_id: number) {
    try {
      const active = this.tokenService.getActiveAccount();

      if (!active?.access_token && !active?.user) {
        await this.notifService.presentError('No access token found.');
        this.router.navigate(['/login']);
        return;
      }

      this.notifService.showLoading('Deleting prescription...');

      const response = await this.mainService.deletePrescription(
        active.access_token,
        medicine_id
      );
      await this.notifService.presentMessage(response);
      this.getMedicines();
      this.getPrescriptions();
      this.getSchedules();
      this.getCompartments()
    } catch (error: any) {
      const message = error?.message || 'An unexpected error occurred.';
      await this.notifService.presentError(message);
    } finally {
      this.notifService.hideLoading();
    }
  }

  async addMedicine() {
    try {
      const active = this.tokenService.getActiveAccount();

      if (!active?.access_token || !active?.user) {
        await this.notifService.presentError('No access token found.');
        this.router.navigate(['/login']);
        return;
      }

      const input_error = this.validateMedicineInputs();
      if (input_error) {
        await this.notifService.presentError(input_error);
        return;
      }

      const expiration = this.expiration_date
        ? new Date(this.expiration_date).toISOString().split('T')[0]
        : null;

      this.notifService.showLoading('Adding medicine...');

      const response = await this.mainService.addMedicine(
        active.access_token,
        this.medicine_name,
        this.medicine_form,
        this.net_content,
        expiration,
        this.compartment,
      );

      this.closeAddMedicine();
      await this.notifService.presentMessage(response);
      this.getMedicines();
      this.getCompartments();
    } catch (error: any) {
      const message = error?.message || 'An unexpected error occurred.';
      await this.notifService.presentError(message);
    } finally {
      this.notifService.hideLoading();
    }
  }

  async addPrescription() {
    try {
      const active = this.tokenService.getActiveAccount();

      if (!active?.access_token || !active?.user) {
        await this.notifService.presentError('No access token found.');
        this.router.navigate(['/login']);
        return;
      }

      const med = this.medicines.find(
        (medicine) => medicine.medicine_id === this.selectedMedicine?.medicine_id
      );

      if (!med) {
        await this.notifService.presentError('No medicine selected');
        return;
      }

      if (med.net_content < this.dose) {
        await this.notifService.presentError('The dose is greater than the net content. Please try again.');
        return;
      }

      console.log('Selected Medicine:', med);

      const start = new Date(this.start_datetime);
      const now = new Date();

      const input_error = this.validatePrescriptionInputs();
      if (input_error) {
        await this.notifService.presentError(input_error);
        return;
      }

      const date_error = this.validateDateInputs(start, now);
      if (date_error) {
        await this.notifService.presentError(date_error);
        return;
      }

      this.notifService.showLoading('Generating schedule/s...');

      const response = await this.mainService.addPrescription(
        active.access_token,
        this.color,
        med.medicine_id,
        start.toISOString(),
        this.calculateEndDate(),
        this.hour_interval,
        this.dose,
        med.form_id,
      );

      this.closeAddPrescription();
      await this.notifService.presentMessage(response);
      this.getPrescriptions();
      this.getSchedules();
      this.getCompartments();
    } catch (error: any) {
      const message = error?.message || 'An unexpected error occurred.';
      await this.notifService.presentError(message);
    } finally {
      this.notifService.hideLoading();
    }
  }

  async getMedicineForms() {
    try {
      const response = await this.generalService.getMedicineForms();
      this.forms = response;
    } catch (error: any) {
      const message = error?.message || 'An unexpected error occurred.';
      console.warn(message);
    }
  }

  async getDoseComponents() {
    try {
      const response = await this.generalService.getDoseComponents();
      this.components = response;
    } catch (error: any) {
      const message =
        error?.error || error?.message || error?.detail || 'An unexpected error occurred.';
      console.warn(message);
    }
  }

  async getCompartments() {
    try {
      const response = await this.generalService.getCompartments();
      this.compartments = response;
    } catch (error: any) {
      const message = error?.message || 'An unexpected error occurred.';
      console.warn(message);
    }
  }

  async getMedicines() {
    try {
      const active = this.tokenService.getActiveAccount();

      if (!active?.access_token && !active?.user) {
        await this.notifService.presentError('No access token found.');
        this.router.navigate(['/login']);
        return;
      }

      const response = await this.mainService.getMedicines(
        active.access_token
      );
      this.medicines = response;
      console.log(this.medicines);
    } catch (error: any) {
      const message = error?.message || 'An unexpected error occurred.';
      await this.notifService.presentError(message);
    }
  }

  async handleRefresh(event: CustomEvent) {
    try {
      await Promise.all([
        this.getPrescriptions(),
        this.getSchedules(),
        this.getMedicineForms(),
        this.getDoseComponents(),
        this.getCompartments(),
        this.getMedicines()]);
    } catch (error) {
      console.warn('Error refreshing data:', error);
    } finally {
      (event.target as HTMLIonRefresherElement).complete();
    }
  }

  checkExpiration() {
    const now = new Date();
    const expiredMeds = this.prescriptions.filter(prescription => {
      const expDate = new Date(prescription.expiration_date);
      return expDate < now && !prescription.notified_expired;
    });

    expiredMeds.forEach(med => {
      this.localNotifications.schedule({
        id: med.medicine_id,
        title: 'Medicine Expired',
        text: `${med.medicine_name} has expired today at ${med.expiration_date}.`,
        foreground: true
      });

      med.notified_expired = true;
    });

    this.getPrescriptions(),
    this.getSchedules(),
    this.getMedicineForms(),
    this.getDoseComponents(),
    this.getCompartments(),
    this.getMedicines();
  }

  startExpirationCheck() {
    setInterval(() => {
      this.checkExpiration();
    }, 60 * 1000); // Every 1 minute
  }

  ngOnInit() {
    this.startExpirationCheck();
    this.getSchedules();
    this.getPrescriptions();
    this.getMedicineForms();
    this.getDoseComponents();
    this.getCompartments();
    this.getMedicines();
  }
}
