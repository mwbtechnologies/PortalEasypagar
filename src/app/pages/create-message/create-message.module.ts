import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateMessageComponent } from './create-message.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DataTablesModule } from 'angular-datatables';
import { CreateMessageRoutingModule } from './create-message-routing.module';


@NgModule({
  declarations: [CreateMessageComponent],
  imports: [
    CommonModule,
    CreateMessageRoutingModule,
    NgxDropzoneModule,
    NgSelectModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    DataTablesModule
  ]
})
export class CreateMessageModule { }
