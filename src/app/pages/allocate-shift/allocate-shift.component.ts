import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AddeditComponent } from './addedit/addedit.component';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { EditallocateComponent } from './editallocate/editallocate.component';
import * as moment from 'moment';
import { PdfExportService } from 'src/app/services/pdf-export.service';
import * as XLSX from 'xlsx';
import { ShowalertComponent } from '../create-employee/showalert/showalert.component';
export class Emp{
  EmployeeID:any;
}

@Component({
  selector: 'app-allocate-shift',
  templateUrl: './allocate-shift.component.html',
  styleUrls: ['./allocate-shift.component.css']
})
export class AllocateShiftComponent implements OnInit{
   public isSubmit: boolean;
   EmpClass:Array<Emp> = [];
   Editdetails: any;
   editid: any;AdminID:any;OrgID:any;
   BranchList:any; DepartmentList:any;ApiURL:any;NewApiURL:any;
   selectedBranchId:string[]|any; selectedDepartmentId:string[]|any;
   selectedEmployeeId:string[]|any;
   selectedShiftId:string[]|any;
   institutionsList:any[]=[];ShiftList:any;EmployeeList:any;
   dtExportButtonOptions: any = {};
   dtOptions: DataTables.Settings = {};selectedListType:any;
   dtTrigger: Subject<any> = new Subject();
   DeleteShiftUrl:any; ListType:any=['Yet to Start', 'Ongoing','Ended']
   EmployeesArray=[];AddPermission:any;EditPermission:any;ViewPermission:any;DeletePermission:any;   
   index:any;UserListType:any;
   ArrayLength=0;UserID:any;
   branchSettings:IDropdownSettings = {}
   BranchApiUrl:any
   selectedBranch:any[]=[]
   selectedOrganization:any[]=[]
   OrgList:any[]=[]
   orgSettings:IDropdownSettings = {}
  constructor(private _router: Router, private globalToastService: ToastrService,
     private spinnerService: NgxSpinnerService,private _commonservice: HttpCommonService,
     public dialog: MatDialog,private toastr: ToastrService,private pdfExportService : PdfExportService) {
    this.isSubmit = false;
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
  }
  ngOnInit(): void {
    this.UserListType="All";
    // this.selectedListType=['All']
    this.AdminID = localStorage.getItem("AdminID");
    this.OrgID = localStorage.getItem("OrgID");
    this.UserID=localStorage.getItem("UserID");
    if (this.AdminID==null||this.AdminID==""||this.OrgID==undefined||this.OrgID==null||this.OrgID==""||this.AdminID==undefined) {
      this._router.navigate(["auth/signin-v2"]);
    }
    this.GetOrganization()
    this._commonservice.ApiUsingGetWithOneParam("Admin/GetDepartmentList").subscribe((data) => this.DepartmentList = data.List, (error) => {
      // this.globalToastService.error(error); 
      this.ShowAlert(error,"error",)
      console.log(error);
    });
    let suborgid = this.selectedOrganization.map(res => res.Value)[0] || 0
    this.BranchApiUrl = "Admin/GetBranchListupdated?OrgID="+this.OrgID+"&SubOrgID="+suborgid+"&AdminId="+this.AdminID
    this._commonservice.ApiUsingGetWithOneParam(this.BranchApiUrl).subscribe((data) => {
      this.BranchList = data.List
      console.log(this.BranchList,"branchList");
    },
     (error) => {
      // this.globalToastService.error(error); 
      this.ShowAlert(error,"error",)
      console.log(error);
    });

    this.AddPermission=localStorage.getItem("AddPermission"); if(this.AddPermission=="true"){this.AddPermission=true;} else{this.AddPermission=false;}
    this.EditPermission=localStorage.getItem("EditPermission");  if(this.EditPermission=="true"){this.EditPermission=true;}else{this.EditPermission=false;}
    this.ViewPermission=localStorage.getItem("ViewPermission");  if(this.ViewPermission=="true"){this.ViewPermission=true;}else{this.ViewPermission=false;}
    this.DeletePermission=localStorage.getItem("DeletePermission");  if(this.DeletePermission=="true"){this.DeletePermission=true;}else{this.DeletePermission=false;}
   
    // this.GetAllotedShifts()
  }
  onselectedOrg(item:any){
  }
  onDeselectedOrg(item:any){
  }
  GetOrganization() {
    this.ApiURL = "Admin/GetSuborgList?OrgID="+this.OrgID+"&AdminId="+this.UserID
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => {
      this.OrgList = data.List
      if(data.List.length == 1){
        this.selectedOrganization = [{Value:this.OrgList[0].Value,Text:this.OrgList[0].Text}]
        this.onselectedOrg({Value:this.OrgList[0].Value,Text:this.OrgList[0].Text})
      }
    }, (error) => {
      // this.ShowToast(error,"error")
       console.log(error);
    });
  }

  GetEmpOnBranchChange(event:any)
  {
      this.spinnerService.show();
      if(this.selectedBranchId==""||event==undefined|| this.selectedBranchId==null && this.selectedBranchId==undefined){this.selectedBranchId=0;}
      else{
        this.selectedBranchId=event.Value;
      }
       if(this.selectedDepartmentId==""||this.selectedDepartmentId==null && this.selectedDepartmentId==undefined){this.selectedDepartmentId=0;}
      this.ApiURL="Admin/GetEmployees?AdminID="+this.AdminID+"&BranchID="+event.Value+"&DeptId="+this.selectedDepartmentId+"&Year=0&Month=0";
      this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => this.EmployeeList = data.data, (error) => {
         console.log(error);this.spinnerService.hide();
      });
      this.spinnerService.hide();
  }
  GetEmpOnDeptChange(event:any)
  {
      this.spinnerService.show();
      if(this.selectedBranchId==""||this.selectedBranchId==null && this.selectedBranchId==undefined){this.selectedBranchId=0;} 
      if(this.selectedDepartmentId==""||this.selectedDepartmentId==null && this.selectedDepartmentId==undefined || event==undefined){this.selectedDepartmentId=0;}
else{
  this.selectedDepartmentId=event.Value;
}
      this.ApiURL="Portal/GetEmployees?AdminID="+this.AdminID+"&BranchID="+this.selectedBranchId+"&DeptId="+this.selectedDepartmentId+"&Year=0&Month=0";
      this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => this.EmployeeList = data.data, (error) => {
         console.log(error);this.spinnerService.hide();
      });

      this.spinnerService.hide();
  }
  OnBranchSelect(event:any){
    console.log(event);
    this.selectedBranch = [event];
    // this.GetAllotedShifts();
  }
  onBranchDeSelect(event:any){
    console.log(event);
    this.selectedBranch = [];
    // this.GetAllotedShifts();
  }

  GetAllotedShifts() {
    if(this.selectedOrganization.length==0)
    {
      this.ShowAlert("Please Select Organization","warning")
    }
   else if(this.selectedBranch.length==0)
      {
        this.ShowAlert("Please Select Branch","warning")
      }
      else{
        const selectedBranchIDs = this.selectedBranch.map(branch => branch.Value);
        this.spinnerService.show();
         if(this.UserListType=='Yet to Start')
          {this.UserListType="Pending"}
        const json = {
            "BranchID": selectedBranchIDs,
            "DepartmentID": [],
            "AdminID":this.AdminID,
            "Type":this.UserListType
        }
        this._commonservice.ApiUsingPost("ShiftMaster/GetShiftAllocationList",json).subscribe((data:any) => {
          var table = $('#DataTables_Table_0').DataTable();
          table.destroy();  
          this.institutionsList = data.List
          this.dtTrigger.next(null);
          this.spinnerService.hide();
        }, (error: any) => {
          // this.toastr.error(error.message);
          this.spinnerService.hide();
         
        })
      }

  }

  AllocateShift(isEdit:boolean,row?:any){
    this.dialog.open(AddeditComponent,{
      data: { isEdit, row, fulldata: this.institutionsList }
       ,panelClass: 'custom-dialog',
        disableClose: true }).afterClosed().subscribe((res:any)=>{
        // this.GetAllotedShifts()
    }, (error: any) => {
      // this.toastr.error(error.message);
      this.spinnerService.hide();
     
    })
  }
  EditShift(isEdit:boolean,row?:any){
    this.dialog.open(EditallocateComponent,{
      data: { isEdit, row, fulldata: this.institutionsList }
       ,panelClass: 'custom-dialog',
        disableClose: true }).afterClosed().subscribe((res:any)=>{
        // this.GetAllotedShifts()
    })
  }
  DeleteShift(row:any){
    this.DeleteShiftUrl = "ShiftMaster/UpdateShiftAllocationStatus?Id="+ row.AllotID+"&LoginUserID="+this.AdminID
    this._commonservice.ApiUsingGetWithOneParam(this.DeleteShiftUrl).subscribe((res:any)=>{
      // this.toastr.success(res.Message);
      this.ShowAlert(res.Message,"success",)
      this.GetAllotedShifts()
    }, (error: any) => {
      // this.toastr.error(error.message);
      this.spinnerService.hide();
     
    })
  }
    
    selectAll() {
    }
  
    unselectAll() {
      this.selectedEmployeeId=[];
    }
    exportexcel(){
      let columns = ['EmpID','Name','Branch','Department','StartDate','EndDate','Months'];
      let weekColumns = ['Week-I', 'Week-II', 'Week-III', 'Week-IV', 'Week-V'];
      columns = columns.concat(weekColumns);
      let fileName = 'AllocatedShiftList.xlsx'
      let data = this.institutionsList.map((item:any) => {
        const rowData: any[] = [];
        rowData.push(item['MappedEmpId']);
        rowData.push(item['EmployeeName']);
        rowData.push(item['Branch']);
        rowData.push(item['Department']);
        rowData.push(moment(item['StartDate']).format('MMM Do YYYY'));
        if(item['EndDate']!=null && item['EndDate']!="")
        {
          rowData.push(moment(item['EndDate'])?.format('MMM Do YYYY'));
        }
        else{
          rowData.push(" ");
        }
        
        rowData.push(item['Months']);
       
    
        // Populate week-specific columns
        for (let week of weekColumns) {
          let weekData = item['WeekConfig'].find((w: any) => w.WeekName === week);
          if (weekData) {
            let weekInfo = `Shift: ${weekData.ShiftID[0]?.Name}\n`;
            weekInfo += 'Working Days: ';
            weekInfo += weekData.WorkingDays.filter((d: any) => d.Value).map((d: any) => d.Display).join(', ');
            weekInfo += '\nWeek Off Days: ';
            weekInfo += weekData.WeekOffDays.filter((d: any) => d.Value).map((d: any) => d.Display).join(', ');
            rowData.push(weekInfo);
          } else {
            rowData.push('');
          }
        }
        return rowData;
      });
        data.unshift(columns);
      const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'OT List');
      XLSX.writeFile(wb, fileName);
    }

    exportPDF() {
      let columns = ['EmpId','Name','Branch','Department','StartDate','EndDate','Months'];
      let weekColumns = ['Week-I', 'Week-II', 'Week-III', 'Week-IV', 'Week-V'];
      columns = columns.concat(weekColumns);
      const header = ''
      const title = 'Allocate Shift'
      let data = this.institutionsList.map((item?:any) => {
        const rowData: any[] = [];
        rowData.push(item['MappedEmpId']);
        rowData.push(item['EmployeeName']);
        rowData.push(item['Branch']);
        rowData.push(item['Department']);
        rowData.push(moment(item['StartDate']).format('MMM Do YYYY'));
        if(item['EndDate']!=null && item['EndDate']!="")
        {
          rowData.push(moment(item['EndDate'])?.format('MMM Do YYYY'));
        }
        else{
          rowData.push(" ");
        }
        
        rowData.push(item['Months']);
       
        // Populate week-specific columns
        for (let week of weekColumns) {
          let weekData = item['WeekConfig'].find((w: any) => w.WeekName === week);
          if (weekData) {
            let weekInfo = `Shift: ${weekData.ShiftID[0]?.Name}''(${weekData.ShiftID[0]?.ShiftType})\n`;
            weekInfo += 'Working Days: ';
            weekInfo += weekData.WorkingDays.filter((d: any) => d.Value).map((d: any) => d.Display).join(', ');
            weekInfo += '\nWeek Off Days: ';
            weekInfo += weekData.WeekOffDays.filter((d: any) => d.Value).map((d: any) => d.Display).join(', ');
            rowData.push(weekInfo);
          } else {
            rowData.push('');
          }
        }
       
    
        return rowData;
      });
      console.log(data,"data");
      
      this.pdfExportService.generatePDF(header, title, columns, data);
    }

    OnTypeChange(event:any)
    {
      if(event!=undefined&& event!=null)
      {
        // this.selectedListType=event;
        if(this.UserListType==event)
        {
          this.UserListType="All";
        }
        else{
          this.UserListType=event;
        }
       
      }
      else{
        // this.selectedListType=['Active'];
        this.UserListType="All";
      }
      
    }
            ShowAlert(message: string, type: 'success' | 'warning' | 'error'): void {
                   this.dialog.open(ShowalertComponent, {
                     data: { message, type },
                     panelClass: 'custom-dialog',
                     disableClose: true  
                   }).afterClosed().subscribe((res) => {
                     if (res) {
                       console.log("Dialog closed");
                     }
                   });
                 }
  }
