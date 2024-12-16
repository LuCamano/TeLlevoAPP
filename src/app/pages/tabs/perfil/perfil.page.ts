import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { UtilsService } from '../../../services/utils.service';
import { Usuario, Viaje } from 'src/app/models/models';
import { ViajesService } from 'src/app/services/viajes.service';
import { from, Subscription, switchMap } from 'rxjs';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  // Inyectar los servicios
  private authSvc = inject(AuthService);
  private utils = inject(UtilsService);
  private viajesSvc = inject(ViajesService);

  usuario = {} as Usuario;
  viajes: Viaje[] = [];

  private viajesSub!: Subscription;

  constructor() {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.obtenerViajes();
    this.datosLocalesUser();
  }

  ionViewWillLeave() {
    this.viajesSub.unsubscribe();
  }

  datosLocalesUser() {
    let userLocal: Usuario = this.utils.getFromLocalStorage('user');
    if (userLocal) {
      this.usuario = userLocal;
    } else {
      this.authSvc.getCurrentUserData().then((usr) => {
        if (usr) this.usuario = usr;
        else this.usuario = { email: '', name: '', lastName: '', uid: '' };
      });
    }
  }

  async obtenerViajes() {
    if (await this.utils.checkInternet()) {
      this.viajesSub = this.getViajesUser()
        .pipe(
          switchMap((viajes) =>
            from(
              Promise.all(
                viajes.map(async (viaje) => {
                  let conductor = (await this.authSvc.getDocument(
                    `usuarios/${viaje.conductor}`
                  )) as Usuario;
                  viaje.conductor = conductor.name;
                  return viaje;
                })
              )
            )
          )
        )
        .subscribe((newViajes) => {
          this.viajes = newViajes;
          this.utils.saveInLocalStorage('viajesLocales', newViajes);
        });
    } else {
      this.obtenerViajesLocal();
    }
  }

  obtenerViajesLocal() {
    let viajesLocales: Viaje[] = this.utils.getFromLocalStorage('viajesLocales');
    this.viajes = viajesLocales;
  }

  getViajesUser() {
    let uid = this.utils.getFromLocalStorage('user').uid;
    return this.viajesSvc.getViajes([
      { field: 'pasajeros', opStr: 'array-contains', value: uid },
      { field: 'estado', opStr: 'in', value: ['iniciado', 'finalizado'] },
    ]);
  }
}
