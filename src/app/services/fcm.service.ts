import { inject, Injectable } from '@angular/core';
import { ActionPerformed, PushNotifications, PushNotificationSchema, Token } from '@capacitor/push-notifications';
import { UtilsService } from './utils.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { INotification } from '../interfaces/varios';
import { lastValueFrom } from 'rxjs';
import { Usuario, Viaje } from '../models/models';

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
      if (notification.notification.data.route) {
        this.utils.navigateForwardto(notification.notification.data.route);
      }
    });
  }

  async sendPushNotification(notif: INotification) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return await lastValueFrom(this.http.post('https://notifstellevoapp-462e3c35423d.herokuapp.com/sendPushNotification', JSON.stringify(notif), { headers: headers }));

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
      const token: string = this.utils.getFromLocalStorage('fcm-token');
  
      // Eliminar el token de la base de datos
      const { uid } = this.utils.getFromLocalStorage('user') as Usuario;
      const usr = await this.authSvc.getDocument(`usuarios/${uid}`) as Usuario;
      if (usr) {
        usr.tokens = usr.tokens ? usr.tokens : [];
        usr.tokens = usr.tokens.filter( t => t !== token);
        await this.authSvc.setDocument(`usuarios/${usr.uid}`, usr);
      }
    } catch (error) {
      console.error('Error al eliminar el token:', error);
      throw error;
    }
  }

  async obtenerTokensUsuario(uid: string) {
    try {
      const usr = await this.authSvc.getDocument(`usuarios/${uid}`) as Usuario;
      return usr.tokens;
    } catch (error) {
      console.error('Error al obtener los tokens del usuario:', error);
      throw error;
    }
  }

  async obtenerTokensPasajeros(viaje: Viaje) {
    try {
      const tokens: string[] = [];
      for (const pasajero of viaje.pasajeros) {
        const pasajeroTokens = await this.obtenerTokensUsuario(pasajero);
        if (pasajeroTokens) {
          tokens.push(...pasajeroTokens);
        }
      }
      return tokens;
    } catch (error) {
      console.error('Error al obtener los tokens de los pasajeros:', error);
      throw error;
    }
  }

  async obtenerTokensConductor(viajeId: string) {
    try {
      const viaje = await this.authSvc.getDocument(`viajes/${viajeId}`) as Viaje;
      const conductorTokens = await this.obtenerTokensUsuario(viaje.conductor);
      return conductorTokens;
    } catch (error) {
      console.error('Error al obtener los tokens del conductor:', error);
      throw error;
    }
  }

  async notificarSolicitud(viajeId: string) {
    try {
      const tokens = await this.obtenerTokensConductor(viajeId);
      if (!tokens) throw new Error('No hay tokens para notificar');
      this.sendPushNotification({
        tokens,
        notification: {
          title: 'Nueva solicitud',
          body: 'Tienes una nueva solicitud de un pasajero'
        },
        data: {
          route: '/conducir/adm-viajes'
        }
      });
    } catch (error) {
      console.error('Error al notificar la solicitud:', error);
      throw error;
    }
  }

  async notificarAceptacion(pasajeroId: string) {
    try {
      const tokens = await this.obtenerTokensUsuario(pasajeroId);
      if (!tokens) throw new Error('No hay tokens para notificar');
      this.sendPushNotification({
        tokens,
        notification: {
          title: 'Solicitud aceptada',
          body: 'Tu solicitud ha sido aceptada'
        },
        data: {
          route: '/vista-viaje',
          solicitudStatus: 'ACEPTADA'
        }
      });
    } catch (error) {
      console.error('Error al notificar la aceptación:', error);
      throw error;
    }
  }

  async notificarRechazo(pasajeroId: string) {
    try {
      const tokens = await this.obtenerTokensUsuario(pasajeroId);
      if (!tokens) throw new Error('No hay tokens para notificar');
      this.sendPushNotification({
        tokens,
        notification: {
          title: 'Solicitud rechazada',
          body: 'Tu solicitud ha sido rechazada'
        },
        data: {
          route: '/tabs/home',
          solicitudStatus: 'RECHAZADA'
        }
      });
    } catch (error) {
      console.error('Error al notificar el rechazo:', error);
      throw error;
    }
  }

  async notificarPreparacion(viajeId: string) {
    try {
      const viaje = await this.authSvc.getDocument(`viajes/${viajeId}`) as Viaje;
      const tokens = await this.obtenerTokensPasajeros(viaje);
      if (!tokens) throw new Error('No hay tokens para notificar');
      this.sendPushNotification({
        tokens,
        notification: {
          title: 'Viaje en preparación',
          body: 'Tu viaje está en preparación'
        },
        data: {
          route: '/vista-viaje',
        }
      });
    } catch (error) {
      console.error('Error al notificar la preparación:', error);
      throw error;
    }
  }

  async notificarMensaje(viajeId: string){
    try {
      let tokens: string[] = [];
      const viaje = await this.authSvc.getDocument(`viajes/${viajeId}`) as Viaje;
      const tokensPasajeros = await this.obtenerTokensPasajeros(viaje);
      const tokensConductor = await this.obtenerTokensConductor(viajeId);
      if (tokensPasajeros) tokens.push(...tokensPasajeros);
      if (tokensConductor) tokens.push(...tokensConductor);
      if (tokens.length <= 0) throw new Error('No hay tokens para notificar');
      this.sendPushNotification({
        tokens,
        notification: {
          title: 'Nuevo mensaje',
          body: 'Tienes un nuevo mensaje en el chat del viaje'
        },
        data: {
          route: '/tabs/home',
        }
      });
    } catch (error) {
      console.error('Error al notificar el mensaje:', error);
      throw error;
    }
  }
}
