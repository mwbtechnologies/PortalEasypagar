import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatInputModule} from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {MatDialogModule} from '@angular/material/dialog';
import { NgxSpinnerModule } from 'ngx-spinner';
import {MatSelectModule} from '@angular/material/select';
import { ChatRoutingModule } from './chat-routing.module';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ChatComponent} from './chat.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CreateMessageComponent } from './create-message/create-message.component';

@NgModule({
  declarations: [ChatComponent,CreateMessageComponent],
  imports: [
    CommonModule,
    ChatRoutingModule,
    NgScrollbarModule,
    MatSelectModule,
    NgxSpinnerModule,
    MatDialogModule,
    HttpClientModule,
    FormsModule,ReactiveFormsModule,
    MatInputModule,
    NgSelectModule,
    NgxDropzoneModule,
    NgMultiSelectDropDownModule.forRoot(),
    MatSelectModule,
    MatTooltipModule,
  ]
})
export class ChatModule { }
