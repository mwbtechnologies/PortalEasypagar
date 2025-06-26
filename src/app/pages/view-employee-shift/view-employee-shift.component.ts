import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import * as moment from 'moment';
import { PdfExportService } from 'src/app/services/pdf-export.service';
import * as XLSX from 'xlsx';
export class Emp{
  EmployeeID:any;
}

@Component({
  selector: 'app-view-employee-shift',
  templateUrl: './view-employee-shift.component.html',
  styleUrls: ['./view-employee-shift.component.css']
})
export class ViewEmployeeShiftComponent {
  public isSubmit: boolean;
  EmpClass:Array<Emp> = [];
  Editdetails: any;
  editid: any;AdminID:any;OrgID:any;
  BranchList:any; DepartmentList:any;ApiURL:any;NewApiURL:any;
  selectedBranchId:string[]|any; selectedDepartmentId:string[]|any;
  selectedEmployeeId:string[]|any;
  selectedShiftId:string[]|any;
  institutionsList:any;ShiftList:any;EmployeeList:any;
  dtExportButtonOptions: any = {};
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  DeleteShiftUrl:any
  EmployeesArray=[];AddPermission:any;EditPermission:any;ViewPermission:any;DeletePermission:any;   
  index:any;
  ArrayLength=0;
  branchSettings:IDropdownSettings = {}
  BranchApiUrl:any;UserID:any;
  selectedBranch:any[]=[]
 constructor(private _router: Router, private globalToastService: ToastrService,
    private spinnerService: NgxSpinnerService,private _commonservice: HttpCommonService,
    public dialog: MatDialog,private toastr: ToastrService,private pdfExportService : PdfExportService) {
   this.isSubmit = false;
   this.branchSettings = {
     singleSelection: true,
     idField: 'Value',
     textField: 'Text',
     selectAllText: 'Select All',
     unSelectAllText: 'UnSelect All',
     itemsShowLimit: 1,
     allowSearchFilter: true,
   };
 }
 ngOnInit(): void {
   this.AdminID = localStorage.getItem("AdminID");
   this.OrgID = localStorage.getItem("OrgID");
   this.UserID = localStorage.getItem("UserID");
   if (this.AdminID==null||this.AdminID==""||this.OrgID==undefined||this.OrgID==null||this.OrgID==""||this.AdminID==undefined) {
     this._router.navigate(["auth/signin-v2"]);
   }
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

   this.AddPermission=localStorage.getItem("AddPermission"); if(this.AddPermission=="true"){this.AddPermission=true;} else{this.AddPermission=false;}
   this.EditPermission=localStorage.getItem("EditPermission");  if(this.EditPermission=="true"){this.EditPermission=true;}else{this.EditPermission=false;}
   this.ViewPermission=localStorage.getItem("ViewPermission");  if(this.ViewPermission=="true"){this.ViewPermission=true;}else{this.ViewPermission=false;}
   this.DeletePermission=localStorage.getItem("DeletePermission");  if(this.DeletePermission=="true"){this.DeletePermission=true;}else{this.DeletePermission=false;}
  
   this.GetAllotedShifts()
  }

 GetAllotedShifts() {
   const selectedBranchIDs = this.selectedBranch.map(branch => branch.Value);
   this.spinnerService.show();
   this.ApiURL="ShiftMaster/GetEmpShiftAllocationList?EmployeeID="+this.UserID;
    console.log(this.ApiURL,"list allocationlist");
   const json = {
       "BranchID": selectedBranchIDs,
       "DepartmentID": [],
       "AdminID":this.AdminID
   }
   this._commonservice.ApiUsingPost(this.ApiURL,json).subscribe((sec) => {
     if(sec.Status==true)
     {
       if(this.institutionsList!=undefined && this.institutionsList!=null)
       {
         var table = $('#DataTables_Table_0').DataTable();
         table.destroy();
         this.institutionsList = sec.List;
         console.log(sec.List,"list allocationlist");
         this.dtTrigger.next(null);
       } 
       else{
         this.institutionsList = sec.List;
         console.log(sec.List,"list allocationlist");
       } 
     
       this.spinnerService.hide();
     }
     this.spinnerService.hide();
   }, (error) => {
     this.spinnerService.hide();
     
   });
 }

   selectAll() {
   }
 
   unselectAll() {
     this.selectedEmployeeId=[];
   }
   exportexcel(){
     let columns = ['EmployeeName','Branch','Department','CreatedDate'];
     let weekColumns = ['Week-I', 'Week-II', 'Week-III', 'Week-IV', 'Week-V'];
     columns = columns.concat(weekColumns);
     let fileName = 'EmployeeShift.xlsx'
     let data = this.institutionsList.map((item:any) => {
       const rowData: any[] = [];
       rowData.push(item['EmployeeName']);
       rowData.push(item['Branch']);
       rowData.push(item['Department']);
       rowData.push(moment(item['CreatedDate']).format('MMMM Do YYYY'));
   
       // Populate week-specific columns
       for (let week of weekColumns) {
         let weekData = item['WeekConfig'].find((w: any) => w.WeekName === week);
         if (weekData) {
           let weekInfo = `Shift: ${weekData.ShiftID[0].Name}\n`;
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
     let columns = ['EmployeeName','Branch','Department','CreatedDate'];
     let weekColumns = ['Week-I', 'Week-II', 'Week-III', 'Week-IV', 'Week-V'];
     columns = columns.concat(weekColumns);
     const header = ''
     const title = 'Allocate Shift'
     let data = this.institutionsList.map((item:any) => {
       const rowData: any[] = [];
       rowData.push(item['EmployeeName']);
       rowData.push(item['Branch']);
       rowData.push(item['Department']);
       rowData.push(moment(item['CreatedDate']).format('MMMM Do YYYY'));
   
       // Populate week-specific columns
       for (let week of weekColumns) {
         let weekData = item['WeekConfig'].find((w: any) => w.WeekName === week);
         if (weekData) {
           let weekInfo = `Shift: ${weekData.ShiftID[0].Name}\n`;
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
 }

