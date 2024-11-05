import { Component, inject, OnInit } from '@angular/core';
import { Viaje } from 'src/app/models/models';
import { UtilsService } from 'src/app/services/utils.service';
import { ViajesService } from 'src/app/services/viajes.service';

@Component({
  selector: 'app-crear-viajes',
  templateUrl: './crear-viajes.page.html',
  styleUrls: ['./crear-viajes.page.scss'],
})
export class CrearViajesPage implements OnInit {
  // Inyección de dependencias
  private viajesSvc = inject(ViajesService);
  private utils = inject(UtilsService);

  viaje = {} as Viaje;

  ngOnInit() {
  }

  validarPrecio(event: any){
    this.viaje.precio = event.target.value.replace(/[^0-9]/g, '');
  }

  async submit(){
    this.viaje.estado = 'disponible';
    this.viaje.conductor = this.utils.getFromLocalStorage('user').uid;
    this.viaje.fecha = new Date(Date.now());
    console.log(this.viaje);
    const loading = await this.utils.presentLoading();
    loading.present();
    try {
      // Se crea el viaje
      await this.viajesSvc.crearViaje(this.viaje);
      // Se redirige a la página anterior
      this.utils.navigateBack();
      // Se muestra un mensaje de éxito
      return this.utils.presentToast({
        color: 'success',
        message: 'Viaje creado correctamente',
        duration: 2000
      });
    } catch (error) {
      this.utils.presentToast({
        color: 'danger',
        message: 'Error al crear el viaje',
        duration: 2000
      });
    } finally {
      loading.dismiss();
    }
  }
}
