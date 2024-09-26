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

  constructor(private alertController: AlertController,private menuCtrl: MenuController) { }

  ngOnInit() {
  }
  
  filtrarDato(arr: Array<{ [key: string]: any }>, key: string): any[] {
    let result: any[] = [];
    arr.forEach(element => {
      if (element.hasOwnProperty(key)) {
        result.push(element[key]);
      }
    });
    result = result.filter((item, index) => {
      return result.indexOf(item) === index;
    });
    result = result.sort();
    return result;
  }

  solitcitarViaje(viaje: any) {
    this.alertController.create({
      header: 'Solicitar viaje',
      message: `¿Estás seguro que deseas solicitar el viaje de las ${viaje.hora} con destino a ${viaje.destino}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Aceptar',
          role: 'ok',
          handler: () => {
            this.alertController.create({
              header: 'Solicitud enviada',
              message: `Tu solicitud para el viaje de las ${viaje.hora} con destino a ${viaje.destino} ha sido enviada con éxito.`,
              buttons: ['Aceptar']
            }).then(alert => {
              alert.present();
            })
          }
        }
      ]
    }).then(alert => alert.present());
  }

  mostrarFiltro() {
    this.menuCtrl.open('viajes-menu');
  }
}
