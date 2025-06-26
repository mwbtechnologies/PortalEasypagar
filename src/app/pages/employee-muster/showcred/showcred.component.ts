import { Dialog } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-showcred',
  templateUrl: './showcred.component.html',
  styleUrls: ['./showcred.component.css']
})
export class ShowcredComponent {
CredentailsArray:any[]=[]; index:any=0;
 number_of_messages_sent=0;
 response_list:any[]=[];
 
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private dialog: MatDialog,private _commonservice: HttpCommonService,private spinnerService: NgxSpinnerService,private toastr: ToastrService,public dialogRef: MatDialogRef<ShowcredComponent>)
  {
    this.CredentailsArray = this.data.Array;
    console.log("CredentailsArray");
    console.log(this.CredentailsArray);
  }

  CloseTab()
{
  this.dialogRef.close({})
}

Share(Type:any) {
  this.spinnerService.show();
  var tmp=[];
  debugger;
  for(this.index=0;this.index<this.CredentailsArray.length;this.index++)
  {
    tmp.push({id:this.CredentailsArray[this.index].EmployeeID})
  }
  const json = {Employees:tmp,Type:Type}
    this._commonservice.ApiUsingPost("Portal/ShareCredentials",json).subscribe(data => {
      if(data.status==true)
      {
       this.spinnerService.hide();
        this.dialogRef.close({alert:data.message,type:'success'})
      }
      else{
   
       this.spinnerService.hide();
       this.dialogRef.close({alert:data.message,type:'warning'})
      }
      console.log(data)
     }, (error: any) => {
       this.spinnerService.hide();
     }
     ); 
}

CheckStatus(){
 
  if(this.number_of_messages_sent==this.CredentailsArray.length){
     this.spinnerService.hide();
     let success_count=0;
     let error_count=0;
     for(let i=0;i<this.response_list.length;i++)
     {
        if(this.response_list[i].Status){
          success_count++;
        }else{
          error_count++;
        }
     }
     let alert_type='success';
     let message="Send Count : "+ success_count;
     if(error_count > 0){
      message+="Failed Count : "+ error_count;
      alert_type='warning';
   
     }

        this.dialogRef.close({alert:message,type:alert_type})
     

    

  }
}
SendWhatsAppCred(){

  if(this.CredentailsArray.length==0)return;
  this.spinnerService.show(); 
  this.number_of_messages_sent=0;
  console.log("cred arrary");
  console.log(this.CredentailsArray);

  for(this.index=0;this.index<this.CredentailsArray.length;this.index++)
  {
      var employeeid=this.CredentailsArray[this.index].EmployeeID;
      var fname=this.CredentailsArray[this.index].FirstName;
      var lname=this.CredentailsArray[this.index].LastName;
      var mobile=this.CredentailsArray[this.index].Mobile;
      var role=this.CredentailsArray[this.index].Role;
      var password=this.CredentailsArray[this.index].Password;
      this._commonservice.ApiUsingGetWithOneParam("Account/ShareEmpCred?EmpID="+employeeid)
      .subscribe({
          next:(result)=>{
            this.number_of_messages_sent++;
            this.response_list.push(result);
            this.CheckStatus();
        },
         error:(error)=>{
           this.number_of_messages_sent++;
            this.response_list.push(error);
            this.CheckStatus();
          }
      });
  }
}


SendWhatsapp() {
  this.spinnerService.show();
  for(this.index=0;this.index<this.CredentailsArray.length;this.index++)
    {
      var employeeid=this.CredentailsArray[this.index].EmployeeID;
      var fname=this.CredentailsArray[this.index].FirstName;
      var lname=this.CredentailsArray[this.index].LastName;
      var mobile=this.CredentailsArray[this.index].Mobile;
      var role=this.CredentailsArray[this.index].Role;
      var password=this.CredentailsArray[this.index].Password;

  const json={
    "receiver":[mobile],
    "type": "template",
    "tempName": "easystock_msg_temp",
    "msgType": "whatsapp",
    "receiverType": "individual",
    "SoftwareID": 11,
    "parameters": [
        {
            "type": "text",
            "text": fname + ""+ lname
        },
        {
            "type": "text",
            "text": "**1234"
        },
        {
            "type": "text",
            "text": role
        },
        {
            "type": "text",
            "text": mobile
        },
        {
            "type": "text",
            "text": password
        }
    ]
  }
  console.log(json);
  this._commonservice.MasterApiUsingPost("http://192.168.1.36/masterportalv2/promotions/whatsapp/sendText",json).subscribe(data => {
   console.log(data.status);    
   this.spinnerService.hide();
  }, (error: any) => {
    this.spinnerService.hide();
   
  }
  );

  this.toastr.success("Credentials shared successfully");
  this.CloseTab();
}
}
}
