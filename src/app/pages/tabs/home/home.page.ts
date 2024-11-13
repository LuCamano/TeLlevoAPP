import { Component, inject, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../../../services/auth.service';
import { UtilsService } from '../../../services/utils.service';
import { Usuario, Viaje } from 'src/app/models/models';
import { ViajesService } from 'src/app/services/viajes.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  // Inyectar dependencias
  private alertController = inject(AlertController);
  private authSvc = inject(AuthService);
  private utils = inject(UtilsService);
  private viajesSvc = inject(ViajesService);


  nombre!: string;
  viajes: Viaje[] = []; 
  viajes2: Viaje[] = []; 

  ngOnInit() {
    
  }
  ionViewWillEnter() {
    let sub = this.getViajesUser().subscribe(viajes => {
      viajes.forEach(async viaje => {
        let conductor: Usuario = await this.authSvc.getDocument(`usuarios/${viaje.conductor}`) as Usuario; 
        viaje.conductor = conductor.name;
        this.viajes.push(viaje);
        sub.unsubscribe();
      })
      
    });
    let sub2 = this.getViajesActivos().subscribe(viajes2 => {
      viajes2.forEach(async viaje => {
        let conductor: Usuario = await this.authSvc.getDocument(`usuarios/${viaje.conductor}`) as Usuario; 
        viaje.conductor = conductor.name;
        this.viajes.push(viaje);
        sub2.unsubscribe();
      })
      
    });
    this.authSvc.getAuthIns().onAuthStateChanged( user => {
      let userLocal:Usuario = this.utils.getFromLocalStorage('user');
      if(userLocal) {
        this.nombre = userLocal.name
      } else {
        this.authSvc.getCurrentUserData().then( usr => {
          if (usr) this.nombre = usr.name;
          else this.nombre = '';
        });
      }
    })
  }

  solitcitarViaje(viaje: Viaje) {
    this.alertController.create({
      header: 'Solicitar viaje',
      message: `¿Estás seguro que deseas solicitar el viaje de las ${viaje.fecha} con destino a ${viaje.destino}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Aceptar',
          role: 'ok',
          handler: () => {
            
              this.unirseAlViaje(viaje);
              
            }
          }
        ]
      }).then(alert => alert.present());
    }
    
    getViajesUser() {
      this.viajes = [];
      return this.viajesSvc.getViajes([{field: 'estado', opStr: '==', value: 'disponible'}]);
    }
    getViajesActivos() {
      this.viajes2 = [];
      return this.viajesSvc.getViajes([{field: 'estado', opStr: 'in', value: ['disponible', 'lleno']}, {field: 'pasajeros', opStr: 'array-contains', value: this.utils.getFromLocalStorage('user').uid}]);
    }
    
  async unirseAlViaje(via: Viaje) {
    try {
      await this.viajesSvc.unirseAlViaje(via);
      this.alertController.create({
        header: 'Solicitud enviada',
        message: `Tu solicitud para el viaje de las ${via.fecha} con destino a ${via.destino} ha sido enviada con éxito.`,
        buttons: ['Aceptar']
      }).then(alert => {
        alert.present();
      })

    } catch (error) {
      this.utils.presentToast({
        message: 'ya te encuentras en el viaje',
        color: 'danger',
        duration: 2500
      });
      console.error('Error al unirse al viaje:', error);

    }

  }

}
