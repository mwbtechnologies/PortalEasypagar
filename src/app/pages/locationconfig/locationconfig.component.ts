import { Component, ViewChild } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { CommonTableComponent } from '../common-table/common-table.component';
import { ShowalertComponent } from '../create-employee/showalert/showalert.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationpopupComponent } from 'src/app/layout/admin/confirmationpopup/confirmationpopup.component';

@Component({
  selector: 'app-locationconfig',
  templateUrl: './locationconfig.component.html',
  styleUrls: ['./locationconfig.component.css']
})
export class LocationconfigComponent {
  BranchList: any[] = []
  OrgID: any
  selectedBranch: any
  AdminID: any
  branchSettings: IDropdownSettings = {}
  LocationAddress: any
  Add: boolean = false
  Location: any[] = []
  //common table
  actionOptions: any
  displayColumns: any
  displayedColumns: any
  employeeLoading: any = undefined;
  editableColumns: any = []
  topHeaders: any = []
  headerColors: any = []
  smallHeaders: any = []
  ReportTitles: any = {}
  selectedRows: any = []
  commonTableOptions: any = {}
  @ViewChild(CommonTableComponent) commonTableChild: CommonTableComponent | any;
  //ends here
  selectedOrganization:any[]=[]
  OrgList:any[]=[]
  orgSettings:IDropdownSettings = {}
  constructor(private globalToastService: ToastrService, private _commonservice: HttpCommonService,private dialog:MatDialog) {
    this.branchSettings = {
      singleSelection: true,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.orgSettings = {
      singleSelection: true,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    //common table
    this.actionOptions = [
      {
        name: "Delete",
        icon: "fa fa-trash",
      }
    ];

    this.displayColumns = {
      "SLno": "SL No",
      "Address": "ADDRESS",
      "Actions": "ACTIONS"
    },


      this.displayedColumns = [
        "SLno",
        "Address",
        "Actions"
      ]

    this.editableColumns = {
    }

    this.headerColors = {
      // Deductions : {text:"#ff2d2d",bg:"#fff1f1"},
    }
    //ends here
  }
  ngOnInit() {
    this.AdminID = localStorage.getItem("AdminID");
    this.OrgID = localStorage.getItem("OrgID");
    console.log(this.AdminID, "adminid");
    this.GetOrganization();
    this.GetBranches()

  }
  onselectedOrg(item:any){
    this.selectedBranch = []
    this.GetBranches()
  }
  onDeselectedOrg(item:any){
    this.selectedBranch = []
    this.GetBranches()
  }

  GetOrganization() {
    this._commonservice.ApiUsingGetWithOneParam("Admin/GetSuborgList?OrgID="+this.OrgID+"&AdminId="+this.AdminID).subscribe((data) => {
      this.OrgList = data.List
      if(data.List.length == 1){
        this.selectedOrganization = [{Value:this.OrgList[0].Value,Text:this.OrgList[0].Text}]
        this.onselectedOrg({Value:this.OrgList[0].Value,Text:this.OrgList[0].Text})
      }
    }, (error) => {
       console.log(error);
    });
  }
  GetBranches() {
    let suborgid = this.selectedOrganization.map(res => res.Value)[0] || 0
    this._commonservice.ApiUsingGetWithOneParam("Admin/GetBranchListupdated?OrgID="+this.OrgID+"&SubOrgID="+suborgid+"&AdminId="+this.AdminID).subscribe((data) => {
      this.BranchList = data.List;
      console.log(this.BranchList, "branchlist");
    }, (error) => {
      // this.globalToastService.error(error);
      this.ShowAlert(error,"error")
       console.log(error);
    });

  }
  addLocation() {
    this.Add = true
  }

  onBranchSelect(item: any) {
    this.employeeLoading = true
    this._commonservice.ApiUsingGetWithOneParam("Settings/GetAddressList?BranchID=" + item.Value + "").subscribe((res: any) => {
      if (res.Status == true) {
        this.Location = res.List.map((l: any, i: any) => { return { SLno: i + 1, ...l } });
        this.employeeLoading = false
      } else if (res.Status == false) {
        // this.globalToastService.error(res.Message)
        this.ShowAlert(res.Message,"error")
        this.employeeLoading = false
      } else {
        // this.globalToastService.error("An error occurred. PLease try later")
        this.ShowAlert("An error occurred. PLease try later","error")
        this.employeeLoading = false
      }
    }, (error) => {
      // this.globalToastService.error(error.error.Message)
      this.ShowAlert(error.error.Message,"error")
      this.employeeLoading = false
    })
  }
  onBranchDeSelect(item: any) {

  }

  submitLocation() {
    if (this.LocationAddress == undefined || this.LocationAddress == null || this.LocationAddress == '') {
      // this.globalToastService.warning('Please Enter Location');
      this.ShowAlert('Please Enter Location',"warning")
    }
    else if (!this.selectedBranch) {
      // this.globalToastService.warning("Please Select Branch")
      this.ShowAlert('Please Select Branch',"warning")
    } else {
          const dialogRef = this.dialog.open(ConfirmationpopupComponent, {
            data: "Are You Sure You Want To Save This Address!",
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
    let branchid = this.selectedBranch.map((sb: any) => sb.Value)[0]
    this._commonservice.ApiUsingGetWithOneParam("Settings/SaveAddress?BranchID=" + branchid + "&Address=" + this.LocationAddress + "&UserID=" + this.AdminID + "").subscribe((res: any) => {
      if (res.Status == true) {
        // this.globalToastService.success(res.Message)
        this.ShowAlert(res.Message,"success")
        this.LocationAddress = ""
        this.onBranchSelect(this.selectedBranch[0])
      } else if (res.Status == false) {
        // this.globalToastService.error(res.Message)
        this.ShowAlert(res.Message,"error")
      } else {
        // this.globalToastService.error("An error occurred. PLease try later")
        this.ShowAlert("An error occurred. PLease try later","error")
      }
    }, (error) => {
      // this.globalToastService.error(error.error.Message)
      this.ShowAlert(error.error.Message,"error")
    })
  }

  deleteAddress(addressid: any) {
    this._commonservice.ApiUsingGetWithOneParam("Settings/DeleteAddress?AddressID="+addressid+"&UserID="+this.AdminID+"").subscribe((res:any)=>{
      if (res.Status == true) {
        // this.globalToastService.success(res.Message)
        this.ShowAlert(res.Message,"success")
        this.onBranchSelect(this.selectedBranch[0])
      } else if (res.Status == false) {
        // this.globalToastService.error(res.Message)
        this.ShowAlert(res.Message,"error")
      } else {
        // this.globalToastService.error("An error occurred. PLease try later")
        this.ShowAlert("An error occurred. PLease try later","error")
      }
    }, (error) => {
      // this.globalToastService.error(error.error.Message)
      this.ShowAlert(error.error.Message,"error")
    })
  }

  //common table
  actionEmitter(data: any) {
    if (data.action.name == "Delete") {
      this.deleteAddress(data.row.ID);
    }

  }
  //ends here

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
