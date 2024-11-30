import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Usuario, Viaje } from 'src/app/models/models';
import { AuthService } from 'src/app/services/auth.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ViajesService } from 'src/app/services/viajes.service';
@Component({
  selector: 'app-viajes',
  templateUrl: './viajes.page.html',
  styleUrls: ['./viajes.page.scss'],
})
export class ViajesPage implements OnInit {
  // Inyectar servicios
  private utils = inject(UtilsService);
  private menuCtrl = inject(MenuController);
  private viajesSvc = inject(ViajesService);
  private authSvc = inject(AuthService);
  private datePipe = inject(DatePipe);
  
  viajes: Viaje[] = [];

  private subViajes!: Subscription;

  ngOnInit() {
  }
  
  ionViewWillEnter() {
    this.obtenerViajes();
  }

  ionViewWillLeave() {
    this.subViajes.unsubscribe();
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

  async unirseAlViaje(viaje: Viaje) {
    try {
      return await this.viajesSvc.unirseAlViaje(viaje);
    } catch (error) {
      this.utils.presentToast({
        message: 'Error' + error,
        color: 'danger',
        duration: 2000
      });
    }
  }

  mostrarFiltro() {
    this.menuCtrl.open('viajes-menu');
  }

  obtenerViajes() {
    const uid = this.utils.getFromLocalStorage('user').uid;
    this.subViajes = this.viajesSvc.getViajes([
      { field: 'conductor', opStr: '!=', value: uid },
      { field: 'estado', opStr: '==', value: 'disponible' }
    ]).subscribe( async vjs => {
      let viajesFiltrados = vjs.filter( vj => {
        if (vj.pasajeros) {
          return vj.pasajeros.indexOf(uid) === -1;
        } else {
          return true;
        }
      });
      for (const viaje of viajesFiltrados) {
        viaje.conductor = ((await this.authSvc.getDocument(`usuarios/${viaje.conductor}`)) as Usuario).name;
      }
      this.viajes = viajesFiltrados;
    });
  }
}
