import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  viajes = [
    { id: 1, hora: '16:00', conductor: 'Leandro', destino: 'Chiguayante', precio: 1000, asientosDisponibles: 3 },
    { id: 2, hora: '17:00', conductor: 'Matías', destino: 'Concepción', precio: 800, asientosDisponibles: 4 },
    { id: 3, hora: '18:00', conductor: 'José', destino: 'Talcahuano', precio: 1200, asientosDisponibles: 2 },
    { id: 4, hora: '19:00', conductor: 'Sebastian', destino: 'Hualpén', precio: 1500, asientosDisponibles: 1 },
    { id: 5, hora: '20:00', conductor: 'Nicolás', destino: 'San Pedro de la Paz', precio: 2000, asientosDisponibles: 5 }
  ];

  constructor(private alertController: AlertController) { }

  ngOnInit() {
  }

  mostrarDetalle(viaje: any){
    this.alertController.create({
      header: 'Viaje a las ' + viaje.hora,
      subHeader: 'Conductor: ' + viaje.conductor,
      message: `Destino: ${viaje.destino} \nPrecio: $${viaje.precio} \nAsientos disponibles: ${viaje.asientosDisponibles}`,
      buttons: ['OK']
    }).then(detalles => {
      detalles.present();
    });
  }
}
