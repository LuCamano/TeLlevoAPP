import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VistaViajePageRoutingModule } from './vista-viaje-routing.module';

import { VistaViajePage } from './vista-viaje.page';
import { ComponentsModule } from "../../../components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VistaViajePageRoutingModule,
    ComponentsModule
],
  declarations: [VistaViajePage]
})
export class VistaViajePageModule {}
