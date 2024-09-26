import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
@Component({
  selector: 'app-viajes',
  templateUrl: './viajes.page.html',
  styleUrls: ['./viajes.page.scss'],
})
export class ViajesPage implements OnInit {
  
  viajes = [
    { id: 1, hora: '16:00', conductor: 'Leandro', destino: 'Chiguayante', precio: 1000, asientosDisponibles: 3 },
    { id: 2, hora: '17:00', conductor: 'Matías', destino: 'Concepción', precio: 800, asientosDisponibles: 4 },
    { id: 3, hora: '18:00', conductor: 'José', destino: 'Talcahuano', precio: 1200, asientosDisponibles: 2 },
    { id: 4, hora: '19:00', conductor: 'Sebastian', destino: 'Hualpén', precio: 1500, asientosDisponibles: 1 },
    { id: 5, hora: '20:00', conductor: 'Nicolás', destino: 'San Pedro de la Paz', precio: 2000, asientosDisponibles: 5 }
  ];
  
  ubicaciones = [
    {id:1, nombre: 'Hualpén'},
    {id:2, nombre: 'Concepción'},
    {id:3, nombre: 'Chiguayante'},
    {id:4, nombre: 'Talcahuano'},
    {id:5, nombre: 'San Pedro de la Paz'}
  ]
  horarios = [
    {id:1, hora: '16:00'},
    {id:2, hora: '17:00'},
    {id:3, hora: '18:00'},
    {id:4, hora: '19:00'},
    {id:5, hora: '20:00'}
  ]
  Asientos = [
    {id:1, cantidad: 1},
    {id:2, cantidad: 2},
    {id:3, cantidad: 3} 
  ]
  Precios = [
    {id:1, precio: 1000},
    {id:2, precio: 2000},
    {id:3, precio: 3000},
    {id:4, precio: 4000},
    {id:5, precio: 5000}
  ]
  constructor(private alertController: AlertController,private menuCtrl: MenuController) { }

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
  mostrarFiltro() {
    this.menuCtrl.open('end');
  }
}
