import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Solicitud, Usuario, Viaje } from '../models/models';
import { combineLatest, map, Observable } from 'rxjs';
import { IViajesOpts } from '../interfaces/varios';
import { UtilsService } from './utils.service';
import { FcmService } from './fcm.service';


@Injectable({
  providedIn: 'root'
})
export class ViajesService {
  // Inyecciones de dependencias
  private authSvc = inject(AuthService);
  private utils = inject(UtilsService);
  private fcm = inject(FcmService);

  async crearViaje(viaje: Viaje){
    try {
      // Crear la tabla en la base de datos
      if (viaje.id) delete viaje.id;
      return await this.authSvc.addDocument('viajes', viaje);
    } catch (error) {
      console.error('Error al crear el viaje:', error);
      throw error;
    }
  }

  getViajes(opts?: IViajesOpts[]): Observable<Viaje[]> {
    try {
      // Obtener los viajes de la base de datos
      let viajes$ = (opts ? this.authSvc.getCollection('viajes', opts) : this.authSvc.getCollection('viajes')) as Observable<Viaje[]>;
      return viajes$.pipe(
        map( viajes => viajes.map( viaje => {
          if (viaje.fecha && (viaje.fecha as any).seconds) {
            viaje.fecha = new Date((viaje.fecha as any).seconds * 1000);
          }
          return viaje;
        }))
      );
    } catch (error) {
      console.error('Error al obtener los viajes:', error);
      throw error;
    }
  }

  async getViaje(id: string) {
    try {
      // Obtener un viaje de la base de datos
      let viaje = await this.authSvc.getDocument(`viajes/${id}`) as Viaje;
      viaje.id = id;
      return viaje;
    } catch (error) {
      console.error('Error al obtener el viaje:', error);
      throw error;
    }
  }

  async actualizarViaje(viaje: Viaje){
    try {
      // Actualizar un viaje en la base de datos
      let nuevoViaje = { ...viaje };
      delete nuevoViaje.id;
      return await this.authSvc.setDocument(`viajes/${viaje.id}`, nuevoViaje);
    } catch (error) {
      console.error('Error al actualizar el viaje:', error);
      throw error;
    }
  }

  async actualizarSolicitud(solicitud:Solicitud, idViaje:string) {
    try {
      // Actualizar una solicitud en la base de datos
      let nuevaSolicitud = { ...solicitud };
      delete nuevaSolicitud.id;
      return await this.authSvc.setDocument(`viajes/${idViaje}/solicitudes/${solicitud.id}`, nuevaSolicitud);
    } catch (error) {
      console.error('Error al actualizar la solicitud:', error);
      throw error;
    }
  }

  async unirseAlViaje(viaje: Viaje){
    const user = this.utils.getFromLocalStorage('user') as Usuario;
    const sub = this.getSolicitudes(viaje.id!, user.uid).subscribe( solis => {
      try {
        if (solis.length > 0) throw new Error('Ya hay una solicitud en este viaje.')
        this.solicitarUnirseAlViaje(viaje);
        this.utils.presentAlert({
          header: 'Solicitud enviada',
          message: 'Se ha enviado la solicitud para unirse al viaje',
          buttons: ['Aceptar']
        });
      } catch (error) {
        console.error('Error', error);
        this.utils.presentAlert({
          header: 'No se envió la solicitud',
          message: 'No se pudo enviar la solicitud debido a que ya se envió una solicitud a este viaje',
          buttons: ['Aceptar']
        });
      } finally {
        sub.unsubscribe();
      }
    });
  }

  async solicitarUnirseAlViaje(viaje: Viaje) {


    if (!viaje.id) throw new Error('No se ha especificado el viaje');
    try {
      // Crear la solicitud
      const {uid, name, lastName} = (this.utils.getFromLocalStorage('user') as Usuario);
      let solicitud: Solicitud = {
        uidPasajero: uid,
        pasajero: `${name} ${lastName}`,
        estado: 'PENDIENTE'
      };
      const respSoli = await this.authSvc.addDocument(`viajes/${viaje.id}/solicitudes`, solicitud);
      // Enviar notificación al conductor
      this.fcm.notificarSolicitud(viaje.id);
      return respSoli;
    } catch (error) {
      console.error('Error al solicitar unirse al viaje:', error);
      throw error;
    }
  }

