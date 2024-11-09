import { Component, inject, OnInit } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { UtilsService } from 'src/app/services/utils.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-adm-viajes',
  templateUrl: './adm-viajes.page.html',
  styleUrls: ['./adm-viajes.page.scss'],
})
export class AdmViajesPage implements OnInit {
  // Inyectar servicios
  private utils = inject(UtilsService);

  map!: mapboxgl.Map;

  constructor() {
    mapboxgl.accessToken = environment.MAPBOX_TOKEN;
  }

  ionViewWillEnter() {
    if (!this.map) this.buildMap();
  }

  ngOnInit() {
  }

  obtenerRuta(start: [number, number], end: [number, number]) {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
    fetch(url)
    .then( response => response.json())
    .then( data => {
      console.log(data);
      this.map.addLayer({
        id: 'route',
        type: 'line',
        source: {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: data.routes[0].geometry.coordinates
            }
          }
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3887be',
          'line-width': 8
        }
      });
    });
  }

  async buildMap() {
    try {
      try {
        await this.utils.checkPermissions();
      } catch (error) {
        await this.utils.requestPermissions();
      }
      //Obtener las coordenadas actuales
      const coords = (await this.utils.getCurrentPosition()).coords;
      //Crear el mapa
      this.map = new mapboxgl.Map({
        container: 'mapa',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [coords.longitude, coords.latitude],
        zoom: 17,
        pitch: 40,
        bearing: -17
      });
      //Agregar el marcador para la ubicación actual
      new mapboxgl.Marker().setLngLat([coords.longitude, coords.latitude]).addTo(this.map);
      
      this.map.resize();

      return this.obtenerRuta([coords.longitude, coords.latitude], [-73.10885995425409, -36.73195425126108]);
    } catch (error) {
      return this.utils.navigateBack();
    }
  }
}
