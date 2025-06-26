import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-showalert',
  templateUrl: './showalert.component.html',
  styleUrls: ['./showalert.component.css']
})
export class ShowalertComponent {
  Message: string;
  alertType: any;
  alertHeading: any;
  iconClass: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ShowalertComponent>) {
    this.Message = this.data.message;
    this.setAlertType(this.data.type);
  }

  setAlertType(type: string) {
    switch (type) {
      case 'success':
        this.alertType = 'success';
        this.alertHeading = 'Success!';
        this.iconClass = 'fa fa-check-circle text-success';
        break;
      case 'warning':
        this.alertType = 'warning';
        this.alertHeading = 'Warning!';
        this.iconClass = 'fa fa-exclamation-triangle text-warning';
        break;
      case 'error':
        this.alertType = 'error';
        this.alertHeading = 'Error!';
        this.iconClass = 'fa fa-times-circle text-danger';
        break;
      default:
        this.alertType = 'warning';
        this.alertHeading = 'Notice!';
        this.iconClass = 'fa fa-info-circle text-primary';
    }
  }

  CloseTab() {
    this.dialogRef.close();
  }
}
