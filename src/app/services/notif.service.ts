import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class NotifService {
  constructor(
    private alertController: AlertController,
    private loadingController: LoadingController
  ) { }

  async presentMessage(message: string) {
    const alert = await this.alertController.create({
      header: 'Success!',
      message: message,
      buttons: [{
        text: 'OK',
        role: 'cancel',
        cssClass: 'center-ok-button'
      }],
      cssClass: 'custom-alert-success',
      mode: 'md',
    });

    await alert.present();
  }

  async presentError(message: string) {
    const alert = await this.alertController.create({
      header: 'Failed!',
      message: message,
      buttons: [{
        text: 'OK',
        role: 'cancel',
        cssClass: 'center-ok-button'
      }],
      cssClass: 'custom-alert-error',
      mode: 'md',
    });

    await alert.present();
  }

  async showLoading(message: string) {
    const loading = await this.loadingController.create({
      message: message,
      spinner: 'circular',
      translucent: true,
    });

    await loading.present();
  }

  async hideLoading() {
    await this.loadingController.dismiss();
  }
}
