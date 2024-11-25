import { Component, inject, OnInit ,ViewChild} from '@angular/core';
import { Subscription, Observable, map } from 'rxjs';
import { Mensaje, Solicitud, Usuario, Viaje } from 'src/app/models/models';
import { ChatService } from 'src/app/services/chat.service';
import { MapboxService } from 'src/app/services/mapbox.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ViajesService } from 'src/app/services/viajes.service';


@Component({
  selector: 'app-adm-viajes',
  templateUrl: './adm-viajes.page.html',
  styleUrls: ['./adm-viajes.page.scss'],
})
export class AdmViajesPage implements OnInit {
  @ViewChild("content") content: any;
  
  private utils = inject(UtilsService);
  private mapbox = inject(MapboxService);
  private viajesSvc = inject(ViajesService);
  private chatSvc = inject(ChatService);
  
  map!: mapboxgl.Map;
  currentMarker!: mapboxgl.Marker;

  solicitudesModal = false;
  mensajesModal = false;
  
  private subSolicitudes!: Subscription;

  constructor() { }
  mensajes : Mensaje[] = [];
  solicitudes:Solicitud[] = [];
  mens = {} as Mensaje;
  
  viaje = {} as Viaje;
  nuevoMensaje = '';
  private watchPosCallId!: string;
  ionViewWillEnter() {
    this.obtenerViaje();
    this.buildMap();
    this.getSolicitudes();
    this.verMensajes();
  }
  
  ionViewWillLeave() {
    if (this.watchPosCallId) this.utils.clearWatch(this.watchPosCallId);
    if (this.subSolicitudes) this.subSolicitudes.unsubscribe();
  }

  ngOnInit() {
  }
  verMensajes() {
    this.chatSvc.getMensajes(this.viaje.id!).subscribe(
        (msgs: Mensaje[]) => {
            this.mensajes = msgs; // Mensajes ordenados por timestamp
            setTimeout(() => this.scrollToBottom2(), 300);  // Retrasar el scroll
        },
        (error) => {
            this.utils.presentToast({
                color: 'danger',
                message: 'Error al cargar los mensajes',
                duration: 2000,
            });
            console.error('Error al obtener mensajes:', error);
        }
    );
    this.scrollToBottom2();
}

enviarMensaje() {
  let userLocal: Usuario = this.utils.getFromLocalStorage('user');
  if (this.nuevoMensaje != '') {
    this.mens.mensaje = this.nuevoMensaje;
    this.mens.remitente = userLocal.name;
    try {
      this.chatSvc.crearMensaje(this.mens, this.viaje.id!);
      
      this.nuevoMensaje = '';
    } catch (error) {
      this.utils.presentToast({
        color: 'danger',
        message: 'Error:'+ error,
        duration: 2000,
    });
    }
  }
  
}
scrollToBottom2(duration: number = 300): void {
  this.content.scrollToBottom(duration); // Desplazamiento automático al fondo
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
      localStorage.removeItem('viajeEnCurso');
      this.utils.navigateBack();
    } catch (error) {
      this.utils.presentToast({
        color: 'danger',
        message: 'Error al terminar el viaje',
        duration: 2000
      });
    }
  }

  async obtenerViaje() {
    try {
      this.viaje = this.utils.getFromLocalStorage('viajeEnCurso') as Viaje;
      if (!this.viaje) {
        throw new Error('No hay un viaje en curso');
      }
    } catch (error) {
      this.utils.presentToast({
        color: 'danger',
        message: 'Error al obtener el viaje',
        icon: 'alert-circle',
        duration: 2000
      });
      this.utils.navigateBack();
    }
  }


}
