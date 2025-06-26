import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ShowalertComponent } from '../create-employee/showalert/showalert.component';
import { ConfirmationpopupComponent } from 'src/app/layout/admin/confirmationpopup/confirmationpopup.component';

@Component({
  selector: 'app-defaultbranch',
  templateUrl: './defaultbranch.component.html',
  styleUrls: ['./defaultbranch.component.css']
})
export class DefaultbranchComponent {
  BranchList:any[]=[]
  selectedBranch:any
  AdminID:any  
  branchSettings :IDropdownSettings = {}
  constructor(private globalToastService: ToastrService, private _commonservice: HttpCommonService,private dialog:MatDialog){
      this.branchSettings = {
        singleSelection: true,
        idField: 'ID',
        textField: 'Name',
        itemsShowLimit: 1,
        allowSearchFilter: true,
      };
}
ngOnInit(){
  this.AdminID = localStorage.getItem("AdminID");
  console.log(this.AdminID,"adminid");
  this.getBranchList()
    
  }

  getBranchList(){
    let json = {
      "defaultbranchdatas":[],
      "UserID":this.AdminID
    }
    console.log(json,"sjdsd");
    
    this._commonservice.ApiUsingPost("Settings/SetDefaultBranch",json).subscribe((res:any)=>{
      if(res.Status==true){
        this.BranchList = res.List.defaultbranchdatas
        this.selectedBranch = this.BranchList.filter((br:any) => br.Isdefault === true);
      }else if(res.Status==false){
      // this.globalToastService.error(res.Message)
      this.ShowAlert(res.Message,"error")
      }else{
      // this.globalToastService.error("An Error Occured")
      this.ShowAlert("An Error Occured","error")
      }
    },(error):any=>{
      // this.globalToastService.error(error.message)
      this.ShowAlert(error.message,"error")
    })
  }

  SaveDefaultBranch(){
    if(this.selectedBranch.length == 0){
      // this.globalToastService.warning("Please select a branch to set as default.")
      this.ShowAlert("Please select a branch to set as default.","warning")
    }else{
         const dialogRef = this.dialog.open(ConfirmationpopupComponent, {
                data: "Are You Sure Want To Set This Branch As Default!",
              });
              dialogRef.componentInstance.confirmClick.subscribe(() => {
                this.submit();
                dialogRef.close();
            
              },(error):any=>{
                // this.globalToastService.error(error.error.message)
                this.ShowAlert(error.error.message,"error")
              });
    }
  }

  submit(){
    let data = this.selectedBranch.map((br:any)=>br)[0]
    let json = {
      "defaultbranchdatas":
      [{"ID":data.ID,"Isdefault":true,"Name":data.Name}],
      "UserID":this.AdminID
    }
    console.log(json,"save");
    this._commonservice.ApiUsingPost("Settings/SetDefaultBranch",json).subscribe((res:any)=>{
      if(res.Status==true){
        // this.getBranchList()
        // this.globalToastService.success("Default branch set successfully.")
        this.ShowAlert("Default branch set successfully.","success")
      }else if(res.Status==false){
      // this.globalToastService.error(res.Message)
      this.ShowAlert(res.Message,"error")
      }else{
      // this.globalToastService.error("An Error Occured")
      this.ShowAlert("An Error Occured","error")
      }
    },(error):any=>{
      // this.globalToastService.error(error.message)
      this.ShowAlert(error.message,"error")
    })
  }
        ShowAlert(message: string, type: 'success' | 'warning' | 'error'): void {
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
