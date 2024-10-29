import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ForgotPasswordPageRoutingModule } from './forgot-password-routing.module';

import { ForgotPasswordPage } from './forgot-password.page';
import { ComponentsModule } from "../../../components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ForgotPasswordPageRoutingModule,
    ComponentsModule
],
  declarations: [ForgotPasswordPage]
})
export class ForgotPasswordPageModule {}
