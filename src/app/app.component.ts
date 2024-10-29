import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertButton } from '@ionic/angular';
import { AuthService } from './services/auth.service';
import { UtilsService } from './services/utils.service';
import { Usuario } from './models/models';
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

  constructor(private router: Router, private authSvc: AuthService, private utils: UtilsService) {
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
    this.authSvc.signOut();
  }
}
