import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class LoadService {
  constructor(private loadingController: LoadingController) {}

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
