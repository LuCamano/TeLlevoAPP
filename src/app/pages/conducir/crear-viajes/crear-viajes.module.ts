import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearViajesPageRoutingModule } from './crear-viajes-routing.module';

import { CrearViajesPage } from './crear-viajes.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearViajesPageRoutingModule,
    ComponentsModule
  ],
  declarations: [CrearViajesPage]
})
export class CrearViajesPageModule {}
