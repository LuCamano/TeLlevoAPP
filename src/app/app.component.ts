import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertButton, Platform } from '@ionic/angular';
import { AuthService } from './services/auth.service';
import { UtilsService } from './services/utils.service';
import { Usuario } from './models/models';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { FcmService } from './services/fcm.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  isValidUser = false;

  userName!: string;

  menuButtons: AlertButton[] = [
    {
      text: 'No',
      role: 'cancel'
    },
    {
      text: 'Cerrar Sesión',
      role: 'destructive',
      handler: () => {this.logout()}
    }
  ]

  constructor(
    private router: Router, 
    private authSvc: AuthService, 
    private utils: UtilsService,
    private fcmSvc: FcmService,
    private platform: Platform
  ) {
    this.initilizeApp();
    router.events.subscribe(val => {
      this.isValidUser = !this.router.url.includes('/login');
    });
    authSvc.getAuthIns().onAuthStateChanged( user => {
      let userLocal:Usuario = this.utils.getFromLocalStorage('user');
      if(userLocal) {
        this.userName = `${userLocal.name} ${userLocal.lastName}`;
      } else {
        this.authSvc.getCurrentUserData().then( usr => {
          if (usr) this.userName = `${usr.name} ${usr.lastName}`;
          else this.userName = '';
        });
      }
    });
  }
  
  logout() {
    if (this.platform.is('capacitor')) {
      this.fcmSvc.removeToken();
    }
    this.authSvc.signOut();
  }

  initilizeApp() {
    ScreenOrientation.lock({ orientation: 'portrait' }).then(() => {
      console.log('Pantalla bloqueada en modo vertical');
    }).catch((error) => {
      console.error('Error al bloquear la orientación:', error);
    });
  }
}
