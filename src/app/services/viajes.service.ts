import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Viaje } from '../models/models';
import { map, Observable } from 'rxjs';
import { IViajesOpts } from '../interfaces/varios';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class ViajesService {
  // Inyecciones de dependencias
  private authSvc = inject(AuthService);
  private utils = inject(UtilsService);

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

  getViajes(opts?: IViajesOpts): Observable<Viaje[]> {
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

  async unirseAlViaje(viaje: Viaje){
    try {
      // Unirse a un viaje
      let uid = this.utils.getFromLocalStorage('user').uid as string;
      if (viaje.pasajeros) {

        if (viaje.pasajeros.includes(uid)) throw new Error('Ya te encuentras en el viaje');
        else viaje.pasajeros.push(uid);

      } else {
        viaje.pasajeros = [uid];
      }
      return await this.actualizarViaje(viaje);
    } catch (error) {
      console.error('Error al unirse al viaje:', error);
      throw error;
    }
  }
}
