import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthSigninComponent } from './auth-signin.component';
import { AuthSigninRoutingModule } from './auth-signin-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [AuthSigninComponent],
  imports: [
    CommonModule,
    AuthSigninRoutingModule,
    FormsModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    NgxSpinnerModule,
    NgbModule
  ]
})
export class AuthSigninModule { }
