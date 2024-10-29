import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UtilsService } from '../services/utils.service';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const authSvc = inject(AuthService);
  const utils = inject(UtilsService);

  return new Promise( resolve => {
    authSvc.getAuthIns().onAuthStateChanged( auth => {
      if (!auth) {
        resolve(true);
      } else {
        utils.navigateRoot('/tabs/home');
        resolve(false);
      }
    });
  });
};
