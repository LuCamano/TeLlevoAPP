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
    // this.obtenerViajesPruebas();
  }

  obtenerViajes() {
    // Obtener los viajes del conductor
    this.isLoading = true;
    try {
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

// Codigo para hacer pruebas
  /* vPruebas: Viaje[] = [];

  obtenerViajesPruebas() {
    try {
      let sub = this.viajesSvc.getViajes().subscribe( list => {
        this.vPruebas = list;
        sub.unsubscribe();
      });
    } catch (error) {
      console.error('Error al obtener los viajes:', error);
    }
  }

  unirseAlViaje(viaje: Viaje){
    // Unirse al viaje
    try {
      this.viajesSvc.unirseAlViaje(viaje);
    } catch (error) {
      console.log("pasaron cositas");
    }
  } */
}
