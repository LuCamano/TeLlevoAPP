import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Solicitud, Viaje } from 'src/app/models/models';
import { MapboxService } from 'src/app/services/mapbox.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ViajesService } from 'src/app/services/viajes.service';

@Component({
  selector: 'app-adm-viajes',
  templateUrl: './adm-viajes.page.html',
  styleUrls: ['./adm-viajes.page.scss'],
})
export class AdmViajesPage implements OnInit {
  private utils = inject(UtilsService);
  private mapbox = inject(MapboxService);
  private viajesSvc = inject(ViajesService);
  private router = inject(Router);

  map!: mapboxgl.Map;
  currentMarker!: mapboxgl.Marker;

  solicitudesModal = false;
  mensajesModal = false;

  private subSolicitudes!: Subscription;

  mensajes = [
    { mensaje: "Hola", remitente:"Rodrigo" },
    { mensaje: "Buenas tardes", remitente:"Alberto" },
    { mensaje: "Adios", remitente: "Gabriela" }
  ]

  solicitudes:Solicitud[] = [];

  viaje = {} as Viaje;

  private watchPosCallId!: string;
  ionViewWillEnter() {
    this.obtenerViaje();
    this.buildMap();
    this.getSolicitudes();
  }

  ionViewWillLeave() {
    if (this.watchPosCallId) this.utils.clearWatch(this.watchPosCallId);
    if (this.subSolicitudes) this.subSolicitudes.unsubscribe();
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
        // this.mapbox.obtenerRuta(map1, [longitude, latitude], [-73.08966273403564, -36.76762960060227]);
        this.mapbox.obtenerRutaConDirecciones(map1, this.viaje.origen.coordinates, this.viaje.destino.coordinates);

        // Crear marcador para la posición actual
        this.currentMarker = this.mapbox.crearMarcador(mapa, this.viaje.origen.coordinates, { element: this.mapbox.crearElementoMarcadorAuto(), pitchAlignment: 'auto', draggable: false });
  
        // Actualizar la posición del marcador
        this.utils.watchPosition({}, position => {
          const { latitude, longitude } = position!.coords;
          this.currentMarker.setLngLat([longitude, latitude]);
          this.map.flyTo({ center: [longitude, latitude], pitch: this.map.getPitch(), bearing: this.map.getBearing() });
        }).then( id => this.watchPosCallId = id );
      });
      // Asignar el mapa a la propiedad
      this.map = mapa;
      return;
    } catch (error) {
      this.utils.presentToast({
        color: 'danger',
        message: 'Error al construir el mapa',
        duration: 2000
      });
    }
  }

  getSolicitudes() {
    try {
      this.subSolicitudes = this.viajesSvc.getSolicitudes(this.viaje.id!).subscribe( solicitudes => {
        this.solicitudes = solicitudes;
      });
    } catch (error) {
      this.utils.presentToast({
        color: 'danger',
        message: 'Error al obtener las solicitudes',
        duration: 2000
      });
    }
  }

  aceptarSolicitud(solicitud: Solicitud) {
    try {
      this.viajesSvc.aceptarSolicitud(solicitud, this.viaje);
    } catch (error) {
      this.utils.presentToast({
        color: 'danger',
        message: 'Error al aceptar la solicitud',
        duration: 2000
      });
    }
  }

  rechazarSolicitud(solicitud: Solicitud) {
    try {
      this.viajesSvc.rechazarSolicitud(solicitud, this.viaje);
    } catch (error) {
      this.utils.presentToast({
        color: 'danger',
        message: 'Error al rechazar la solicitud',
        duration: 2000
      });
    }
  }

  iniciarViaje() {
    try {
      this.viajesSvc.iniciarViaje(this.viaje);
    } catch (error) {
      this.utils.presentToast({
        color: 'danger',
        message: 'Error al iniciar el viaje',
        duration: 2000
      });
    }
  }

  finalizarViaje() {
    try {
      this.viajesSvc.finalizarViaje(this.viaje);
    } catch (error) {
      this.utils.presentToast({
        color: 'danger',
        message: 'Error al finalizar el viaje',
        duration: 2000
      });
    }
  }

  cancelarViaje() {
    try {
      this.viajesSvc.cancelarViaje(this.viaje);
    } catch (error) {
      this.utils.presentToast({
        color: 'danger',
        message: 'Error al cancelar el viaje',
        duration: 2000
      });
    }
  }

  terminarViaje() {
    try {
      if (this.viaje.estado === 'iniciado') this.viajesSvc.finalizarViaje(this.viaje);
      else this.viajesSvc.cancelarViaje(this.viaje);
    } catch (error) {
      this.utils.presentToast({
        color: 'danger',
        message: 'Error al terminar el viaje',
        duration: 2000
      });
    }
  }

  async obtenerViaje() {
    let xtras = this.router.getCurrentNavigation()?.extras.state;
    if (xtras) {
      this.viaje = xtras['viaje'];
    }
  }
}
