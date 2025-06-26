import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-showdetail',
  templateUrl: './showdetail.component.html',
  styleUrls: ['./showdetail.component.css']
})
export class ShowdetailComponent {
  AttendanceData:any;
  ApiURL: any;
  SingleSelectionSettings:any;
  

constructor(@Inject(MAT_DIALOG_DATA) public data: any,private spinnerService: NgxSpinnerService,private toastr: ToastrService,public dialogRef: MatDialogRef<ShowdetailComponent>)
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
