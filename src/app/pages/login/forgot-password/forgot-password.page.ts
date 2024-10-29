import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  // Inyecciones
  private authSvc = inject(AuthService);
  private utils = inject(UtilsService);

  emailForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required])
  });

  ngOnInit() {
  }

  async sendEmail() {
    const email = this.emailForm.value.email;
    if (email) {
      const loading = await this.utils.presentLoading();
      loading.present();
      this.authSvc.resetPasswordEmail(email).catch( error => {
        this.utils.presentToast({
          icon: 'close-circle-sharp',
          message: 'Ocurrió un error, Vuelva a intentarlo.',
          color: 'danger',
          duration: 2500
        });
      }).finally( () => {
        loading.dismiss();
        this.utils.presentAlert({
          header: 'Correo enviado',
          message: 'Revisa tu bandeja de entrada para restablecer tu contraseña.',
          buttons: ['Aceptar']
        }).then( alert => {
          alert.onDidDismiss().then( () => {
            this.utils.navigateRoot('/login');
          });
        })
      });
    }
  }

}
