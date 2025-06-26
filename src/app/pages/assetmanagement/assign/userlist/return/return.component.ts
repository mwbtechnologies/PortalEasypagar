import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AssetService } from 'src/app/services/assets.service';
import { ReduxService } from 'src/app/services/redux.service';

@Component({
  selector: 'app-return',
  templateUrl: './return.component.html',
  styleUrls: ['./return.component.css']
})
export class ReturnComponent {
  ReturnTypeSettings:IDropdownSettings = {}
ReturnTypeList:any[]=['Damaged',"Not Damaged"]
SelectedReturnType:any[]=[]
selectedValue: string | null = null;
quantity:number = 1
remarks:string = ""
AssetId:any
ItemName:any
ORGId:any
AdminID:any
receivedBy:string = ""
constructor(@Inject(MAT_DIALOG_DATA) public data: any, private assetService: AssetService, private spinnerService: NgxSpinnerService, private toastr: ToastrService, public dialogRef: MatDialogRef<ReturnComponent>,private reduxService : ReduxService) {
  this.ReturnTypeSettings = {
    singleSelection: true,
    idField: 'id',
    textField: 'text',
    itemsShowLimit: 1,
    allowSearchFilter: true,
  };
  // this.AssetId = this.data.assignmentId
  this.ItemName = this.data.data.name
  
}
ngOnInit(){
  this.ORGId = localStorage.getItem('OrgID')
  this.AdminID = localStorage.getItem("AdminID");
}

selectValue(value: string) {
  this.selectedValue = value;
}

returnItems(){
  if(this.selectedValue == null){
    this.toastr.error("Please select Status of item")
  }
  else{
    let json = {
      SoftwareId: 8,
      createdBy: parseInt(this.reduxService.UserID),
      "mapping":{
        "orgId": parseInt(this.ORGId),
        "userId": this.data.userid,
        // "branchId": this.data.branchid,
        // "departmentId": this.data.department,
      },
      _id: this.data.data.assignmentId,
      assignedItems: [
      {
          "key": this.data.data.key,
          "itemId": this.data.data.itemId,
          "return":{
            status:true,
            receivedBy:this.reduxService.UserID,
            createdAt:new Date(),
            remarks:this.remarks,
            // quantity:this.quantity,
          },
          "damage":{status:this.selectedValue == "Damaged" ? true : false}
      },
    ], 
    };
    this.assetService.PostMethod('assetMgnt/assign/asset/item/edit', json).subscribe((res: any) => {
      this.toastr.success(res.message)
      this.dialogRef.close(res)
    }, (error) => {
      this.toastr.error(error.error.message)
    })
    
  }
}

}
