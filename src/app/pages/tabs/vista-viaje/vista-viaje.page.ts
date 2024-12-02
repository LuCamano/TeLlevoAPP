import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Mensaje, Usuario, Viaje } from 'src/app/models/models';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { MapboxService } from 'src/app/services/mapbox.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ViajesService } from 'src/app/services/viajes.service';

@Component({
  selector: 'app-vista-viaje',
  templateUrl: './vista-viaje.page.html',
  styleUrls: ['./vista-viaje.page.scss'],
})
export class VistaViajePage implements OnInit {
  // Inyectar servicios
  private viajesSvc = inject(ViajesService);
  private utils = inject(UtilsService);
  private chatSvc = inject(ChatService);
  private mapbox = inject(MapboxService);
  private authSvc = inject(AuthService);

  @ViewChild('mensajesContainer') mensajesContainer!: IonContent;

  map!: mapboxgl.Map;
  currentMarker!: mapboxgl.Marker;

  private subMensajes!: Subscription;

  mensajesModal = false;

  mensajes: Mensaje[] = [];

  nuevoMensaje = '';

  viaje = {} as Viaje;
  usuario = {} as Usuario;
  private watchPosCallId!: string;

  ngOnInit() {}

  ionViewWillEnter() {
    this.obtenerViaje();
    this.buildMap();
    this.verMensajes();
    this.datosLocalesUser();
  }

  ionViewWillLeave() {
    if (this.watchPosCallId) this.utils.clearWatch(this.watchPosCallId);
  }

  async buildMap() {
    try {
      // Crear el mapa
      const map = await this.mapbox.buildMap((mapa) => {
        // Agregar la ruta al mapa
        this.mapbox.obtenerRutaConDirecciones(
          mapa,
          this.viaje.origen.coordinates,
          this.viaje.destino.coordinates
        );
  
        // Agregar marcador al mapa
        this.currentMarker = this.mapbox.crearMarcador(
          mapa,
          this.viaje.origen.coordinates,
          {
            element: this.mapbox.crearElementoMarcadorAuto(),
            pitchAlignment: 'auto',
            draggable: false,
          }
        );
  
        // Actualizar la posición del marcador
        this.utils.watchPosition({}, (position) => {
          const { latitude, longitude } = position!.coords;
          this.currentMarker.setLngLat([longitude, latitude]);
          this.map.flyTo({
            center: [longitude, latitude],
            pitch: this.map.getPitch(),
            bearing: this.map.getBearing(),
          });
        }).then((id) => (this.watchPosCallId = id));
      });
      this.map = map;
      return;
    } catch (error) {
      this.utils.presentToast({
        color: 'danger',
        message: 'Error al construir el mapa',
        duration: 2000,
      });
      this.utils.navigateBack();
    }
  }

  async obtenerViaje() {
    try {
      this.viaje = this.viajesSvc.getViajeEnCurso!;
      if (!this.viaje) {
        throw new Error('No hay un viaje en curso');
      }
    } catch (error) {
      this.utils.presentToast({
        color: 'danger',
        message: 'Error al obtener el viaje',
        icon: 'alert-circle',
        duration: 2000,
      });
      this.utils.navigateBack();
    }
  }

  verMensajes() {
    this.subMensajes = this.chatSvc.getMensajes(this.viaje.id!).subscribe(
      msgs => {
        this.mensajes = msgs; // Mensajes ordenados por timestamp
        setTimeout(() => this.mensajesContainer.scrollToBottom(),20); // Desplazamiento automático al fondo   
      }
    );
  }

  enviarMensaje() {
    if (this.nuevoMensaje != '') {
      try {
        this.chatSvc.crearMensaje(this.nuevoMensaje, this.viaje.id!);

        this.nuevoMensaje = ''; // Limpiar el campo de texto
      } catch (error) {
        this.utils.presentToast({
          color: 'danger',
          message: 'Error:' + error,
          duration: 2000,
        });
      }
    }
  }
  datosLocalesUser() {
    let userLocal: Usuario = this.utils.getFromLocalStorage('user');
    if (userLocal) {
      this.usuario = userLocal;
    } else {
      this.authSvc.getCurrentUserData().then((usr) => {
        if (usr) this.usuario = usr;
        else this.usuario = { email: '', name: '', lastName: '', uid: '' };
      });
    }
  }
}
