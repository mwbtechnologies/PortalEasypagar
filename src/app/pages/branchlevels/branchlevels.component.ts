import { Component } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ShowalertComponent } from '../create-employee/showalert/showalert.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationpopupComponent } from 'src/app/layout/admin/confirmationpopup/confirmationpopup.component';

@Component({
  selector: 'app-branchlevels',
  templateUrl: './branchlevels.component.html',
  styleUrls: ['./branchlevels.component.css']
})
export class BranchlevelsComponent {
  BranchList:any[]=[]
  AdminID:any 
  constructor(private globalToastService: ToastrService, private _commonservice: HttpCommonService,private dialog:MatDialog){
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
    
    this._commonservice.ApiUsingPost("Settings/SetWorkingDays",json).subscribe((res:any)=>{
      if(res.Status==true){
        this.BranchList = res.List.defaultbranchdatas
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

  SaveWeekoffs(){
    if (this.BranchList.some((res: any) => res.Days === null || res.Days === '')) {
      // this.globalToastService.warning("Please Enter valid values for atleast one branch");
      this.ShowAlert("Please Enter valid values for atleast one branch","warning")
      return;
  }else{
       const dialogRef = this.dialog.open(ConfirmationpopupComponent, {
          data: "Are You Sure Want To Set These WeekOffs!",
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
    let json:any = {
      "UserID":parseInt(this.AdminID)
    }   
      json["defaultbranchdatas"] = this.BranchList.filter((res: any) => res.Days > 0).map((res: any) => {
          return {
            "Days":res.Days,
            "ID":res.ID,
            "Name":res.Name,
            "IsSandwichHolidayenabled":res.IsSandwichHolidayenabled,
            "IsSandwichWeekoffenabled":res.IsSandwichWeekoffenabled
          }
        })
      console.log(json,"save");
      this._commonservice.ApiUsingPost("Settings/SetWorkingDays",json).subscribe((res:any)=>{
        if(res.Status==true){
          // this.globalToastService.success("Weekoff Days Have Been Set Succesfully")
          this.ShowAlert("Weekoff Days Have Been Set Succesfully","success")
        }else if(res.Status==false){
        // this.globalToastService.error(res.Message)
        this.ShowAlert(res.Message,"error")
        }else{
        // this.globalToastService.error("An Error Occured")
        this.ShowAlert("An Error Occured","error")
        }
      },(error):any=>{
        // this.globalToastService.error(error.error.message)
        this.ShowAlert(error.error.message,"error")
      })
  }
  InputValidation(bl:any){
    if (bl.Days > 5) {
      // this.globalToastService.warning("Days Cannot Be Grater Than 5")
      this.ShowAlert("Days Cannot Be Grater Than 5","warning")
      bl.Days = 5;
    }
    if (bl.Days < 0) {
      bl.Days = 0;
    }
  }
  preventPlusMinus(event: KeyboardEvent): void {
    if (event.key === '+' || event.key === '.' ||event.key === '0' || event.key === '-'|| event.key === 'e' || event.key === 'ArrowUp'|| event.key === 'ArrowDown') {
      event.preventDefault();
    }
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
