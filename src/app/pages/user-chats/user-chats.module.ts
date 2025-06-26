import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {MatDialogModule} from '@angular/material/dialog';
import { NgxSpinnerModule } from 'ngx-spinner';
import {MatSelectModule} from '@angular/material/select';
import { UserChatsRoutingModule } from './user-chats-routing.module';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { UserChatsComponent} from './user-chats.component';


@NgModule({
  declarations: [UserChatsComponent],
  imports: [
    CommonModule,
    UserChatsRoutingModule,
    NgScrollbarModule,
    MatSelectModule,
    NgxSpinnerModule,
    MatDialogModule,
    HttpClientModule,
    FormsModule,
    MatInputModule,
    NgSelectModule,
    NgxDropzoneModule
  ]
})
export class UserChatsModule { }
