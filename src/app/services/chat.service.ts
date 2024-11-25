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
  

  async crearMensaje(mensa: Mensaje, idViaje: string) {
    try {
        mensa.timestamp = Date.now(); // Añadir marca de tiempo
        if (mensa.id) delete mensa.id; // Eliminar `id` si está presente
        return await this.authService.addDocument(`viajes/${idViaje}/mensajes`, mensa);
    } catch (error) {
        console.error('Error al crear el mensaje:', error);
        throw error;
    }
}

getMensajes(idViaje: string): Observable<Mensaje[]> {
  return new Observable<Mensaje[]>((subscriber) => {
    try {
      (this.authService.getCollection(`viajes/${idViaje}/mensajes`) as Observable<Mensaje[]>).subscribe({
        next: (msgs) => {
          // Ordenar los mensajes por el campo 'timestamp'
          const mensajesOrdenados = msgs.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
          subscriber.next(mensajesOrdenados);
        },
        error: (error) => {
          console.error('Error al obtener los mensajes:', error);
          subscriber.error(error);
        },
      });
    } catch (error) {
      console.error('Error al obtener los mensajes2:', error);
      subscriber.error(error);
    }
  });
}
}
