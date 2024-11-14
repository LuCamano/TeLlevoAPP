import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChangeDatosPageRoutingModule } from './change-datos-routing.module';

import { ChangeDatosPage } from './change-datos.page';
import { ComponentsModule } from "../../../../components/components.module";
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    ReactiveFormsModule,
    ChangeDatosPageRoutingModule
  ],
  declarations: [ChangeDatosPage]
})
export class ChangeDatosPageModule {}
