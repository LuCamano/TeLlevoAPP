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


  nombre!: string;
  viajes: Viaje[] = []; 
  
  private subConductor!: Subscription;
  private subPasajero!: Subscription;

  conduciendo = false;
  dePasajero = false;

  ngOnInit() {
    
  }
  ionViewWillEnter() {
    this.comprobarViajeEnCurso();
    this.getViajesUser();
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
      let sub = this.viajesSvc.getViajes([{field: 'estado', opStr: '==', value: 'disponible'},{field:'conductor' , opStr: '!=', value: this.utils.getFromLocalStorage('user').uid }]).subscribe(async viajes => {
        let nuevosViajes: Viaje[] = []; 
        await viajes.forEach(async viaje => {
          let conductor: Usuario = await this.authSvc.getDocument(`usuarios/${viaje.conductor}`) as Usuario; 
          viaje.conductor = conductor.name;
          nuevosViajes.push(viaje);
        })
        this.viajes = nuevosViajes;
        sub.unsubscribe();
      });
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
      this.getViajesUser();
    } catch (error) {
      this.utils.presentToast({
        message: 'ya te encuentras en el viaje',
        color: 'danger',
        duration: 2500
      });
      console.error('Error al unirse al viaje:', error);
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
