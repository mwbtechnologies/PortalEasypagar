import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';

@Component({
  selector: 'app-savedailog',
  templateUrl: './savedailog.component.html',
  styleUrls: ['./savedailog.component.css']
})
export class SavedailogComponent {
  constructor( private globalToastService:ToastrService,@Inject(MAT_DIALOG_DATA) public data: any,
  private dialog: MatDialog,private _commonservice: HttpCommonService,
  private spinnerService: NgxSpinnerService,private toastr: ToastrService,
  public dialogRef: MatDialogRef<SavedailogComponent>){
    }

    ok(){
      this.dialogRef.close()
    }
}
