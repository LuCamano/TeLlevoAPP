import { Component, inject, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../../../../services/auth.service';
import { UtilsService } from '../../../../services/utils.service';
import { Usuario } from 'src/app/models/models';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-change-datos',
  templateUrl: './change-datos.page.html',
  styleUrls: ['./change-datos.page.scss'],
})
export class ChangeDatosPage implements OnInit {

  private authSvc = inject(AuthService);
  private utils = inject(UtilsService);

  nombre!: string;
  apellido!: string;
  
  constructor() { }

  profileForm = new FormGroup({
    name: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.email]),
  });

  ngOnInit() {
    this.loadUserData();
    this.user();
  }

  async loadUserData() {
    try {
      const userData = await this.authSvc.getCurrentUserData();
      this.profileForm.setValue({
        name: userData.name || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
      });
    } catch (error) {
      this.utils.presentToast({
        message: 'Error al cargar los datos del usuario',
        color: 'danger'
      });
    }
  }
  async user() {
    this.authSvc.getAuthIns().onAuthStateChanged( user => {
      let userLocal:Usuario = this.utils.getFromLocalStorage('user');

      if(userLocal) {
        this.nombre = userLocal.name
        this.apellido = userLocal.lastName

      } else {
        this.authSvc.getCurrentUserData().then( usr => {
          if (usr) this.nombre = usr.name;
          else this.nombre = '';
        });
      }
    })
  }
  async saveProfile() {
    const loading = await this.utils.presentLoading();
    loading.present();
    try {
      // Obtener los datos del formulario
      const { name, lastName } = this.profileForm.value;
      const userId = this.authSvc.getAuthIns().currentUser?.uid;
      
      const localUser = this.utils.getFromLocalStorage('user');
      const email = localUser?.email || this.profileForm.get('email')?.value;
      const id = localUser?.uid || this.authSvc.getAuthIns().currentUser?.uid;
      // Guardar los datos actualizados en la base de datos
      await this.authSvc.setDocument(`usuarios/${userId}`, { email, lastName, name, uid:id });
      
      // Actualizar el usuario en el almacenamiento local
      const updatedUser = { name, lastName, email, uid: id };
      this.utils.saveInLocalStorage('user', updatedUser);
      
      // Mostrar un mensaje de éxito
      this.utils.presentToast({
        message: 'Perfil actualizado con éxito',
        color: 'success',
        duration: 2500
      });
      
      // Actualizar la vista con los datos locales
      this.user();
    } catch (error) {
      // Manejar el error
      this.utils.presentToast({
        message: 'Error al actualizar el perfil',
        color: 'danger',
        duration: 2500
      });
    } finally {
      // Cerrar el loading
      loading.dismiss();
    }
  }

}
