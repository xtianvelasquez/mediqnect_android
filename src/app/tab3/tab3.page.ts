import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AlertController } from '@ionic/angular/standalone';
import { NotifService } from '../services/notif.service';
import { TokenService } from '../services/token.service';
import { MainService } from '../api/main.service';

interface History {
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
  providers: [DatePipe],
})
export class Tab3Page {
  histories: History[] = [];

  segment: string = 'completed';

  constructor(
    private router: Router,
    private datePipe: DatePipe,
    private alertController: AlertController,
    private notifService: NotifService,
    private tokenService: TokenService,
    private mainService: MainService
  ) { }

  profile() {
    this.router.navigate(['/profile']);
  }

  filteredHistories(): History[] {
    return this.histories.filter(
      (history) => history.status_name === this.segment
    );
  }

  async openAlert(
    schedule_id: number,
    scheduled_datetime: string,
    history_id: number,
    medicine_name: string,
    status_name: string
  ) {
    if (status_name === 'missed') {
      this.openMissedMedicationAlert(
        schedule_id,
        scheduled_datetime,
        history_id,
        medicine_name
      );
    } else {
      const formatted_datetime = this.datePipe.transform(
        scheduled_datetime,
        'short'
      );

      const alert = await this.alertController.create({
        header: 'Medication Info',
        message: `<strong>${medicine_name}</strong><br>Administered at: ${formatted_datetime}`,
        buttons: ['OK'],
        mode: 'md',
      });

      await alert.present();
    }
  }

  openMissedMedicationAlert(
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
                schedule_id,
                scheduled_datetime,
                history_id,
                medicine_name
              );
            },
          },
        ],
        mode: 'md',
      })
      .then((alert) => alert.present());
  }

  openTimeSelectionAlert(
    schedule_id: number,
    scheduled_datetime: string,
    history_id: number,
    medicine_name: string
  ) {
    const formatted_datetime = this.datePipe.transform(
      scheduled_datetime,
      'short'
    );

    this.alertController
      .create({
        header: `What time did you take ${medicine_name}?`,
        inputs: [
          {
            type: 'radio',
            label: `Same time as scheduled (${formatted_datetime})`,
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
            handler: (selected_time) => {
              if (selected_time === 'custom') {
                this.promptUserForTime(schedule_id, history_id);
              } else {
                this.updateMissedMedication(
                  schedule_id,
                  scheduled_datetime,
                  history_id
                );
              }
            },
          },
        ],
        mode: 'md',
      })
      .then((alert) => alert.present());
  }

  promptUserForTime(schedule_id: number, history_id: number) {
    const now = new Date();
    const formattedNow = now.toISOString().slice(0, 16);

    this.alertController
      .create({
        header: 'Enter intake datetime:',
        inputs: [
          {
            name: 'history_datetime',
            type: 'datetime-local',
            max: formattedNow,
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
              if (data.history_datetime) {
                const full_datetime = new Date(data.history_datetime);

                this.updateMissedMedication(
                  schedule_id,
                  full_datetime.toISOString(),
                  history_id
                );
              }
            },
          },
        ],
        mode: 'md',
      })
      .then((alert) => alert.present());
  }

  async getHistories() {
    try {
      const active = this.tokenService.getActiveAccount();

      if (!active?.access_token || !active?.user) {
        await this.notifService.presentError('No access token found.');
        this.router.navigate(['/login']);
        return;
      }

      const response = await this.mainService.getHistories(active.access_token);
      this.histories = response;
      console.log(this.histories);
    } catch (error: any) {
      const message = error?.message || 'An unexpected error occurred.';
      await this.notifService.presentError(message);
    }
  }

  async updateMissedMedication(
    schedule_id: number,
    data_datetime: string,
    history_id: number
  ) {
    try {
      const active = this.tokenService.getActiveAccount();

      if (!active?.access_token || !active?.user) {
        await this.notifService.presentError('No access token found.');
        this.router.navigate(['/login']);
        return;
      }

      this.notifService.showLoading('Please wait...');

      const response = await this.mainService.updateMissedMedication(
        active.access_token,
        schedule_id,
        data_datetime,
        history_id
      );
      await this.notifService.presentMessage(response);
      this.getHistories();
    } catch (error: any) {
      const message = error?.message || 'An unexpected error occurred.';
      await this.notifService.presentError(message);
    } finally {
      this.notifService.hideLoading();
    }
  }

  async handleRefresh(event: CustomEvent) {
    try {
      await this.getHistories();
    } catch (error) {
      console.warn('Error refreshing data:', error);
    } finally {
      (event.target as HTMLIonRefresherElement).complete();
    }
  }

  ngOnInit() {
    this.getHistories();
  }
}
