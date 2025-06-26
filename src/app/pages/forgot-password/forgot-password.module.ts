import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgOtpInputModule } from 'ng-otp-input';
import { ForgotPasswordRoutingModule } from './forgot-password-routing.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ForgotPasswordRoutingModule,
    NgOtpInputModule
  ]
})
export class ForgotPasswordModule { }
