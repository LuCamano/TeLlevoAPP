import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UtilsService } from '../services/utils.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authSvc = inject(AuthService);
  const utils = inject(UtilsService);

  let user = utils.getFromLocalStorage('user');

  return new Promise( resolve => {
    authSvc.getAuthIns().onAuthStateChanged( auth => {
      if (auth) {
        if (user) resolve(true);
      } else {
        utils.navigateRoot('/login');
        resolve(false);
      }
    });
  });
};
