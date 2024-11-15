import { Component, inject, OnInit } from '@angular/core';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import { IDestino } from 'src/app/interfaces/varios';
import { Viaje } from 'src/app/models/models';
import { MapboxService } from 'src/app/services/mapbox.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ViajesService } from 'src/app/services/viajes.service';

@Component({
  selector: 'app-crear-viajes',
  templateUrl: './crear-viajes.page.html',
  styleUrls: ['./crear-viajes.page.scss'],
})
export class CrearViajesPage implements OnInit {
  // Inyección de dependencias
  private viajesSvc = inject(ViajesService);
  private utils = inject(UtilsService);
  private mapboxSvc = inject(MapboxService);

  viaje = {} as Viaje;

  modalOpen = true;

  fechaMin = new Date(Date.now()).toISOString();
  fechaMax = new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString();

  map!: mapboxgl.Map;
  direcciones!: MapboxDirections;

  origenSelected!: IDestino;
  destinoSelected!: IDestino;

  ngOnInit() {
  }

  async buildMap() {
    if (!this.direcciones) this.direcciones = this.mapboxSvc.crearDirecciones();
    this.map = await this.mapboxSvc.buildMap( mapa => {
      mapa.addControl(this.direcciones, 'top-left');
      if (this.origenSelected) this.direcciones.setOrigin(this.origenSelected.coordinates);
      if (this.destinoSelected) this.direcciones.setDestination(this.destinoSelected.coordinates);
      this.direcciones.on('origin', ev => {
        const coords = ev.feature.geometry.coordinates;
        this.mapboxSvc.buscarDireccionConCoordenadas(coords).then( direcc => {
          this.origenSelected = { coordinates: coords, direccion: direcc };
        });
      });
      this.direcciones.on('destination', ev => {
        const coords = ev.feature.geometry.coordinates;
        this.mapboxSvc.buscarDireccionConCoordenadas(coords).then( direcc => {
          this.destinoSelected = { coordinates: coords, direccion: direcc };
        });
      });
    });
  }

  validarPrecio(event: any){
    this.viaje.precio = event.target.value.replace(/[^0-9]/g, '');
  }

  validarAsientos(event: any){
    this.viaje.asientos = event.target.value.replace(/[^0-9]/g, '');
  }

  async submit(){
    if (!this.viaje.fecha) this.viaje.fecha = new Date(Date.now());
    this.viaje.estado = 'disponible';
    this.viaje.conductor = this.utils.getFromLocalStorage('user').uid;
    this.viaje.origen = this.origenSelected;
    this.viaje.destino = this.destinoSelected;
    const loading = await this.utils.presentLoading();
    loading.present();
    try {
      // Se crea el viaje
      await this.viajesSvc.crearViaje(this.viaje);
      // Se redirige a la página anterior
      this.utils.navigateBack();
      // Se muestra un mensaje de éxito
      return this.utils.presentToast({
        color: 'success',
        message: 'Viaje creado correctamente',
        duration: 2000
      });
    } catch (error) {
      this.utils.presentToast({
        color: 'danger',
        message: 'Error al crear el viaje',
        duration: 2000
      });
    } finally {
      loading.dismiss();
    }
  }

  modalDismiss() {
    this.modalOpen = false;
    this.map.remove();
  }
}
