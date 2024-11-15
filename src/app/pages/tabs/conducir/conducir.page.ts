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

  public isLoading = false;

  private subViajes!: Subscription;

  conduciendo = false;
  dePasajero = false;

  private subConductor!: Subscription;
  private subPasajero!: Subscription;

  ngOnInit() {}

  ionViewWillEnter() {
    this.obtenerViajes();
    this.comprobarViajeEnCurso();
  }

  ionViewWillLeave() {
    if (this.subViajes) this.subViajes.unsubscribe();
    if (this.subConductor) this.subConductor.unsubscribe();
    if (this.subPasajero) this.subPasajero.unsubscribe();
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

  comprobarViajeEnCurso() {
    const uid = this.utils.getFromLocalStorage('user').uid;
    const { asConductor, asPasajero } = this.viajesSvc.revisarSiHayViajeEnCurso(uid);
    this.subConductor = asConductor.subscribe( resp => {
      this.conduciendo = resp.status;
      if (resp.status) {
        this.utils.saveInLocalStorage('viajeEnCurso', resp.viaje);
      };
    });
    this.subPasajero = asPasajero.subscribe( resp => {
      this.dePasajero = resp.status;
      if (resp.status) {
        this.utils.saveInLocalStorage('viajeEnCurso', resp.viaje);
      };
    });
  }
}
