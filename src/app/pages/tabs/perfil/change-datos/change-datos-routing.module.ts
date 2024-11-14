import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChangeDatosPage } from './change-datos.page';

const routes: Routes = [
  {
    path: '',
    component: ChangeDatosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChangeDatosPageRoutingModule {}
