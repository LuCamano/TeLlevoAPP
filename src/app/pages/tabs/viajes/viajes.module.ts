import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViajesPageRoutingModule } from './viajes-routing.module';

import { ViajesPage } from './viajes.page';
import { ComponentsModule } from "../../../components/components.module";
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViajesPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ViajesPage],
  providers: [DatePipe]
})
export class ViajesPageModule {}
