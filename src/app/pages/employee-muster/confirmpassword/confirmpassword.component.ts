import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { DeleteconfirmationComponent } from '../deleteconfirmation/deleteconfirmation.component';

@Component({
  selector: 'app-confirmpassword',
  templateUrl: './confirmpassword.component.html',
  styleUrls: ['./confirmpassword.component.css']
})
export class ConfirmpasswordComponent {
  userid:any
  confirm:boolean=false
  password:any
  originalpassword:any
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private dialog: MatDialog,private _commonservice: HttpCommonService,private spinnerService: NgxSpinnerService,private toastr: ToastrService,public dialogRef: MatDialogRef<DeleteconfirmationComponent>)
  {
  }
  ngOnInit(): void{
    console.log(this.data,"sdsdsdss");
    this.originalpassword = localStorage.getItem("Password")
  }
  
  Confirm(){
    if(this.originalpassword != this.password){
      this.toastr.error("Please Enter Correct Password")
    }
    else{
       this.dialog.open(DeleteconfirmationComponent,{
      data:{row:this.data.row}
    }).afterClosed().subscribe(res=>{
      this.dialogRef.close()
    })
    }
   
  }
}
