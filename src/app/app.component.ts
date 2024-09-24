import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertButton } from '@ionic/angular';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  isValidUser = false;

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

  constructor(private router: Router) {
    this.router.events.subscribe(val => {
      this.isValidUser = !this.router.url.includes('/login');
    });
  }
  
  logout() {
    this.router.navigate(['/login']);
  }
}
