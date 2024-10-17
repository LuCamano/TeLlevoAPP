import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { UtilsService } from '../../../services/utils.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  // Inyectar las dependencias
  authSvc = inject(AuthService);
  utils = inject(UtilsService);

  registroForm = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.minLength(4)]),
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password2: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  ngOnInit() {
  }


  validarContraseniasIguales() {
    const pass1 = this.registroForm.value.password;
    const pass2 = this.registroForm.value.password2;

    if (pass1 !== pass2) {
      this.registroForm.controls.password2.setErrors({ noIguales: true});
    }
  }

  async registrar() {
    if (this.registroForm.valid) {
      const loading = await this.utils.presentLoading();
      loading.present();
      const email = this.registroForm.value.email;
      const password = this.registroForm.value.password;
      const nombre = this.registroForm.value.nombre;
      try {
        const user = await this.authSvc.signUp(email!, password!, nombre!);
        if (user) {
          this.utils.navigateForwardto("/login");
        }
      } catch (error) {
        this.utils.presentToast({
          icon: 'close-circle-sharp',
          message: 'Error al registrarse',
          color: 'danger',
          duration: 2500
        });
      } finally {
        loading.dismiss();
      }
    }
  }
}
