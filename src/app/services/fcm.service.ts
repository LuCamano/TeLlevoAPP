import { inject, Injectable } from '@angular/core';
import { ActionPerformed, PushNotifications, PushNotificationSchema, Token } from '@capacitor/push-notifications';
import { UtilsService } from './utils.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { INotification } from '../interfaces/varios';
import { lastValueFrom } from 'rxjs';
import { Usuario } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class FcmService {
  // Inyecciones de dependencias
  private utils = inject(UtilsService);
  private http = inject(HttpClient);
  private authSvc = inject(AuthService);

  initFcm() {

    PushNotifications.requestPermissions().then( result => {
      if (result.receive === 'granted') {
        PushNotifications.register();
      } else {
        console.error('No se ha permitido las notificaciones push');
      }
    });

    PushNotifications.addListener('registration', async (token: Token) => {
      this.saveToken(token);
    });

    PushNotifications.addListener('registrationError', (error: any) => {
      this.utils.presentAlert({header: 'Push registration error', message: JSON.stringify(error)});
    });

    PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
      this.utils.presentAlert({header: 'Push received', message: JSON.stringify(notification)});
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
      this.utils.presentAlert({header: 'Push action performed', message: JSON.stringify(notification)});
    });
  }

  async sendPushNotification(notif: INotification) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return await lastValueFrom(this.http.post('https://notifstellevoapp.glitch.me/sendPushNotification', JSON.stringify(notif), { headers: headers }));

  }

  async saveToken(token: Token) {
    try {
      // Guardar el token en el local storage
      this.utils.saveInLocalStorage('fcm-token', token.value);
  
      // Guardar el token en la base de datos
      const { uid } = this.utils.getFromLocalStorage('user') as Usuario;
      const usr = await this.authSvc.getDocument(`usuarios/${uid}`) as Usuario;
      if (usr) {
        usr.tokens = usr.tokens ? usr.tokens : [];
        if (!usr.tokens.includes(token.value)) {
          usr.tokens.push(token.value);
        }
        await this.authSvc.setDocument(`usuarios/${usr.uid}`, usr);
        this.utils.saveInLocalStorage('user', usr);
      }
    } catch (error) {
      console.error('Error al guardar el token:', error);
      throw error;
    }
  }

  async removeToken() {
    try {
      const token = this.utils.getFromLocalStorage('fcm-token');
  
      // Eliminar el token de la base de datos
      const { uid } = this.utils.getFromLocalStorage('user') as Usuario;
      const usr = await this.authSvc.getDocument(`usuarios/${uid}`) as Usuario;
      if (usr) {
        usr.tokens = usr.tokens ? usr.tokens : [];
        usr.tokens = usr.tokens.filter( t => t !== token);
        await this.authSvc.setDocument(`usuarios/${usr.uid}`, usr);
        this.utils.saveInLocalStorage('user', usr);
      }
    } catch (error) {
      console.error('Error al eliminar el token:', error);
      throw error;
    }
  }
}
