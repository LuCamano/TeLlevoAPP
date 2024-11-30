import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { UtilsService } from '../../../services/utils.service';
import { emailDomainValidator } from 'src/app/validators/domain.validator';
import { camposCoincidenValidator } from 'src/app/validators/campos-coinciden.validator';

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
    apellidos: new FormControl('', [Validators.required, Validators.minLength(4)]),
    email: new FormControl('', [Validators.email, Validators.required, emailDomainValidator]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password2: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  ngOnInit() {
    this.registroForm.controls.password2.setValidators([
      Validators.required,
      Validators.minLength(6),
      camposCoincidenValidator(this.registroForm.controls.password)
    ]);
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
      const apellidos = this.registroForm.value.apellidos;
      try {
        const user = await this.authSvc.signUp(email!, password!, nombre!, apellidos!);
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
