import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ShowalertComponent } from '../../create-employee/showalert/showalert.component';

@Component({
  selector: 'app-mapbranches',
  templateUrl: './mapbranches.component.html',
  styleUrls: ['./mapbranches.component.css']
})
export class MapbranchesComponent {
  AdminID:any
  selectedBranches:any[]=[]
  BranchList:any[]=[]
  branchSettings:IDropdownSettings = {}
  OrgID:any
  ApiURL:any
constructor(@Inject(MAT_DIALOG_DATA) public data: any,
private _commonservice: HttpCommonService,private spinnerService: NgxSpinnerService,
private toastr: ToastrService,public dialogRef: MatDialogRef<MapbranchesComponent>,private dialog:MatDialog){
  this.branchSettings = {
    singleSelection: false,
    idField: 'Value',
    textField: 'Text',
    itemsShowLimit: 1,
    allowSearchFilter: true,
  };
}

ngOnInit(){
  this.AdminID = localStorage.getItem("AdminID");
  this.OrgID = localStorage.getItem("OrgID");
  this.getMappedList()
}

getMappedList() {
  let suborg = this.data.row.SubOrgID || 0
  this.ApiURL = "SuperAdmin/GetOrgBranchList?OrgID="+this.OrgID+"&SubOrgID="+suborg+"&AdminId="+this.AdminID
  this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => {
    this.BranchList=data.List;
    this.selectedBranches = data.List.filter((br:any) => br.Ismapped);
  }, (error) => {
    // this.ShowAlert(error,"error")
    console.log(error);
  });
}



onselectedBranch(item:any){

}
onDeselectedBranch(item:any){

}


mapBranches(){
  let json = {
    "LoggedInUserID":this.AdminID,
    "SubOrgID":this.data.row.SubOrgID, 
  "Branches":this.selectedBranches.map(res=>{
    return {
      "Value":res.Value
    }
  })
  }
  this._commonservice.ApiUsingPost("SuperAdmin/MapBranches",json).subscribe((data) => {
    this.ShowToast(data.Message,"success")
    this.dialogRef.close({data})
  }, (error) => {
    this.ShowToast("Something Went Wrong","error")
  });
}

  ShowToast(message: string, type: 'success' | 'warning' | 'error'): void {
    this.dialog.open(ShowalertComponent, {
      data: { message, type },
      panelClass: 'custom-dialog',
      disableClose: true  // Prevents closing on outside click
    }).afterClosed().subscribe((res) => {
      if (res) {
        console.log("Dialog closed");
      }
    });
  }

}
