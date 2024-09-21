import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-crear',
  templateUrl: './crear.page.html',
  styleUrls: ['./crear.page.scss'],
})
export class CrearPage implements OnInit {

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
  }
  crearCuenta(){
    this.navCtrl.navigateRoot('login');
  } 
}
