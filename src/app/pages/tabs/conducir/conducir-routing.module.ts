import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConducirPage } from './conducir.page';

const routes: Routes = [
  {
    path: '',
    component: ConducirPage
  },  {
    path: 'crear-viajes',
    loadChildren: () => import('./crear-viajes/crear-viajes.module').then( m => m.CrearViajesPageModule)
  },
  {
    path: 'adm-viajes',
    loadChildren: () => import('./adm-viajes/adm-viajes.module').then( m => m.AdmViajesPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConducirPageRoutingModule {}
