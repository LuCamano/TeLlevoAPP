import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { UtilsService } from './utils.service';
import { Mensaje } from '../models/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor() { }

  private authService = inject(AuthService);
  private utilsService = inject(UtilsService);
  mensajes: Mensaje[] = [];

  async crearMensaje(mensa: Mensaje, idViaje: string){
    try {
      // Crear la tabla en la base de datos
      if (mensa.id) delete mensa.id;
      return await this.authService.addDocument(`viajes/${idViaje}/mensajes`, mensa);
    } catch (error) {
      console.error('Error al crear el mensaje:', error);
      throw error;
    }
  }

  getMensajes(idViaje: string){
    try {
      (this.authService.getCollection(`viajes/${idViaje}/mensajes`) as unknown as Observable<Mensaje[]>).subscribe( msgs => this.mensajes = msgs);
      
    } catch (error) {
      console.error('Error al obtener los mensaje:', error);
      throw error;
    }
    

  }
}
