import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  isLoginPage = false;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      // Verificar si la ruta actual es la página de login
      this.isLoginPage = this.router.url === '/login' || this.router.url === '/login/cambiar-contra' || this.router.url === '/login/crear';
      
    });
  }
  
  logout() {
    this.router.navigate(['/login']);
  }
}
