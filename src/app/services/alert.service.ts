import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private alertController: AlertController) {}

  async presentMessage(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
      mode: 'md',
    });

    await alert.present();
  }

  async presentError(message: string) {
    const alert = await this.alertController.create({
      header: 'Warning!',
      message: message,
      buttons: ['OK'],
      mode: 'md',
    });

    await alert.present();
  }
}