  async aceptarSolicitud(solicitud: Solicitud, viaje: Viaje){
    try {
      const uid = solicitud.uidPasajero;
      if (viaje.pasajeros) {
        viaje.pasajeros.push(uid);
      } else {
        viaje.pasajeros = [uid];
      }
      solicitud.estado = 'ACEPTADA';
      await this.actualizarViaje(viaje);
      await this.actualizarSolicitud(solicitud, viaje.id!);
      // Enviar notificación al pasajero
      this.fcm.notificarAceptacion(uid);
    } catch (error) {
      console.error('Error al aceptar la solicitud:', error);
      throw error;
    }
  }

  async rechazarSolicitud(solicitud: Solicitud, viaje: Viaje){
    try {
      solicitud.estado = 'RECHAZADA';
      await this.actualizarSolicitud(solicitud, viaje.id!);
      // Enviar notificación al pasajero
      this.fcm.notificarRechazo(solicitud.uidPasajero);
    } catch (error) {
      console.error('Error al rechazar la solicitud:', error);
      throw error;
    }
  }

  revisarSiHayViajeEnCurso(uid: string) {
    let asPasajero = this.getViajes([
      {
        field: 'pasajeros',
        opStr: 'array-contains',
        value: uid
      },
      {
        field: 'estado',
        opStr: 'in',
        value: ['iniciado', 'preparándose', 'disponible']
      }
    ]).pipe(map(viajes => {
      if (viajes.length > 0) {
        return { status: true, viaje: viajes[0], esConductor: false };
      } else {
        return { status: false, esConductor: false };
      }
    }));

    let asConductor = this.getViajes([
      {
        field: 'conductor',
        opStr: '==',
        value: uid
      },
      {
        field: 'estado',
        opStr: 'in',
        value: ['iniciado', 'preparándose', 'disponible']
      }
    ]).pipe(map(viajes => {
      if (viajes.length > 0) {
        return { status: true, viaje: viajes[0], esConductor: true };
      } else {
        return { status: false, esConductor: true };
      }
    }));

    return combineLatest([asPasajero, asConductor]).pipe(
      map(([pasajeroResult, conductorResult]) => {
        if (pasajeroResult.status) {
          return pasajeroResult;
        } else if (conductorResult.status) {
          return conductorResult;
        } else {
          return { status: false, esConductor: false };
        }
      })
    );
  }

  setViajeEnCurso(viajeEnCurso: any) {
    if (viajeEnCurso !== undefined) {
      this.utils.saveInLocalStorage('viajeEnCurso', viajeEnCurso);
    }
  }

  getViajeEnCurso() {
    return this.utils.getFromLocalStorage('viajeEnCurso').viaje;
  }

  getSolicitudes(viajeId: string, userUid?: string) {
    return this.authSvc.getCollection(`viajes/${viajeId}/solicitudes`, [{field: 'uidPasajero', opStr: '==', value: userUid}]) as Observable<Solicitud[]>;
  }

  prepararViaje(viaje: Viaje){
    try {
      viaje.estado = 'preparándose';
      return this.actualizarViaje(viaje);
    } catch (error) {
      console.error('Error al preparar el viaje:', error);
      throw error;
    }
  }

  iniciarViaje(viaje: Viaje){
    try {
      viaje.estado = 'iniciado';
      return this.actualizarViaje(viaje);
    } catch (error) {
      console.error('Error al iniciar el viaje:', error);
      throw error;
    }
  }

  finalizarViaje(viaje: Viaje){
    try {
      viaje.estado = 'finalizado';
      return this.actualizarViaje(viaje);
    } catch (error) {
      console.error('Error al finalizar el viaje:', error);
      throw error;
    }
  }

  async cancelarViaje(viaje: Viaje){
    try {
      viaje.estado = 'cancelado';
      return await this.actualizarViaje(viaje);
    } catch (error) {
      console.error('Error al cancelar el viaje:', error);
      throw error;
    }
  }

  abandonarViaje(viaje: Viaje, uid: string){
    try {
      if (viaje.pasajeros) {
        viaje.pasajeros = viaje.pasajeros.filter( pasajero => pasajero !== uid );
      }
      return this.actualizarViaje(viaje);
    } catch (error) {
      console.error('Error al abandonar el viaje:', error);
      throw error;
    }
  }
}
