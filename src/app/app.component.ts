import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertButton } from '@ionic/angular';
import { AuthService } from './services/auth.service';
import { UtilsService } from './services/utils.service';
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
    authSvc.isLoggedIn().subscribe( isLogged => {
      if (isLogged) {
        if (utils.getFromLocalStorage('user')) {
          this.userName = utils.getFromLocalStorage('user').name;
        } else {
          authSvc.getCurrentUserData().then( user => {
            this.userName = `${user.name} ${user.lastName}`;
          })
        }
      } else {
        this.userName = '';
        utils.navigateRoot('/login');
      }
    });
  }
  
  logout() {
    this.authSvc.signOut();
  }
}
