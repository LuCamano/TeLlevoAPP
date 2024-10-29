import { inject, Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { LoadingController, NavController, ToastController, ToastOptions, AlertController, AlertOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  // Inyecciones de dependencias
  private toastController = inject(ToastController);
  private alertController = inject(AlertController);
  private loadingController= inject(LoadingController);
  private router = inject(Router);
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

  presentAlert(opts?: AlertOptions) {
    return this.alertController.create(opts);
  }

  navigateForwardto(route:string, extras?:NavigationExtras){
    this.navCtrl.navigateForward(route, extras);
  }

  navigateBack(){
    this.navCtrl.back();
  }

  navigateRoot(route:string, extras?:NavigationExtras){
    this.navCtrl.navigateRoot(route, extras);
  }

  saveInLocalStorage(key:string, value:any){
    return localStorage.setItem(key, JSON.stringify(value));
  }

  getFromLocalStorage(key:string){
    return JSON.parse(localStorage.getItem(key)!);
  }

  retrieveRouterEvents() {
    return this.router.events;
  }
}
