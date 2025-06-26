import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-rejectremarks',
  templateUrl: './rejectremarks.component.html',
  styleUrls: ['./rejectremarks.component.css']
})
export class RejectremarksComponent {
  remarks:any
  constructor(private globalToastService: ToastrService,public dialogRef: MatDialogRef<RejectremarksComponent>) {

    }
    Submit(){
      if(this.remarks == '' || this.remarks == undefined){
        this.globalToastService.warning("Please Add Remarks")
      }
      else{
        this.dialogRef.close({remarks:this.remarks})
      }
    }
}
