import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction'; 
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    NgMultiSelectDropDownModule,
    ProfileRoutingModule,
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
export class ProfileModule { }
