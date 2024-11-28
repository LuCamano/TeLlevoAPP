import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VistaViajePage } from './vista-viaje.page';

const routes: Routes = [
  {
    path: '',
    component: VistaViajePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VistaViajePageRoutingModule {}
