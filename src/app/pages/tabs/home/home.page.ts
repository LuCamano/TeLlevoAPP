import { Component, inject, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../../../services/auth.service';
import { UtilsService } from '../../../services/utils.service';
import { Usuario, Viaje } from 'src/app/models/models';
import { ViajesService } from 'src/app/services/viajes.service';
import { Subscription } from 'rxjs';

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
  
  private subViajes!: Subscription;

  nombre!: string;
  viajes: Viaje[] = []; 
  
  
  private subConductor!: Subscription;
  private subPasajero!: Subscription;

  conduciendo = false;
  dePasajero = false;

  ngOnInit() {
    
  }
  ionViewWillLeave() {
    this.subViajes.unsubscribe();
  }

  ionViewWillEnter() {
    this.comprobarViajeEnCurso();
    this.getViajes();
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
      message: `¿Estás seguro que deseas solicitar el viaje de las ${viaje.fecha} con destino a ${viaje.destino.direccion}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Aceptar',
          role: 'ok',
          handler: () => {this.unirseAlViaje(viaje)}
        }
        ]
      }).then(alert => alert.present());
    }
    
    async getViajes() {
      this.subViajes = this.viajesSvc.getViajes([
        { field: 'estado', opStr: '==', value: 'disponible' }, 
        { field: 'conductor', opStr: '!=', value: this.utils.getFromLocalStorage('user').uid }
      ]).subscribe(async viajes => {
        const userUid = this.utils.getFromLocalStorage('user').uid;
        
        // Usar un bucle for...of para manejar async/await
        const nuevosViajes: Viaje[] = [];
        for (const viaje of viajes) {
          try {
            const conductor: Usuario = await this.authSvc.getDocument(`usuarios/${viaje.conductor}`) as Usuario;
            viaje.conductor = conductor.name; // Actualiza con el nombre del conductor
            if (viaje.asientos > 0) {
              if (viaje.pasajeros) {
                if (!viaje.pasajeros.includes(userUid)) nuevosViajes.push(viaje);
              } else {
                nuevosViajes.push(viaje);
              }
            } 
          } catch (error) {
            console.error(`Error obteniendo datos del conductor para el viaje ${viaje.id}`, error);
          }
        }
        this.viajes = nuevosViajes; // Actualiza la lista de viajes
      });
    }
 
  async unirseAlViaje(via: Viaje) {
    try {
      await this.viajesSvc.unirseAlViaje(via);
    } catch (error) {
      this.utils.presentToast({
        message: 'Error' + error,
        color: 'danger',
        duration: 2000
      });
    }
  }

  comprobarViajeEnCurso() {
    const uid = this.utils.getFromLocalStorage('user').uid;
    const { asConductor, asPasajero } = this.viajesSvc.revisarSiHayViajeEnCurso(uid);
    this.subConductor = asConductor.subscribe( resp => {
      this.conduciendo = resp.status;
      if (resp.status) {
        this.utils.saveInLocalStorage('viajeEnCurso', resp.viaje);
      };
    });
    this.subPasajero = asPasajero.subscribe( resp => {
      this.dePasajero = resp.status;
      if (resp.status) {
        this.utils.saveInLocalStorage('viajeEnCurso', resp.viaje);
      };
    });
  }


}
