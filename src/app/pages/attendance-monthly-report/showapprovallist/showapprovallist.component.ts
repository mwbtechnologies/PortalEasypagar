import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ShowalertComponent } from '../../create-employee/showalert/showalert.component';

@Component({
  selector: 'app-showapprovallist',
  templateUrl: './showapprovallist.component.html',
  styleUrls: ['./showapprovallist.component.css']
})
export class ShowapprovallistComponent {
  Message:any;
  AttendanceList: any;
  Employees: any;Date:any;
  Timings: any[]=[];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private _commonservice: HttpCommonService,private dialog:MatDialog,
  private spinnerService: NgxSpinnerService,private toastr: ToastrService,
  public dialogRef: MatDialogRef<ShowapprovallistComponent>)
  {
    this.AttendanceList = this.data.IL;
    this.Employees=this.AttendanceList.Employees;
    this.Date=this.AttendanceList.Date;
  }
  ngOnInit()
  {
    this.GetList();
  }

  GetList() {
    var tmp=[];
    for( let index=0;index<this.Employees.length;index++)
    {
    
        tmp.push({"Empid":this.Employees[index].EmployeeID,"Time":this.Employees[index].Date })
    }
      this._commonservice.ApiUsingPost("Attendance/getdefaultcheckoutdatesforapproval",tmp).subscribe(data => {
       this.Timings=data.list;
          this.spinnerService.hide();      

      }, (error: any) => {
        //  this.toastr.error(error.message);
        this.spinnerService.hide();

      }

      );
      this.spinnerService.hide();



  }

  close(){
    this.dialogRef.close();
  }
  
  ApproveAll() {
      this._commonservice.ApiUsingPost("Admin/ApproveAllAttendanceMonthly",this.AttendanceList).subscribe(data => {
        if (data.Status == true) {
          // this.toastr.success(data.Message);
          this.ShowToast(data.Message,"success") 
          this.spinnerService.hide();
          this.CloseTab();
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
  CloseTab()
{
  this.dialogRef.close({})
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

