import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';

@Component({
  selector: 'app-approveattendance',
  templateUrl: './approveattendance.component.html',
  styleUrls: ['./approveattendance.component.css']
})
export class ApproveattendanceComponent {
AttendanceData:any;
  ApiURL: any;LoginTypes:any;SingleSelectionSettings:any;emparray:any;
  

constructor(@Inject(MAT_DIALOG_DATA) public data: any,private spinnerService: NgxSpinnerService,private toastr: ToastrService,public dialogRef: MatDialogRef<ApproveattendanceComponent>)
{
  this.AttendanceData = this.data.IL;

  this.SingleSelectionSettings = {
    singleSelection: true,
    idField: 'Value',
      textField: 'Text',
    itemsShowLimit: 1,
    allowSearchFilter: true,
  };
}
ngOnInit(){
  console.log(this.AttendanceData);
}
CloseTab()
{
  this.dialogRef.close({})
}
}
