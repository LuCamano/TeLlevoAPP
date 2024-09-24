import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  
  user = {
    email: '',
    password: ''
  }

  constructor(private navCtrl: NavController) { }

  ngOnInit() { }

  iniciarSesion() {
    // para mandarlos al home
    this.navCtrl.navigateRoot('/tabs');
    console.log(this.user.email, this.user.password);
  }
}
