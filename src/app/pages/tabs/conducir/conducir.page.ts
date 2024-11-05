import { Component, inject, OnInit } from '@angular/core';
import { Viaje } from 'src/app/models/models';
import { UtilsService } from 'src/app/services/utils.service';
import { ViajesService } from 'src/app/services/viajes.service';

@Component({
  selector: 'app-conducir',
  templateUrl: './conducir.page.html',
  styleUrls: ['./conducir.page.scss'],
})
export class ConducirPage implements OnInit {
  // Inyección de dependencias
  private viajesSvc = inject(ViajesService);
  private utils = inject(UtilsService);

  viajes: Viaje[] = [];

  public isLoading = false;

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.obtenerViajes();
  }

  obtenerViajes() {
    // Obtener los viajes del conductor
    this.isLoading = true;
    try {
      console.log(this.isLoading);
      let sub = this.viajesSvc.getViajes({
        // Buscar el campo conductor
        field: 'conductor',
        // Que sea igual al uid del usuario
        opStr: '==',
        value: this.utils.getFromLocalStorage('user').uid
  
      }).subscribe( listViajes => {
  
        this.viajes = listViajes;
        sub.unsubscribe();
        this.isLoading = false;
  
      });
    } catch (error) {
      this.utils.presentToast({
        color: 'danger',
        message: 'Error al obtener los viajes',
        duration: 2000
      });
    }
  }
}
