import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  
  email: string = '';
  password: string = '';

  constructor(private navCtrl: NavController ) { }

  ngOnInit() {
  }
  iniciarSesion() {
    // para mandarlos al home
    this.navCtrl.navigateRoot('/tabs/home');
    console.log(this.email, this.password);
  }
  onClick () {  
    this.navCtrl.navigateRoot('login/cambiar-contra');
  }
  onClick2 () {  
    this.navCtrl.navigateRoot('login/crear');
  }


}
