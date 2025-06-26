import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
export class FormInput {
  textField: any;
  IsChecked:boolean=false;
}
@Component({
  selector: 'app-add-update-field',
  templateUrl: './add-update-field.component.html',
  styleUrls: ['./add-update-field.component.css']
})
export class AddUpdateFieldComponent implements OnInit {
  Message:any;  public isSubmit: boolean;
   formInput: FormInput | any;edit:any;Receivedtext:any;
  FieldID: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private _commonservice: HttpCommonService,private toastr: ToastrService,public dialogRef: MatDialogRef<AddUpdateFieldComponent>)
  {
    this.isSubmit = false;
    this.edit = data.edit || false;
    this.Receivedtext=data.Field;
    this.FieldID=data.FieldID;
  }
  ngOnInit(): void {
    this.formInput = {
      textField: '',
      IsChecked:true
    }
    if(this.edit==true)
    {
      this.formInput.textField=this.Receivedtext;
      
    }
  }
  CloseTab()
{
  this.dialogRef.close({})
}
SaveData() {
  var orgid=localStorage.getItem("OrgID");
  var UserId=localStorage.getItem("UserID");
if(this.edit==false){this.FieldID=0;}
var fieldtype = this.formInput.IsChecked === '1' ? 'Credit' : 'Debit';
  if (this.formInput.textField) {
  var json={
    Name:this.formInput.textField,
    OrgID:orgid,
    UserId:UserId,
    FieldID:this.FieldID,
    Type:fieldtype
  }
  console.log("what is adding",json);
  this._commonservice.ApiUsingPost("SalaryMaster/AddField",json).subscribe((data) => {
  if(data.status==201){
    this.toastr.success(data.message);
    this.dialogRef.close({data})
  }
  else{
    this.toastr.warning(data.message);
  }
  }, (error) => {
    console.log(error);
  });
}
else{
  this.toastr.warning("Please Enter Field");
}
}
}


