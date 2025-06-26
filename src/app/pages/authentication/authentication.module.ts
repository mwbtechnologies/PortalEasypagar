import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { HttpClient } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    GooglePlaceModule
  ],
  declarations: []
})
export class AuthenticationModule { }
