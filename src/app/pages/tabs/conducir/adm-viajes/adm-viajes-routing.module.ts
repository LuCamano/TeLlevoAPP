import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdmViajesPage } from './adm-viajes.page';

const routes: Routes = [
  {
    path: '',
    component: AdmViajesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdmViajesPageRoutingModule {}
