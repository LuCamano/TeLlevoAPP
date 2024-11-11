import { Component, inject, OnInit } from '@angular/core';
import { MapboxService } from 'src/app/services/mapbox.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-adm-viajes',
  templateUrl: './adm-viajes.page.html',
  styleUrls: ['./adm-viajes.page.scss'],
})
export class AdmViajesPage implements OnInit {
  private utils = inject(UtilsService);
  private mapbox = inject(MapboxService);

  map!: mapboxgl.Map;
  currentMarker!: mapboxgl.Marker;

  ionViewWillEnter() {
    this.buildMap();
  }

  ngOnInit() {
  }

  async buildMap() {
    try {
      // Obtener coordenadas actuales
      const { latitude, longitude } = (await this.utils.getCurrentPosition()).coords;
      // Crear el mapa
      const mapa = await this.mapbox.buildMap( map1 => {
        // Cargar la ruta al iniciar el mapa
        this.mapbox.obtenerRuta(map1, [longitude, latitude], [-73.08966273403564, -36.76762960060227]);
      });
      // Asignar el mapa a la propiedad
      this.map = mapa;

      // Crear marcador para la posición actual
      this.currentMarker = this.mapbox.crearMarcador(mapa, [longitude, latitude], { element: this.mapbox.crearElementoMarcadorAuto(), pitchAlignment: 'auto', draggable: false });

      // Actualizar la posición del marcador
      this.utils.watchPosition({}, position => {
        const { latitude, longitude } = position!.coords;
        this.currentMarker.setLngLat([longitude, latitude]);
        this.map.flyTo({ center: [longitude, latitude], pitch: this.map.getPitch(), bearing: this.map.getBearing() });
      });

    } catch (error) {
      this.utils.presentToast({
        color: 'danger',
        message: 'Error al construir el mapa',
        duration: 2000
      });
    }
  }
}
