import { Component, inject, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
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
    (mapboxgl as any).accessToken = environment.MAPBOX_TOKEN;
  }

  ionViewWillEnter() {
    if (!this.map) this.buildMap();
  }

  ngOnInit() {
  }

  async buildMap() {
    try {
      try {
        await this.utils.checkPermissions();
      } catch (error) {
        await this.utils.requestPermissions();
      }

      const coords = (await this.utils.getCurrentPosition()).coords;
      this.map = new mapboxgl.Map({
        container: 'mapa',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [coords.longitude, coords.latitude],
        zoom: 12
      });
      this.map.resize();
    } catch (error) {
      this.utils.navigateBack();
    }
  }
}
