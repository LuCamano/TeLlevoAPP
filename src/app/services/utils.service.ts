import { inject, Injectable } from '@angular/core';
import { LoadingController, NavController, ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  // Inyecciones de dependencias
  private toastController = inject(ToastController);
  private loadingController= inject(LoadingController);
  private navCtrl = inject(NavController);

  presentToast(opts:ToastOptions){
    this.toastController.create(opts).then(toast => {
      toast.present();
    });
  }

  presentLoading() {
    return this.loadingController.create({
      spinner: 'crescent',
      message: 'Cargando...',
    });
  }

  navigateForwardto(route:string){
    this.navCtrl.navigateForward(route);
  }

  navigateBack(){
    this.navCtrl.back();
  }

  navigateRoot(route:string){
    this.navCtrl.navigateRoot(route);
  }
}
