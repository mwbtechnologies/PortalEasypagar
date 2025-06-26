import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthSignupRoutingModule } from './auth-signup-routing.module';
import { AuthSignupComponent } from './auth-signup.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction'; 
import { PlacesComponent } from '../../places/places.component';

@NgModule({
  declarations: [AuthSignupComponent,PlacesComponent],
  imports: [
    CommonModule,
    AuthSignupRoutingModule,
    NgSelectModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    AgmDirectionModule,    
    AgmCoreModule.forRoot({ // @agm/core
      apiKey: 'AIzaSyBgvgB3O0eJQmGPOjb80gqwIt28XkB1A80',
    }),
  ]
})
export class AuthSignupModule { }
