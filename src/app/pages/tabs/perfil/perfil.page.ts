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

  nombre!: string;
  apellido!: string;
  email!: string;
  viajes: Viaje[] = []; 
  
  
  constructor() { }

  ngOnInit() {
    this.unirseAlViaje();
    let sub = this.getViajesUser().subscribe(viajes => {
      viajes.forEach(async viaje => {
        let conductor: Usuario = await this.authSvc.getDocument(`usuarios/${viaje.conductor}`) as Usuario; 
        viaje.conductor = conductor.name;
        this.viajes.push(viaje);
        sub.unsubscribe();
      })
      
    });
  }
  
  ionViewWillEnter() {
    
      let userLocal:Usuario = this.utils.getFromLocalStorage('user');

      if(userLocal) {
        this.nombre = userLocal.name
        this.apellido = userLocal.lastName
        this.email = userLocal.email
      } else {
        this.authSvc.getCurrentUserData().then( usr => {
          if (usr) this.nombre = usr.name;
          else this.nombre = '';
        });
      }
    
  }

  getViajesUser() {
    let uid = this.utils.getFromLocalStorage('user').uid;
    return this.viajesSvc.getViajes([{field: 'pasajeros', opStr: 'array-contains', value: uid},{field: 'estado', opStr: 'in', value: ['iniciado', 'finalizado']}]);
  }
  

  async unirseAlViaje() {
    let viaje = await this.viajesSvc.getViaje('fqokgYQsksfSuiEE6wGG');
    this.viajesSvc.unirseAlViaje(viaje);

  } 
  

}
