import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdmViajesPageRoutingModule } from './adm-viajes-routing.module';

import { AdmViajesPage } from './adm-viajes.page';
import { ComponentsModule } from 'src/app/components/components.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdmViajesPageRoutingModule,
    ComponentsModule
  ],
  declarations: [AdmViajesPage]
})
export class AdmViajesPageModule {}
