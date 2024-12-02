import { Component, inject, OnInit, ViewChild} from '@angular/core';
import { IonContent } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Mensaje, Solicitud, Usuario, Viaje } from 'src/app/models/models';
import { AuthService } from 'src/app/services/auth.service';
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
  @ViewChild('mensajesContainer') mensajesContainer!: IonContent;

  private utils = inject(UtilsService);
  private mapbox = inject(MapboxService);
  private chatSvc = inject(ChatService);
  private viajesSvc = inject(ViajesService);
  private authSvc = inject(AuthService);

  map!: mapboxgl.Map;
  currentMarker!: mapboxgl.Marker;

  solicitudesModal = false;
  mensajesModal = false;

  private subSolicitudes!: Subscription;
  private subMensajes!: Subscription;

  mensajes: Mensaje[] = [];
  solicitudes: Solicitud[] = [];

  nuevoMensaje = '';

  viaje = {} as Viaje;
  usuario = {} as Usuario;
  private watchPosCallId!: string;

  ionViewWillEnter() {
    this.obtenerViaje();
    this.buildMap();
    this.getSolicitudes();
    this.verMensajes();
    this.datosLocalesUser();
  }

  ionViewWillLeave() {
    if (this.watchPosCallId) this.utils.clearWatch(this.watchPosCallId);
    if (this.subSolicitudes) this.subSolicitudes.unsubscribe();
    if (this.subMensajes) this.subMensajes.unsubscribe();
  }

  ngOnInit() {}
  
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

  async buildMap() {
    try {
      // Crear el mapa
      const mapa = await this.mapbox.buildMap((map1) => {
        // Cargar la ruta al iniciar el mapa
        // this.mapbox.obtenerRuta(map1, [longitude, latitude], [-73.08966273403564, -36.76762960060227]);
        this.mapbox.obtenerRutaConDirecciones(
          map1,
          this.viaje.origen.coordinates,
          this.viaje.destino.coordinates
        );

        // Crear marcador para la posición actual
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
      // Asignar el mapa a la propiedad
      this.map = mapa;
      return;
    } catch (error) {
      this.utils.presentToast({
        color: 'danger',
        message: 'Error al construir el mapa',
        duration: 2000,
      });
    }
  }

  getSolicitudes() {
    try {
      this.subSolicitudes = this.viajesSvc
        .getSolicitudes(this.viaje.id!)
        .subscribe((solicitudes) => {
          this.solicitudes = solicitudes;
        });
    } catch (error) {
      this.utils.presentToast({
        color: 'danger',
        message: 'Error al obtener las solicitudes',
        duration: 2000,
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
        duration: 2000,
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
        duration: 2000,
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
        duration: 2000,
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
        duration: 2000,
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
        duration: 2000,
      });
    }
  }

  terminarViaje() {
    this.utils.presentAlert({
      header: 'Terminar viaje',
      message: '¿Está seguro de que desea terminar el viaje?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Aceptar',
          role: 'ok',
          handler: () => {
            if (this.viaje.estado === 'iniciado') this.viajesSvc.finalizarViaje(this.viaje);
            else this.viajesSvc.cancelarViaje(this.viaje);
            this.utils.navigateBack();
          },
        },
      ],
    });
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
}
