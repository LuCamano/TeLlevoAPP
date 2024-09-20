import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-cambiar-contra',
  templateUrl: './cambiar-contra.page.html',
  styleUrls: ['./cambiar-contra.page.scss'],
})
export class CambiarContraPage implements OnInit {

  constructor( private navCtrl: NavController) { }

  ngOnInit() {
  }
  onClick () {  
    this.navCtrl.navigateRoot('login');
  } 
}
