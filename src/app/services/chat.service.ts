import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { UtilsService } from './utils.service';
import { Mensaje, Usuario } from '../models/models';
import { map, Observable } from 'rxjs';
import { FcmService } from './fcm.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  // Inyecciones de dependencias
  private authService = inject(AuthService);
  private utils = inject(UtilsService);
  private fcm = inject(FcmService);

  async crearMensaje(mensaje: string, idViaje: string) {
    try {
      let usrLocal = (await this.utils.getFromLocalStorage('user')) as Usuario;
      let nuevoMsg = {} as Mensaje;
      nuevoMsg.timestamp = Date.now(); // Añadir marca de tiempo
      nuevoMsg.mensaje = mensaje;
      nuevoMsg.remitente = usrLocal.name;
      nuevoMsg.remitenteId = usrLocal.uid;
      let mesRes = await this.authService.addDocument(`viajes/${idViaje}/mensajes`, nuevoMsg);
      this.fcm.notificarMensaje(idViaje, nuevoMsg);
      return mesRes;
    } catch (error) {
      console.error('Error al crear el mensaje:', error);
      throw error;
    }
  }

  getMensajes(idViaje: string) {
    return this.authService.getCollection(`viajes/${idViaje}/mensajes`).pipe(
      map( mensajes => {
        return (mensajes as Mensaje[]).sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
      })
    );
  }
}
