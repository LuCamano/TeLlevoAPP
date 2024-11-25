import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { UtilsService } from '../../../services/utils.service';
import { Usuario, Viaje } from 'src/app/models/models';
import { ViajesService } from 'src/app/services/viajes.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})

export class PerfilPage implements OnInit {
  
  private authSvc = inject(AuthService);
  private utils = inject(UtilsService);
  private viajesSvc = inject(ViajesService);

  usuario = {} as Usuario;
  viajes: Viaje[] = []; 
  mensaje = '';
  
  constructor() { }

  async ngOnInit() {
    if ( await this.checkInternet() == true) {
      let sub = this.getViajesUser().subscribe(viajes => {
        viajes.forEach(async viaje => {
          let conductor: Usuario = await this.authSvc.getDocument(`usuarios/${viaje.conductor}`) as Usuario; 
          viaje.conductor = conductor.name;
          this.viajes.push(viaje);
          
        })
        sub.unsubscribe();
      });
    } else {
      this.datosLocalesViajes();
    }
  }
  
  ionViewWillEnter() {
    this.datosLocalesUser();
    
  }
  
  datosLocalesUser() {
    let userLocal:Usuario = this.utils.getFromLocalStorage('user');
      if(userLocal) {
        this.usuario = userLocal 
      } else {
        this.authSvc.getCurrentUserData().then( usr => {
          if (usr) this.usuario = usr;
          else this.usuario = {email: '', name: '', lastName: '', uid: ''};
        });
      }
  } 

  datosLocalesViajes() {
    this.viajes = [];
    let a = this.utils.getFromLocalStorage('viajesLocales');
    this.viajes.push(a);
  }

  getViajesUser() {
    let uid = this.utils.getFromLocalStorage('user').uid;    
    return this.viajesSvc.getViajes([{field: 'pasajeros', opStr: 'array-contains', value: uid},{field: 'estado', opStr: 'in', value: ['iniciado', 'finalizado']}]);
  }

  async checkInternet(): Promise<boolean> {
    try {
      const response = await fetch('https://example.com/ping', { method: 'HEAD', mode: 'no-cors' });
      return true;
    } catch (error) {
      return false;
    }
  }
  
}
