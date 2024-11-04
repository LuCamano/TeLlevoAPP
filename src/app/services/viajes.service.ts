import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Viaje } from '../models/models';

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
}
