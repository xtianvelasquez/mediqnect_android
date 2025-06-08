import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private alertController: AlertController) {}

  async presentMessage(message: string) {
    const alert = await this.alertController.create({
      header: 'Success!',
      message: message,
      buttons: ['OK'],
      mode: 'md',
    });

    await alert.present();
  }

  async presentError(message: string) {
    const alert = await this.alertController.create({
      header: 'Failed!',
      message: message,
      buttons: ['OK'],
      mode: 'md',
    });

    await alert.present();
  }
}
