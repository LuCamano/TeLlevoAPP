import { inject, Injectable } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { UtilsService } from './utils.service';
import { environment } from 'src/environments/environment.prod';
import { IDireccion } from '../interfaces/varios';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

@Injectable({
  providedIn: 'root'
})
export class MapboxService {
  // Inyectar servicios
  private utils = inject(UtilsService);

  constructor() {
    mapboxgl.accessToken = environment.MAPBOX_TOKEN;
  }

  async buildMap(onLoad?: (map: mapboxgl.Map) => void): Promise<mapboxgl.Map> {
    try {
      // Verificar permisos
      try {
        await this.utils.checkPermissions();
      } catch (error) {
        // Solicitar permisos
        await this.utils.requestPermissions();
      }
      // Obtener coordenadas actuales
      const coords = (await this.utils.getCurrentPosition()).coords;
      // Crear el mapa
      const mapa = new mapboxgl.Map({
        container: 'mapa',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [coords.longitude, coords.latitude],
        zoom: 17,
        pitch: 40
      });
      if (onLoad) {
        mapa.on('load', () => {
          mapa.resize();
          onLoad(mapa);
        });
      } else {
        mapa.on('load', () => {
          mapa.resize();
        });
      }
      return mapa;
    } catch (error) {
      console.error('Error al construir el mapa', error);
      throw error;
    }
  }

/*   async obtenerRuta(mapa: mapboxgl.Map, start: [number, number], end: [number, number]) {
    // Url de la API de Mapbox
    const url = mapboxgl.baseApiUrl + `/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&overview=full&access_token=${mapboxgl.accessToken}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      // Agregar la ruta al mapa
      mapa.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: data.routes[0].geometry
        }
      });
      // Agregar la capa al mapa
      mapa.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#36c6ff',
          'line-width': 8
        }
      });
      // Agregar marcadores
      const startMarker = this.crearMarcador(mapa, start,{ color: '#29dbed', draggable: false, pitchAlignment: 'auto' });
      const endMarker = this.crearMarcador(mapa, end, { color: '#0ded3b', draggable: false, pitchAlignment: 'auto' });
    } catch (error) {
      console.error('Error al obtener la ruta:', error);
      throw error;
    }
  } */

  obtenerRutaConDirecciones(mapa: mapboxgl.Map, start: [number, number], end: [number, number]) {
    const directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      unit: 'metric',
      profile: 'mapbox/driving',
      interactive: false,
      language: 'es-MX',
      flyTo: false,
      controls: {
        inputs: false,
        instructions: false,
        profileSwitcher: false
      }
    })
    .setOrigin(start)
    .setDestination(end);
    mapa.addControl(directions, 'top-left');
  }

  crearDirecciones() {
    return new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      unit: 'metric',
      profile: 'mapbox/driving',
      interactive: true,
      language: 'es-MX',
      controls: {
        inputs: true,
        instructions: false,
        profileSwitcher: false
      }
    });
  }

  crearMarcador(mapa: mapboxgl.Map, coords: [number, number], opts: mapboxgl.MarkerOptions) {
    return new mapboxgl.Marker(opts).setLngLat(coords).addTo(mapa);
  }

  crearElementoMarcadorAuto() {
    const elemento = document.createElement('div');
    elemento.className = 'marker-auto';
    elemento.style.backgroundImage = "url(../../assets/icon/vehiculo.png)";
    elemento.style.width = '32px';
    elemento.style.height = '32px';
    elemento.style.backgroundSize = '100%';
    return elemento;
  }

  buscarDireccion(direccion: string) {
    const url = mapboxgl.baseApiUrl + `/geocoding/v5/mapbox.places/${direccion}.json?access_token=${mapboxgl.accessToken}`;
    return fetch(url)
    .then(response => response.json()) as Promise<IDireccion>;
  }

  buscarDireccionConCoordenadas(coords: [number, number]) {
    const url = mapboxgl.baseApiUrl + `/geocoding/v5/mapbox.places/${coords[0]},${coords[1]}.json?access_token=${mapboxgl.accessToken}`;
    return fetch(url)
    .then(response => response.json()).then((data: IDireccion)=> data.features[0].place_name );
  }
}
