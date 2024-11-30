import { Component, inject, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Viaje } from 'src/app/models/models';
import { UtilsService } from 'src/app/services/utils.service';
import { ViajesService } from 'src/app/services/viajes.service';

@Component({
  selector: 'app-conducir',
  templateUrl: './conducir.page.html',
  styleUrls: ['./conducir.page.scss'],
})
export class ConducirPage implements OnInit {
  // Inyección de dependencias
  private viajesSvc = inject(ViajesService);
  private utils = inject(UtilsService);

  viajes: Viaje[] = [];
  viajeEnCurso: { status: boolean, viaje?: Viaje, esConductor?: boolean } = { status: false }; 


  public isLoading = false;

  private subViajes!: Subscription;
  private viajeEnCursoSub!: Subscription;

  ngOnInit() {}

  ionViewWillEnter() {
    this.obtenerViajes();
    this.obtenerViajeEnCurso();
  }

  ionViewWillLeave() {
    if (this.subViajes) this.subViajes.unsubscribe();
    if (this.viajeEnCursoSub) this.viajeEnCursoSub.unsubscribe();
  }

  obtenerViajes() {
    // Obtener los viajes del conductor
    this.isLoading = true;
    try {
      this.subViajes = this.viajesSvc
        .getViajes([
          {
            // Buscar el campo conductor
            field: 'conductor',
            // Que sea igual al uid del usuario
            opStr: '==',
            value: this.utils.getFromLocalStorage('user').uid,
          },
        ])
        .subscribe((listViajes) => {
          this.viajes = listViajes;
          this.isLoading = false;
        });
    } catch (error) {
      this.utils.presentToast({
        color: 'danger',
        message: 'Error al obtener los viajes',
        duration: 2000,
      });
    }
  }

  obtenerViajeEnCurso() {
    const uid = this.utils.getFromLocalStorage('user').uid;
    this.viajeEnCursoSub = this.viajesSvc.revisarSiHayViajeEnCurso(uid).subscribe(
      resp => {
        this.viajeEnCurso = resp;
        this.viajesSvc.setViajeEnCurso(resp.viaje);
      }
    );
  }
}
