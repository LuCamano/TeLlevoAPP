import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../../../services/auth.service';
import { UtilsService } from '../../../services/utils.service';
import { Usuario } from 'src/app/models/models';
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})

export class PerfilPage implements OnInit {
  
  private authSvc = inject(AuthService);
  private utils = inject(UtilsService);

  nombre!: string;
  apellido!: string;
  email!: string;
  viajes = [
    { id:'1',fecha: '2024-09-21', conductor: 'Juan Pérez', lugar: 'Santiago' },
    { id:'2',fecha: '2024-09-22', conductor: 'María López', lugar: 'Valparaíso' },
    { id:'3',fecha: '2024-09-23', conductor: 'Carlos Díaz', lugar: 'Concepción' }
  ];

  constructor() { }

  ngOnInit() {
    
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

}
