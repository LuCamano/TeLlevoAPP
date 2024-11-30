import { Component, inject, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../../../services/auth.service';
import { UtilsService } from '../../../services/utils.service';
import { Usuario, Viaje } from 'src/app/models/models';
import { ViajesService } from 'src/app/services/viajes.service';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  // Inyectar dependencias
  private datePipe = inject(DatePipe);
  private authSvc = inject(AuthService);
  private utils = inject(UtilsService);
  private viajesSvc = inject(ViajesService);

  private subViajes!: Subscription;

  private viajeEnCursoSub!: Subscription;

  nombre!: string;
  viajes: Viaje[] = [];

  viajeEnCurso: { status: boolean, viaje?: Viaje, esConductor?: boolean } = { status: false }; 

  ngOnInit() {
    
  }
  ionViewWillLeave() {
    this.subViajes.unsubscribe();
    this.viajeEnCursoSub.unsubscribe();
  }

  ionViewWillEnter() {
    this.getViajes();
    this.obtenerViajeEnCurso();
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
    });
  }

  solitcitarViaje(viaje: Viaje) {
    const hora = this.datePipe.transform(viaje.fecha, 'HH:mm a');
    const destino = viaje.destino.direccion.split(', ')[1];
    this.utils.presentAlert({
      header: 'Solicitar viaje',
      message: `¿Estás seguro que deseas solicitar el viaje de las ${hora} con destino a ${destino}?`,
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
    });
  }
    
  async getViajes() {
    this.subViajes = this.viajesSvc.getViajes([
      { field: 'estado', opStr: '==', value: 'disponible' },
      { field: 'conductor', opStr: '!=', value: this.utils.getFromLocalStorage('user').uid }
    ]).subscribe(async viajes => {
      const userUid = (this.utils.getFromLocalStorage('user') as Usuario).uid;

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

  obtenerViajeEnCurso() {
    const {uid} = this.utils.getFromLocalStorage('user') as Usuario;
    this.viajeEnCursoSub = this.viajesSvc.revisarSiHayViajeEnCurso(uid).subscribe(
      resp => {
        this.viajeEnCurso = resp;
        this.viajesSvc.setViajeEnCurso(resp.viaje);
      }
    );
  }
}
