import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Viaje } from '../models/models';
import { Observable } from 'rxjs';
import { IViajesOpts } from '../interfaces/varios';

@Injectable({
  providedIn: 'root'
})
export class ViajesService {
  // Inyecciones de dependencias
  authSvc = inject(AuthService);

  async crearViaje(viaje: Viaje){
    try {
      // Crear la tabla en la base de datos
      return await this.authSvc.addDocument('viajes', viaje);
    } catch (error) {
      console.error('Error al crear el viaje:', error);
      throw error;
    }
  }

  getViajes(opts?: IViajesOpts): Observable<Viaje[]> {
    try {
      // Obtener los viajes de la base de datos
      if (opts) {
        return this.authSvc.getCollection('viajes', opts) as Observable<Viaje[]>;
      } else {
        return this.authSvc.getCollection('viajes') as Observable<Viaje[]>;
      }
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
}
