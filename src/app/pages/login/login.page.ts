import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from '../../services/utils.service';
import { AuthService } from '../../services/auth.service';
import { FcmService } from 'src/app/services/fcm.service';
import { Platform } from '@ionic/angular';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  // Inyección de dependencias
  private utils = inject(UtilsService);
  private authSvc = inject(AuthService);
  private fcmSvc = inject(FcmService);
  private platform = inject(Platform);

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  ngOnInit() { }

  async iniciarSesion() {
    const { email, password } = this.loginForm.value;
    const loading = await this.utils.presentLoading();
    loading.present();
    try {
      const user = await this.authSvc.signIn(email!, password!);
      if (user) {
        if (this.platform.is('capacitor')){
          this.fcmSvc.initFcm();
        }
        this.utils.navigateRoot('/tabs');
      }
    } catch (error) {
      this.utils.presentToast({
        icon: 'close-circle-sharp',
        message: 'Credenciales incorrectas',
        color: 'danger',
        duration: 2500
      });
    } finally {
      loading.dismiss();
    }
  }
}
