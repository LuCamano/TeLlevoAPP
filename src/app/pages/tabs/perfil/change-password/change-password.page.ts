import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { UtilsService } from '../../../../services/utils.service';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {
  
  private authSvc = inject(AuthService);
  private utils = inject(UtilsService);
  
  
  passwordForm = new FormGroup({
    currentPassword: new FormControl('', Validators.required),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  constructor() { }

  ngOnInit() {
  }

  async changePassword() {
    if (this.passwordForm.invalid) return;

    const { currentPassword, newPassword } = this.passwordForm.value;
    const loading = await this.utils.presentLoading();
    loading.present();

    try {
      await this.authSvc.changePassword(newPassword!, currentPassword!);
      this.utils.presentToast({
        message: 'Contraseña actualizada con éxito',
        color: 'success',
        duration: 2500
      });
      this.passwordForm.reset();
      this.utils.navigateBack();
    } catch (error) {
      this.utils.presentToast({
        message: 'Error al cambiar la contraseña. Verifica tus datos.',
        color: 'danger',
        duration: 2500
      });
    } finally {
      loading.dismiss();
    }
  }
}
