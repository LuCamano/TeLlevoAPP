import { inject, Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Geolocation, PositionOptions, WatchPositionCallback } from "@capacitor/geolocation";
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

  async presentAlert(opts?: AlertOptions) {
    const alert = await this.alertController.create(opts);
    alert.present();
    return alert;
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

  getCurrentPosition(){
    return Geolocation.getCurrentPosition();
  }

  checkPermissions(){
    return Geolocation.checkPermissions();
  }

  requestPermissions(){
    return Geolocation.requestPermissions();
  }

  watchPosition(opts: PositionOptions, callback: WatchPositionCallback){
    return Geolocation.watchPosition(opts, callback);
  }

  clearWatch(id: string){
    return Geolocation.clearWatch({id});
  }

  async checkInternet(): Promise<boolean> {
    try {
      const response = await fetch('https://example.com/ping', {
        method: 'HEAD',
        mode: 'no-cors',
      });
      console.log('Internet is available');
      return true;
    } catch (error) {
      console.error('Internet is not available');
      return false;
    }
  }
}
