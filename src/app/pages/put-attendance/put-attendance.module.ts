import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PutAttendanceComponent } from './put-attendance.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction'; 
import { PutAttendanceRoutingModule } from './put-attendance-routing.module';
import { WebcamModule } from 'ngx-webcam';


@NgModule({
  declarations: [PutAttendanceComponent],
  imports: [
    CommonModule,
    PutAttendanceRoutingModule,
    NgSelectModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    AgmDirectionModule, 
    WebcamModule,   
    AgmCoreModule.forRoot({ // @agm/core
      apiKey: 'AIzaSyBgvgB3O0eJQmGPOjb80gqwIt28XkB1A80',
    }),
  ]
})
export class PutAttendanceModule { }
