import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular/standalone';
import { AlertService } from '../services/alert.service';
import { urls } from 'src/environments/environment';
import axios from 'axios';

interface History {
  user_id: number;
  schedule_id: number;
  scheduled_datetime: string;
  history_id: number;
  history_datetime: string;
  medicine_name: string;
  status_name: string;
}

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Tab3Page {
  histories: History[] = [];

  segment: string = 'completed';

  get token(): string {
    return localStorage.getItem('access_token') || '';
  }

  constructor(
    private router: Router,
    private alertController: AlertController,
    private alertService: AlertService
  ) {}

  profile() {
    this.router.navigate(['/profile']);
  }

  filteredHistories(): History[] {
    return this.histories.filter(
      (history) => history.status_name === this.segment
    );
  }

  async openAlert(
    user_id: number,
    schedule_id: number,
    scheduled_datetime: string,
    history_id: number,
    medicine_name: string,
    status_name: string
  ) {
    if (status_name === 'missed') {
      this.openMissedMedicationAlert(
        user_id,
        schedule_id,
        scheduled_datetime,
        history_id,
        medicine_name
      );
    } else {
      const alert = await this.alertController.create({
        header: 'Medication Info',
        message: `<strong>${medicine_name}</strong><br>Administered at: ${scheduled_datetime}`,
        buttons: ['OK'],
        mode: 'md',
      });

      await alert.present();
    }
  }

  openMissedMedicationAlert(
    user_id: number,
    schedule_id: number,
    scheduled_datetime: string,
    history_id: number,
    medicine_name: string
  ) {
    this.alertController
      .create({
        header: 'Missed Medication',
        message: `You missed your scheduled time for ${medicine_name}. Would you like to record when you took it?`,
        buttons: [
          {
            text: 'No',
            role: 'cancel',
          },
          {
            text: 'Yes',
            handler: () => {
              this.openTimeSelectionAlert(
                user_id,
                schedule_id,
                scheduled_datetime,
                history_id,
                medicine_name
              );
            },
          },
        ],
      })
      .then((alert) => alert.present());
  }

  openTimeSelectionAlert(
    user_id: number,
    schedule_id: number,
    scheduled_datetime: string,
    history_id: number,
    medicine_name: string
  ) {
    this.alertController
      .create({
        header: `What time did you take ${medicine_name}?`,
        inputs: [
          {
            type: 'radio',
            label: `Same Time As Scheduled (${scheduled_datetime})`,
            value: scheduled_datetime,
            checked: true,
          },
          {
            type: 'radio',
            label: 'Specify Time',
            value: 'custom',
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Submit',
            handler: (selectedTime) => {
              if (selectedTime === 'custom') {
                this.promptUserForTime(
                  user_id,
                  schedule_id,
                  scheduled_datetime,
                  history_id
                );
              } else {
                this.updateMissedMedication(
                  user_id,
                  schedule_id,
                  scheduled_datetime,
                  history_id
                );
              }
            },
          },
        ],
      })
      .then((alert) => alert.present());
  }

  promptUserForTime(
    user_id: number,
    schedule_id: number,
    scheduled_datetime: string,
    history_id: number
  ) {
    this.alertController
      .create({
        header: `Enter intake datetime for the schedule ${scheduled_datetime}:`,
        inputs: [
          {
            name: 'history_datetime',
            type: 'datetime-local',
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Submit',
            handler: (data) => {
              if (data.time) {
                this.updateMissedMedication(
                  user_id,
                  schedule_id,
                  data.history_datetime,
                  history_id
                );
              }
            },
          },
        ],
      })
      .then((alert) => alert.present());
  }

  async getHistories() {
    try {
      const response = await axios.get(`${urls.url}/histories`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      if (response.status === 200) {
        this.histories = response.data;
        console.log(this.histories);
      }
    } catch (error) {
      console.error('Error fetching histories:', error);
    }
  }

  async updateMissedMedication(
    user_id: number,
    schedule_id: number,
    scheduled_datetime: string,
    history_id: number
  ) {
    try {
      if (!this.token) {
        await this.alertService.presentMessage(
          'Error!',
          'No access token found'
        );
        this.router.navigate(['/login']);
        return;
      }

      const response = await axios.post(
        `${urls.url}/update/medication/missed`,
        {
          user_id: user_id,
          schedule_id: schedule_id,
          history_datetime: scheduled_datetime,
          history_id: history_id,
        },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );
      if (response.status === 200) {
        await this.alertService.presentMessage(
          'Success!',
          response.data.message
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const status = error.response.status;
          const detail = error.response.data?.detail;

          console.error('Status:', status);
          console.error('Detail:', detail);
          this.alertService.presentError(detail);
        } else if (error.request) {
          this.alertService.presentMessage(
            'Network Error!',
            'Could not reach the server. Check your internet connection or try again later.'
          );
        } else {
          this.alertService.presentError(error.message);
        }
      } else {
        this.alertService.presentMessage(
          'Error!',
          'An unexpected error occured. Please try again later.'
        );
      }
    }
  }

  ngOnInit() {
    this.getHistories();
  }
}
