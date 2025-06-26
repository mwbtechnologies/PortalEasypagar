import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ApproveattendanceComponent } from '../approveattendance/approveattendance.component';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ShowalertComponent } from '../../create-employee/showalert/showalert.component';

@Component({
  selector: 'app-shiftwisedata',
  templateUrl: './shiftwisedata.component.html',
  styleUrls: ['./shiftwisedata.component.css']
})
export class ShiftwisedataComponent {
  @Input()
  shiftdata: any
  AdminID: any
  ApiURL: any
  dtExportButtonOptions: any = {};
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  AttendanceList: any
  RecordDate: any;
  RecordID: any
  EnableApprove: any = false;
  index = 0;
  ShowAbsent: any = false;
  ShiftList: any[] = []
  selectedShift: any[] = []
  ShiftSettings: IDropdownSettings = {}

  constructor(private _router: Router, private globalToastService: ToastrService, private spinnerService: NgxSpinnerService, private _commonservice: HttpCommonService, private toastr: ToastrService, private dialog: MatDialog) {
    this.dtExportButtonOptions = {
      dom: 'Bfrtip',
      buttons: [
        'copy',
        'print',
        'excel',
        'csv'
      ]
    };
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
    this.ShiftSettings = {
      singleSelection: true,
      idField: 'Text',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
  }
  ngOnInit() {
    this.AdminID = localStorage.getItem("AdminID");
    this.RecordID = localStorage.getItem("RecordID");
    this.getShiftTypes()


  }
  getShiftTypes() {
    this._commonservice.ApiUsingGetWithOneParam("ShiftMaster/GetPortalShiftFilters?AdminID="+this.AdminID+"&BranchID="+this.shiftdata.branch+"&Date="+this.shiftdata.date).subscribe(data => {
      this.ShiftList = data.List
    })
  }
  onShiftChange(event: any) {
    console.log(this.selectedShift, "sdsds");
  }
  onDeselectedShiftChange(event: any) {

  }
  GetAttendanceList() {
    let shiftname = this.selectedShift.map(res => res.Text)[0]
    this.ApiURL = "Performance/GetAttendance?AdminID=" + this.AdminID + "&BranchID=" + this.shiftdata.branch + "&Date=" + this.shiftdata.date + "&ListType=" + shiftname + "&DeptID=" + this.shiftdata.department;
    this.spinnerService.show();
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((res: any) => {
      var table = $('#DataTables_Table_0').DataTable();
      table.destroy();
      this.AttendanceList = res.List;
      this.dtTrigger.next(null);
      this.spinnerService.hide();
      if (this.RecordDate != null && this.RecordDate != 0 && this.RecordDate != undefined && this.RecordDate != '' && this.RecordID != null && this.RecordID != 0 && this.RecordID != undefined && this.RecordID != '') {
        this.AttendanceList = res.List.filter((item: any) => item.EmployeeID === parseInt(this.RecordID));
        if (this.AttendanceList.length == 1) {
          localStorage.removeItem("RecordID"); this.RecordID = 0;
          localStorage.removeItem("RecordDate"); this.RecordDate = null;
          this.openDialog(this.AttendanceList[0]);
        }
      }

    }, (error) => {
      this.spinnerService.hide();
    });
  }
  openDialog(IL: any): void {
    this.dialog.open(ApproveattendanceComponent, {
      data: { IL, fulldata: this.AttendanceList }
       ,panelClass: 'custom-dialog',
        disableClose: true }).afterClosed().subscribe((res: any) => {
      // if(res){
      localStorage.removeItem("RecordID"); this.RecordID = 0;
      localStorage.removeItem("RecordDate"); this.RecordDate = null;
      this.GetAttendanceList()
      // }
    })
  }
  allCheck(event: any) {
    this.EnableApprove = false;
    const isChecked = event.target.checked;

    for (let i = 0; i < this.AttendanceList.length; i++) {
      // if (this.AttendanceList[i].VerificationStatus === "UnVerified" || this.AttendanceList[i].VerificationStatus === "Pending") {
      //     this.AttendanceList[i].IsChecked = isChecked;
      // }
      if (this.AttendanceList[i].VerificationStatus != "Absent") {
        this.AttendanceList[i].IsChecked = isChecked;
      }
    }

    if (isChecked) {
      this.EnableApprove = true;
    }
  }
  ApproveAll(Type: any) {
    var tmp = [];
    for (this.index = 0; this.index < this.AttendanceList.length; this.index++) {
      if (this.AttendanceList[this.index].IsChecked == true) {
        tmp.push({ "EmployeeID": this.AttendanceList[this.index].EmployeeID })
      }

    }
    const json = {
      Date: this.shiftdata.date,
      Status: Type,
      AdminID: this.AdminID,
      Key: 'en',
      Employees: tmp
    }
    console.log(json);
    this._commonservice.ApiUsingPost("Admin/ApproveAllAttendance", json).subscribe(data => {
      if (data.Status == true) {
        // this.toastr.success(data.Message);
        this.ShowToast(data.Message,"success") 
        this.spinnerService.hide();
        this.GetAttendanceList();
      }
      else {
        // this.toastr.warning(data.Message);
        this.ShowToast(data.Message,"warning") 
        this.spinnerService.hide();
      }

    }, (error: any) => {
      //  this.toastr.error(error.message);
      this.spinnerService.hide();

    }

    );
    this.spinnerService.hide();



  }

  OnChange(event: any) {
    this.EnableApprove = this.AttendanceList.some((employee: any) => employee.IsChecked);
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
