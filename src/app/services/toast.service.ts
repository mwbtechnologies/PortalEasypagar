import { Injectable } from '@angular/core';
import {ToastrService} from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})

export class ToastService {

    constructor(private toastyService: ToastrService) { }
    title: string|any;
    msg: string|any;
    showClose = true;
    theme = 'bootstrap';
    type = 'default';
    closeOther = false;
    toastOptions: any;

    addToast(options:any) {
      if (options.closeOther) {
        this.toastyService.clear();
      }

      this.toastOptions = {
        title: options.title,
        msg: options.msg,
        showClose: this.showClose,
        timeout: 6000,
        theme: this.theme,
      
        onAdd: (toast:any ) => {
          /* added */
          
        },
        onRemove: (toast: any) => {
          /* removed */
        },
      };
      
      switch (options.type) {
        case 'default': this.toastyService.success(this.toastOptions); break;
        case 'info': this.toastyService.info(this.toastOptions); break;
        case 'success': this.toastyService.success(this.toastOptions); break;
        case 'wait': this.toastyService.info(this.toastOptions); break;
        case 'error': this.toastyService.error(this.toastOptions); break;
        case 'warning': this.toastyService.warning(this.toastOptions); break;
      }
    }
}
