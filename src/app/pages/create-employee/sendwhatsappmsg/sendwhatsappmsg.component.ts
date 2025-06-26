import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpCommonService } from 'src/app/services/httpcommon.service';

@Component({
  selector: 'app-sendwhatsappmsg',
  templateUrl: './sendwhatsappmsg.component.html',
  styleUrls: ['./sendwhatsappmsg.component.css']
})
export class SendwhatsappmsgComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<SendwhatsappmsgComponent>,    private _commonservice: HttpCommonService) {

  }
  cancel(){
    this.dialogRef.close()
  }

  sendwhatsapp(){
  this._commonservice.ApiUsingGetWithOneParam("Account/ShareEmpCred?EmpID="+this.data.empid).subscribe(res=>{
    this.dialogRef.close()
  })
  }

}
