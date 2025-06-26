import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { Emp } from '../generate-payslip/generate-payslip.component';
import { MatDialog } from '@angular/material/dialog';
import { CheckinoutdataComponent } from './checkinoutdata/checkinoutdata.component';
import { getMonth } from 'date-fns';
import { ShowlogsComponent } from './showlogs/showlogs.component';
import { SavedailogComponent } from './savedailog/savedailog.component';
import { ShowalertComponent } from '../create-employee/showalert/showalert.component';

@Component({
  selector: 'app-attendance-rectification',
  templateUrl: './attendance-rectification.component.html',
  styleUrls: ['./attendance-rectification.component.css']
})
export class AttendanceRectificationComponent {
  EmployeeList:any;
  EmpClass:Array<Emp> = [];
  BranchList:any[]=[];
  DepartmentList:any; YearList:any;MonthList:any;
  TypeList:any[]=['Date Wise','Employee Wise']
  selectedDate:any
  selectedType:any
  AdminID: any;
  ApiURL:any;
  OrgID:any;
  SalaryList:any;
  dtExportButtonOptions: any = {};
  dtOptions: DataTables.Settings = {};
  dtOptions1: DataTables.Settings = {};
  dtExportButtonOptions1: any = {};
  dtTrigger1: Subject<any> = new Subject();
  dtTrigger: Subject<any> = new Subject();
  ViewPermission:any;
  branchSettings :IDropdownSettings = {}
  departmentSettings :IDropdownSettings = {}
  typeSettings :IDropdownSettings = {}
  monthSettings :IDropdownSettings = {}
  yearSettings :IDropdownSettings = {}
  employeeSettings :IDropdownSettings = {}
  temparray:any=[]; tempdeparray:any=[];
  selectedDepartment:any[]=[];
  selectedyear:any[]=[]
  selectedMonth:any[]=[]
  selectedEmployees:any[]=[];
  selectedBranch:any[]=[]
  UserID:any;
  AttendanceList: any
  DisplayList: any;
  EmployeeWiseData:any
  EmployeeFilteredDate:any

  FinalList:any[]=[];
  FinalEmployeeList:any[]=[]
  OriginalList:any[]=[];
  OriginalDateWiseList:any[]=[];
filteredAttendanceList:any[]=[]
timeFormat:any
LogsData:any[]=[]
selectedOrganization:any[]=[]
OrgList:any[]=[]
orgSettings:IDropdownSettings = {}

  constructor(public dialog: MatDialog,private _router: Router,private spinnerService: NgxSpinnerService,
    private _commonservice: HttpCommonService, private globalToastService:ToastrService,private _httpClient:HttpClient){ 
      this.branchSettings = {
        singleSelection: true,
        idField: 'Value',
        textField: 'Text',
        itemsShowLimit: 1,
        allowSearchFilter: true,
      };
      this.typeSettings = {
        singleSelection: true,
        idField: 'id',
        textField: 'text',
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
      this.yearSettings = {
        singleSelection: true,
        idField: 'Value',
        textField: 'Text',
        itemsShowLimit: 1,
        allowSearchFilter: true,
      };
      this.employeeSettings = {
        singleSelection: true,
        idField: 'ID',
        textField: 'Name',
        itemsShowLimit: 1,
        allowSearchFilter: true,
      };
      this.monthSettings = {
        singleSelection: true,
        idField: 'Value',
        textField: 'Text',
        itemsShowLimit: 1,
        allowSearchFilter: true,
      };
      this.departmentSettings = {
        singleSelection: true,
        idField: 'Value',
        textField: 'Text',
        itemsShowLimit: 1,
        allowSearchFilter: true,
      };
      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 50
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
      this.dtOptions1 = {
        pagingType: 'full_numbers',
        pageLength: 50
      };
      this.dtExportButtonOptions1 = {
        dom: 'Bfrtip',
        buttons: [
          'copy',
          'print',
          'excel',
          'csv'
        ]
      };
  }
  ngOnInit(){
    this.AdminID = localStorage.getItem("AdminID");
    this.OrgID = localStorage.getItem("OrgID");
    this.UserID=localStorage.getItem("UserID");
    this.GetOrganization();
     this.GetBranches()
     this.getEmployeeList()
     this.GetYearList()
     this.GetMonthList()
     this.getTimeFormat()
     const now = new Date();
     const currentMonth = now.getMonth() + 1; 
     const currentYear = now.getFullYear();
     const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
     const monthIndex = currentMonth - 1;

     this.selectedMonth = [{
       "Value": currentMonth, 
       "CreatedByID": null,
       "Text": monthNames[monthIndex],
       "createdbyname": null,
       "Key": null
     }];
     this.selectedyear = [{
      "Value": currentYear,
      "CreatedByID": null,
      "Text": currentYear.toString(),
      "createdbyname": null,
      "Key": null
  }]
  }
  getTimeFormat(){
    this.timeFormat = 24;
    let TimeFormat:boolean  = Boolean(localStorage.getItem("TimeFormat"))
    if(TimeFormat == true){
      this.timeFormat = 12
    }
  }

  backToDashboard()
{
  this._router.navigate(["appdashboard"]);
}

  OnTypeChange(item:any){
    item == 'Employee Wise' ? 
    (this.getEmployeeList(),
      this.GetMonthList(),
     this.GetYearList(),this.FinalList = [] ) : '' ,this.FinalEmployeeList = []
  }
  OnTypeChangeDeSelect(item:any){

  }
  onselectedOrg(item:any){
    this.selectedBranch = []
    this.selectedDepartment = []
    this.GetBranches()
  }
  onDeselectedOrg(item:any){
    this.selectedBranch = []
    this.selectedDepartment = []
    this.GetBranches()
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
      this.ShowToast(error,"error")
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
      this.ShowToast(error,"error")
       console.log(error);
    });

  }
  GetYearList(){
    this._commonservice.ApiUsingGetWithOneParam("Admin/GetYearList").subscribe((data) => this.YearList = data.List, (error) => {
    console.log(error);
 });
  }
  GetMonthList(){
    this._commonservice.ApiUsingGetWithOneParam("Admin/GetMonthList").subscribe((data) => this.MonthList = data.List, (error) => {
    console.log(error);
 });
  }

  GetDateWiseDetails(){
    console.log(this.selectedDate)
    if(this.selectedDate == null || this.selectedDate == "" || this.selectedDate == undefined){
      // this.globalToastService.warning("please select date")
      this.ShowToast("Please select date","warning")
    }
    else if(this.selectedBranch.length==0){
      // this.globalToastService.warning("Please select Branch");
      this.ShowToast("Please select Branch","warning")
      this.spinnerService.hide();
    }
    else{
      this.spinnerService.show()
      let branch = this.selectedBranch.map((e:any)=>e.Value)[0]
      let dept = this.selectedDepartment.map((e:any)=>e.Value)[0] || 0
      this._commonservice.ApiUsingGetWithOneParam("Performance/GetDailyAttendance?AdminID="+this.AdminID+"&BranchID="+branch+"&Date="+this.selectedDate+"&ListType=All&DeptID="+dept+"").subscribe((res:any)=>{
        if(res.Status==true){
          this.FinalEmployeeList = []
          var table = $('#DataTables_Table_1').DataTable();
          table.destroy();
          this.EmployeeWiseData = res.List;
          this.EmployeeFilteredDate=this.EmployeeWiseData;
          this.spinnerService.hide()
          for(let i=0;i<this.EmployeeFilteredDate.length;i++)
            {
              var tmp:any=[];
              if(this.EmployeeFilteredDate[i].count==1)
              {
                if(this.EmployeeFilteredDate[i].LoginData[0]?.SessionTypeID === 6) //Whole day
                {
                  tmp.push({"AttendanceID": this.EmployeeFilteredDate[i].LoginData[0]?.ID,"In":this.formatDateToDateTimeLocal(this.EmployeeFilteredDate[i].LoginData[0]?.CheckInDate),"Out":""})
                  tmp.push({"AttendanceID":0,"In":"","Out":this.formatDateToDateTimeLocal(this.EmployeeFilteredDate[i].LoginData[0]?.CheckOutDate)})
                }
                if(this.EmployeeFilteredDate[i].LoginData[0].SessionTypeID === 5)//Second Half
                  {
                    tmp.push({"AttendanceID":0,"In":"","Out":""})
                    tmp.push({"AttendanceID": this.EmployeeFilteredDate[i].LoginData[0]?.ID,"In":this.formatDateToDateTimeLocal(this.EmployeeFilteredDate[i].LoginData[0]?.CheckInDate),"Out":this.formatDateToDateTimeLocal(this.EmployeeFilteredDate[i].LoginData[0]?.CheckOutDate)})
                  }
                if(this.EmployeeFilteredDate[i].LoginData[0].SessionTypeID === 4) // First Half
                  {
                    tmp.push({"AttendanceID": this.EmployeeFilteredDate[i].LoginData[0]?.ID,"In":this.formatDateToDateTimeLocal(this.EmployeeFilteredDate[i].LoginData[0]?.CheckInDate),"Out":this.formatDateToDateTimeLocal(this.EmployeeFilteredDate[i].LoginData[0]?.CheckOutDate)})
                    tmp.push({"AttendanceID":0,"In":"","Out":""})
                  }
              }
             else if(this.EmployeeFilteredDate[i].count==2)
  
              {
                tmp.push({"AttendanceID": this.EmployeeFilteredDate[i].LoginData[0]?.ID,"In":this.formatDateToDateTimeLocal(this.EmployeeFilteredDate[i].LoginData[0]?.CheckInDate),"Out":this.formatDateToDateTimeLocal(this.EmployeeFilteredDate[i].LoginData[0]?.CheckOutDate)})
                tmp.push({"AttendanceID": this.EmployeeFilteredDate[i].LoginData[1]?.ID,"In":this.formatDateToDateTimeLocal(this.EmployeeFilteredDate[i].LoginData[1]?.CheckInDate),"Out":this.formatDateToDateTimeLocal(this.EmployeeFilteredDate[i].LoginData[1]?.CheckOutDate)})
              }

              else if(this.EmployeeFilteredDate[i].count==0){
                tmp.push({"AttendanceID":0,"In":"","Out":""});
                tmp.push({"AttendanceID":0,"In":"","Out":""});
              }
              else {
                tmp.push({"AttendanceID":0,"In":"","Out":""});
                tmp.push({"AttendanceID":0,"In":"","Out":""});
              }
              this.FinalEmployeeList.push({"EmployeeId":this.EmployeeFilteredDate[i].MappedEmpId,"Date":this.EmployeeFilteredDate[i].Date,"Name":this.EmployeeFilteredDate[i].EmployeeName,"Employee":this.EmployeeFilteredDate[i].EmployeeID,"Admin":this.EmployeeFilteredDate[i].AdminID,"LoginData":tmp,"PayslipExist":this.EmployeeFilteredDate[i].PayslipExist})
              console.log(this.FinalEmployeeList,"response");
              
              
            }
            this.OriginalDateWiseList = JSON.parse(JSON.stringify(this.FinalEmployeeList));
          this.dtTrigger.next(null);
          }
          this.spinnerService.hide();
        }, (error) => {
          this.spinnerService.hide();
        });
    }
  }
 
  GetDepartments() {
    this.selectedDepartment=[];
    var loggedinuserid=localStorage.getItem("UserID");
    const json={
      AdminID:loggedinuserid,
      OrgID:this.OrgID,
      Branches:this.selectedBranch.map((br: any) => {
        return {
          "id":br.Value
        }
      })
    }
    this._commonservice.ApiUsingPost("Portal/GetEmployeeDepartments",json).subscribe((data) => {
      console.log(data);
      if (data.DepartmentList.length > 0) {
        this.DepartmentList = data.List;
        console.log(this.DepartmentList,"department list");
      }
    }, (error) => {
      // this.globalToastService.error(error); 
      this.ShowToast(error,"error")
      console.log(error);
    });
  }

  getEmployeeList(){
    this.selectedEmployees=[];
  const json:any = {
    AdminID:this.AdminID
  }
  if (this.selectedBranch.length>0) {
    json["BranchID"] =  this.selectedBranch.map((br:any)=>{return br.Value})
    if (this.selectedDepartment) {
      json["DepartmentID"] =  this.tempdeparray.map((br:any)=>{ return br.id})
     }
     if (this.selectedyear) {
      json["Year"] =  this.selectedyear.map((sy:any)=>{ return sy.Text})[0]
     }
    if (this.selectedMonth) {
      json["Month"] =  this.selectedMonth.map((sm:any)=>{ return sm.Value})[0]
     }
    this._commonservice.ApiUsingPost("Portal/GetEmpListOnBranch",json).subscribe((data) => {
    this.EmployeeList = data.List
    }
    ,(error) => {
    console.log(error);this.spinnerService.hide();
  });
   }

  }
  // onDeptSelect(item:any){
  //   console.log(item,"item");
  //   this.tempdeparray.push({id:item.Value, text:item.Text });
  //   if(this.tempdeparray.length  == this.DepartmentList.length) this.onDeptDeSelectAll()
  //   this.selectedEmployees = []
  //   this.getEmployeeList()
  //  }
  //  onDeptSelectAll(){
  //    this.tempdeparray = [...this.DepartmentList]
  //    this.selectedEmployees = []
  //    this.tempdeparray = [];
  //   this.getEmployeeList()
  //  }
  //  onDeptDeSelectAll(){
  //   this.tempdeparray = [];
  //   this.selectedEmployees = []
  //   this.getEmployeeList()
  //  }
  //  onDeptDeSelect(item:any){
  //   console.log(item,"item");
  //   console.log(this.tempdeparray,"tempdeparray");
  //   console.log(this.tempdeparray.findIndex((sd:any)=>sd == item));
    
  //   if(this.tempdeparray.findIndex((sd:any)=>sd == item) != -1){
  //     this.tempdeparray.splice(this.tempdeparray.indexOf(item), 1);
  //   }else{
  //     this.tempdeparray = this.DepartmentList.map((dl:any)=>{return {id:dl.Value, text:dl.Text }}).filter((dl:any)=>dl.id != item.Value && dl.text != item.Text)
  //   }

  //   this.selectedEmployees = []
  //   this.getEmployeeList()
  //  }
  onDeptSelect(item:any){
    this.tempdeparray.splice(this.tempdeparray.indexOf(item), 1);
    console.log(item,"item");
    this.tempdeparray.push({id:item.Value, text:item.Text });
    // if(this.tempdeparray.length  == this.DepartmentList.length) this.onDeptDeSelectAll()
    this.selectedEmployees = []
    this.getEmployeeList()
   }
   onDeptSelectAll(){
     this.tempdeparray = [...this.DepartmentList]
     this.selectedEmployees = []
     this.tempdeparray = [];
    this.getEmployeeList()
   }
   onDeptDeSelectAll(){
    this.tempdeparray = [...this.DepartmentList]
    this.tempdeparray = [];
    this.selectedEmployees = []
    this.getEmployeeList()
   }
   onDeptDeSelect(item:any){
    debugger
    this.tempdeparray.splice(this.tempdeparray.indexOf(item), 1);
    this.selectedEmployees = []
    this.getEmployeeList()
   }
  onBranchSelect(item:any){
   console.log(item,"item");
   this.temparray.push({id:item.Value,text:item.Text });
   this.selectedDepartment = []
   this.GetDepartments();
   this.selectedEmployees = []
   this.getEmployeeList()
  }
  onBranchDeSelect(item:any){
   console.log(item,"item");
   this.temparray.splice(this.temparray.indexOf(item), 1);
   this.selectedDepartment = []
   this.DepartmentList = []
   this.GetDepartments();
   this.selectedEmployees = []
   this.getEmployeeList()
  }

  OnYearChange(event:any){
    this.spinnerService.show();
    this.selectedEmployees = []
    this.getEmployeeList()
    this.spinnerService.hide();
  }
  onyearDeSelect(event:any){
    this.spinnerService.show();
    this.selectedEmployees = []
    this.getEmployeeList()
    this.spinnerService.hide();
  }
  OnMonthChange(event:any)
  {
    this.spinnerService.show();
    this.getEmployeeList()
    this.spinnerService.hide();
  }
  onMonthDeSelect(event:any)
  {
    this.spinnerService.show();
    this.getEmployeeList()
    this.spinnerService.hide();
  }
  OnEmployeesChange(_event:any){
  }
  OnEmployeesChangeDeSelect(event:any){ 
  }
  GetAttendanceDetails(){
    if(this.selectedyear.length==0){
      // this.globalToastService.warning("Please Select Year")
      this.ShowToast("Please Select Year","warning")
      this.spinnerService.hide();
          }
          else if(this.selectedMonth.length==0){
            // this.globalToastService.warning("Please Select Month");
            this.ShowToast("Please Select Month","warning")
            this.spinnerService.hide();
          }
            else if(this.selectedBranch.length==0){
            // this.globalToastService.warning("Please select Branch");
            this.ShowToast("Please Select Branch","warning")
            this.spinnerService.hide();
          }
            else if(this.selectedEmployees.length==0){
            // this.globalToastService.warning("Please select Employee");
            this.ShowToast("Please Select Employee","warning")
            this.spinnerService.hide();
          }
        else{
          this.spinnerService.show()
          let user = this.selectedEmployees.map((e:any)=>e.ID)[0]
          let month = this.selectedMonth.map((e:any)=>e.Value)[0]
          let year = this.selectedyear.map((e:any)=>e.Value)[0]
          this.ApiURL="Performance/GetCustomAttendance?EmployeeID="+user+"&Month="+month+"&Year="+year+"&StartDate=&EndDate=&Filter=All";
     
          this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((res: any) => {
          
            if(res.Status==true)
            {
              this.FinalList = []
              var table = $('#DataTables_Table_0').DataTable();
              table.destroy();
              this.AttendanceList = res.List;
              this.DisplayList=this.AttendanceList;
              this.filteredAttendanceList = [...this.DisplayList]
              console.log(this.DisplayList);
              this.spinnerService.hide()
              for(let i=0;i<this.DisplayList.length;i++)
              {
                var tmp:any=[];
                 let DL = this.DisplayList[i]
                if(DL.count==1)
                {
                  if(DL.LoginData[0]?.SessionTypeID === 6) //Whole day
                  {
                    tmp.push({"AttendanceID": DL.LoginData[0]?.ID,"In":this.formatDateToDateTimeLocal(DL.LoginData[0]?.CheckInDate),"Out":""})
                    tmp.push({"AttendanceID":0,"In":"","Out":this.formatDateToDateTimeLocal(DL.LoginData[0]?.CheckOutDate)})
                  }
                  if(DL.LoginData[0].SessionTypeID === 5)//Second Half
                    {
                      tmp.push({"AttendanceID":0,"In":"","Out":""})
                      tmp.push({"AttendanceID": DL.LoginData[0]?.ID,"In":this.formatDateToDateTimeLocal(DL.LoginData[0]?.CheckInDate),"Out":this.formatDateToDateTimeLocal(DL.LoginData[0]?.CheckOutDate)})
                    }
                  if(DL.LoginData[0].SessionTypeID === 4) // First Half
                    {
                      tmp.push({"AttendanceID": DL.LoginData[0]?.ID,"In":this.formatDateToDateTimeLocal(DL.LoginData[0]?.CheckInDate),"Out":this.formatDateToDateTimeLocal(DL.LoginData[0]?.CheckOutDate)})
                      tmp.push({"AttendanceID":0,"In":"","Out":""})
                    }
                }
               else if(DL.count==2)
                {
                  tmp.push({"AttendanceID": DL.LoginData[0]?.ID,"In":this.formatDateToDateTimeLocal(DL.LoginData[0]?.CheckInDate),"Out":this.formatDateToDateTimeLocal(DL.LoginData[0]?.CheckOutDate)})
                  tmp.push({"AttendanceID": DL.LoginData[1]?.ID,"In":this.formatDateToDateTimeLocal(DL.LoginData[1]?.CheckInDate),"Out":this.formatDateToDateTimeLocal(DL.LoginData[1]?.CheckOutDate)})
                }
                else if(DL.count==0){
                  tmp.push({"AttendanceID":0,"In":"","Out":""});
                  tmp.push({"AttendanceID":0,"In":"","Out":""});
                }
                else{
                  tmp.push({"AttendanceID":0,"In":"","Out":""});
                  tmp.push({"AttendanceID":0,"In":"","Out":""});
                }
                this.FinalList.push({"Employee":this.AttendanceList[i].EmployeeID,"Name":this.AttendanceList[i].EmployeeName,"Date":this.DisplayList[i].Date,"CheckInData":tmp,"PayslipExist":res.payslipgenerated})
              }
              this.OriginalList = JSON.parse(JSON.stringify(this.FinalList));
              this.dtTrigger1.next(null);
            }
            this.spinnerService.hide();
          }, (error) => {
            this.spinnerService.hide();
          });
        }
  }
  formatDateToDateTimeLocal(dateStr: string): string {
    if(dateStr != " "){
      const [day, month, yearAndTime] = dateStr.split('/');
      const [year, time] = yearAndTime.split(' ');
      return `${year}-${month}-${day}T${time.slice(0, 5)}`; // yyyy-MM-ddTHH:mm
    }else{
      return ""
    }
  }

   parseDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split('/').map(Number); 
    return new Date(year, month - 1, day);
  }

  //-----------------empwise validation ---------------------------------------------
  clearEMPwiseDate(event: Event,IL:any,index:any,field:any){
    if(IL.PayslipExist){

    }else{
    console.log(index,field)
    console.log(IL.CheckInData[index][field])
    IL.CheckInData[index][field] = ''
    console.log(IL.CheckInData[index][field])
    switch (field) {
      case 'In':
        IL.CheckInData[index].InError = ''
        break;
    
      case 'Out':
        IL.CheckInData[index].OutError = ''
        break;
    }
  }

  }
  onEMPWiseInputChange(event: Event,row:any,field: string,index:any) {
    const valid = (event.target as HTMLInputElement)?.validity?.valid;
    if(!valid){
      switch (field) {
        case 'In':
          row.CheckInData[index].InError = 'Invalid DateTime'
          break;
      
        case 'Out':
          row.CheckInData[index].OutError = 'Invalid DateTime'
          break;
      }
    }else{
      row.CheckInData[0].InError = ""
      row.CheckInData[0].OutError = ""
      row.CheckInData[1].InError = ""
      row.CheckInData[1].OutError = ""
    }
  }

  onEMPCheckInModelChange(value: any, IL: any, feild: string) {
    setTimeout(() => {
      this.validateEMPInputs(IL, feild);
    }, 3000);
  }
  validateEMPInputs(row: any, field: string): void {
    const rowStartDate = this.parseDate(row.Date);
    rowStartDate.setHours(0, 0, 0, 0); 
    const rowEndDate = this.parseDate(row.Date);
    rowEndDate.setHours(47, 59, 59, 999);
    
    const checkIn0In = row.CheckInData[0]?.In ? new Date(row.CheckInData[0].In) : null;
    const checkIn0Out = row.CheckInData[0]?.Out ? new Date(row.CheckInData[0].Out) : null;
    const checkIn1In = row.CheckInData[1]?.In ? new Date(row.CheckInData[1].In) : null;
    const checkIn1Out = row.CheckInData[1]?.Out ? new Date(row.CheckInData[1].Out) : null;
  
    let errorMessage = '';
  
    switch (field) {
      case 'CheckInData[0].In':
        if (checkIn0In) {
          if (checkIn0In <= rowStartDate || checkIn0In >= rowEndDate) {
            errorMessage = 'First Half Check-in time must be between the Date.';
          }
          if (checkIn0Out && checkIn0In > checkIn0Out) {
            setTimeout(() => {
            row.CheckInData[0].Out = null;
            })
            errorMessage = 'Check-in time cannot be after Check-out time.';
          }
        }
        break;
  
      case 'CheckInData[0].Out':
        if (checkIn0Out) {
          if (checkIn0Out <= rowStartDate || checkIn0Out >= rowEndDate) {
            errorMessage = 'First Half Check-out time must be between the Date.';
          }
          if (checkIn1In && checkIn0Out > checkIn1In) {
            setTimeout(() => {
            row.CheckInData[1].In = null;
            })
            errorMessage = 'First check-out time cannot be after second check-in time.';
          }
        }
        break;
  
      case 'CheckInData[1].In':
        if (checkIn1In) {
          if (checkIn1In <= rowStartDate || checkIn1In >= rowEndDate) {
            errorMessage = 'Second Half Check-in time must be between the Date.';
          }
          if (checkIn1Out && checkIn1In > checkIn1Out) {
            setTimeout(() => {
            row.CheckInData[1].Out = null; 
            })
            errorMessage = 'Second check-in time cannot be after second check-out time.';
          }
        }
        break;
  
      case 'CheckInData[1].Out':
        if (checkIn1Out) {
          if (checkIn1Out <= rowStartDate || checkIn1Out >= rowEndDate) {
            errorMessage = 'Second Half Check-out time must be between the Date.';
          }
        }
        break;
    }
  
    // Existing validations for Check-in and Check-out times
    switch (field) {
      case 'CheckInData[0].In':
        if (checkIn0In && checkIn0In <= rowStartDate) {
          errorMessage = 'Check-in time must be after the row date.';
        } else if (checkIn0In && checkIn1Out && checkIn0In >= checkIn1Out) {
          errorMessage = 'First Half Check-in Must Be Lesser Than Second Half Checkoout';
        } else if (checkIn0In && checkIn1Out && (checkIn1Out.getTime() - checkIn0In.getTime()) < 5 * 60 * 1000) {
          errorMessage = 'Please Maintain 5 Min gap between Check In and Check Out';
        }
        break;
  
      case 'CheckInData[0].Out':
        if (checkIn0Out) {
          if (checkIn0In && checkIn0Out <= checkIn0In) {
            errorMessage = 'Check-out time must be after check-in time.';
          } else if (checkIn0In && (checkIn0Out.getTime() - checkIn0In.getTime()) < 5 * 60 * 1000) {
            errorMessage = 'Please Maintain 5 Min gap between Check In and Check Out';
          } else if (!checkIn0In && checkIn0Out <= rowStartDate) {
            errorMessage = 'Check-out time must be after the row date.';
          }
        }
        break;
  
      case 'CheckInData[1].In':
        if (checkIn1In) {
          if (checkIn0In && !checkIn0Out) {
            errorMessage = 'Cannot add Second Half check-in without First Half check-out.';
          }else if (checkIn0Out && checkIn1In <= checkIn0Out) {
            errorMessage = 'Second Half check-in must be after the first check-out.';
          }else if (checkIn0Out && (checkIn1In.getTime() - checkIn0Out.getTime()) < 5 * 60 * 1000) {
            errorMessage = 'Please Maintain 5 Min gap between Check In and Check Out';
          } else if (!checkIn0Out && checkIn0In && checkIn1In <= checkIn0In) {
            errorMessage = 'Second Half check-in must be after the first check-in.';
          } else if (!checkIn0Out && checkIn0In && (checkIn1In.getTime() - checkIn0In.getTime()) < 5 * 60 * 1000) {
            errorMessage = 'Please Maintain 5 Min gap between Check In and Check Out';
          }else if (!checkIn0Out && !checkIn0In && checkIn1In <= rowStartDate) {
            errorMessage = 'Second Half check-in must be after the row date.';
          }
        }
        break;
  
      case 'CheckInData[1].Out':
        if (checkIn1Out) {
          if (checkIn1In && checkIn1Out <= checkIn1In) {
            errorMessage = 'Second check-out must be after the second check-in.';
          } else if (checkIn1In && (checkIn1Out.getTime() - checkIn1In.getTime()) < 5 * 60 * 1000) {
            errorMessage = 'Please Maintain 5 Min gap between Check In and Check Out';
          }else if (!checkIn1In && checkIn0Out && checkIn1Out <= checkIn0Out) {
            errorMessage = 'Second check-out must be after the first check-out.';
          } else if (!checkIn1In && checkIn0Out && (checkIn1Out.getTime() - checkIn0Out.getTime()) < 5 * 60 * 1000) {
            errorMessage = 'Please Maintain 5 Min gap between Check In and Check Out';
          } else if (!checkIn1In && !checkIn0Out && checkIn0In && checkIn1Out <= checkIn0In) {
            errorMessage = 'Second check-out must be after the first check-in.';
          } else if (!checkIn1In && !checkIn0Out && checkIn0In && (checkIn1Out.getTime() - checkIn0In.getTime())< 5 * 60 * 1000) {
            errorMessage = 'Please Maintain 5 Min gap between Check In and Check Out';
          } else if (!checkIn1In && !checkIn0Out && !checkIn0In && checkIn1Out <= rowStartDate) {
            errorMessage = 'Second check-out must be after the row date.';
          }
        }
        break;
    }
  
    // Display the error message if any
    if (errorMessage) {
      // this.globalToastService.warning(errorMessage);
      this.ShowToast(errorMessage,"warning")
      setTimeout(() => {
        switch (field) {
          case 'CheckInData[0].In':
            row.CheckInData[0].In = null;
            break;
          case 'CheckInData[0].Out':
            row.CheckInData[0].Out = null;
            break;
          case 'CheckInData[1].In':
            row.CheckInData[1].In = null;
            break;
          case 'CheckInData[1].Out':
            row.CheckInData[1].Out = null;
            break;
        }
      });
    }
  }
    //------------------empwise ends here----------------------------------------------

    
  //-----------------datewise validation ---------------------------------------------
  clearDatewiseDate(event: Event,IL:any,index:any,field:any){
    if(IL.PayslipExist){

    }else{
      console.log(index,field)
      console.log(IL.LoginData[index][field])
      IL.LoginData[index][field] = ''
      console.log(IL.LoginData[index][field])
      switch (field) {
        case 'In':
          IL.LoginData[index].InError = ''
          break;
      
        case 'Out':
          IL.LoginData[index].OutError = ''
          break;
      }
    }

  }
  onDateWiseInputChange(event: Event,row:any,field: any,index:any) {
    const valid = (event.target as HTMLInputElement)?.validity?.valid;
    if(!valid){
      switch (field) {
        case 'In':
          row.LoginData[index].InError = 'Invalid DateTime'
          break;
      
        case 'Out':
          row.LoginData[index].OutError = 'Invalid DateTime'
          break;
      }
    }else{
      row.LoginData[0].InError = ""
      row.LoginData[0].OutError = ""
      row.LoginData[1].InError = ""
      row.LoginData[1].OutError = ""
    }
  }

   onDateCheckInModelChange(value: any, IL: any, feild: string) {
    setTimeout(() => {
      this.validateDateInputs(IL, feild);
    }, 3000);
  }

  validateDateInputs(row: any, field: any): void {
    const rowStartDate = this.parseDate(row.Date);
    rowStartDate.setHours(0, 0, 0, 0); 
    const rowEndDate = this.parseDate(row.Date);
    rowEndDate.setHours(47, 59, 59, 999);
    
    const checkIn0In = row.LoginData[0]?.In ? new Date(row.LoginData[0].In) : null;
    const checkIn0Out = row.LoginData[0]?.Out ? new Date(row.LoginData[0].Out) : null;
    const checkIn1In = row.LoginData[1]?.In ? new Date(row.LoginData[1].In) : null;
    const checkIn1Out = row.LoginData[1]?.Out ? new Date(row.LoginData[1].Out) : null;
  
    let errorMessage = '';
  
    switch (field) {
      case 'LoginData[0].In':
        if (checkIn0In) {
          if (checkIn0In && checkIn0In > new Date()) {
            errorMessage = 'First Half Check-in Cannot Be Greater Than Current Time'
          }
          if (checkIn0In <= rowStartDate || checkIn0In >= rowEndDate) {
            errorMessage = 'First Half Check-in time must be between the Date.';
          }
          // Additional validation: If LoginData[0].In > LoginData[0].Out
          if (checkIn0Out && checkIn0In > checkIn0Out) {
            setTimeout(() => {
            row.LoginData[0].Out = null; // Reset CheckOut time
            })
            errorMessage = 'Check-in time cannot be after Check-out time.';
          }
        }
        break;
  
      case 'LoginData[0].Out':
        if (checkIn0Out) {
          if (checkIn0Out && checkIn0Out > new Date()) {
            errorMessage = 'First Half Check-out Cannot Be Greater Than Current Time'
          }
          if (checkIn0Out <= rowStartDate || checkIn0Out >= rowEndDate) {
            errorMessage = 'First Half Check-out time must be between the Date.';
          }
          // Additional validation: If LoginData[0].Out > LoginData[1].In
          if (checkIn1In && checkIn0Out > checkIn1In) {
            setTimeout(() => {
            row.LoginData[1].In = null; // Reset second check-in time
            })
            errorMessage = 'First check-out time cannot be after second check-in time.';
          }
        }
        break;
  
      case 'LoginData[1].In':
        if (checkIn1In) {
          if (checkIn1In && checkIn1In > new Date()) {
            errorMessage = 'Second Half Check-in Cannot Be Greater Than Current Time'
          }
          if (checkIn1In <= rowStartDate || checkIn1In >= rowEndDate) {
            errorMessage = 'Second Half Check-in time must be between the Date.';
          }
          // Additional validation: If LoginData[1].In > LoginData[1].Out
          if (checkIn1Out && checkIn1In > checkIn1Out) {
            setTimeout(() => {
            row.LoginData[1].Out = null; // Reset second check-out time
            })
            errorMessage = 'Second check-in time cannot be after second check-out time.';
          }
        }
        break;
  
      case 'LoginData[1].Out':
        if (checkIn1Out) {
          if (checkIn1Out && checkIn1Out > new Date()) {
            errorMessage = 'Second Half Check-out Cannot Be Greater Than Current Time'
          }
          if (checkIn1Out <= rowStartDate || checkIn1Out >= rowEndDate) {
            errorMessage = 'Second Half Check-out time must be between the Date.';
          }
        }
        break;
    }
  
    // Existing validations for Check-in and Check-out times
    switch (field) {
      case 'LoginData[0].In':
        if (checkIn0In && checkIn0In <= rowStartDate) {
          errorMessage = 'Check-in time must be after the row date.';
        }else if (checkIn0In && checkIn1Out && checkIn0In >= checkIn1Out) {
          errorMessage = 'First Half Check-in Must Be Lesser Than Second Half Checkoout';
        } else if (checkIn0In && checkIn1Out && (checkIn1Out.getTime() - checkIn0In.getTime()) < 5 * 60 * 1000) {
          errorMessage = 'Please Maintain 5 Min gap between Check In and Check Out';
        }
        break;
         
      case 'LoginData[0].Out':
        if (checkIn0Out) {
          if (checkIn0In && checkIn0Out <= checkIn0In) {
            errorMessage = 'Check-out time must be after check-in time.';
          } else if (checkIn0In && (checkIn0Out.getTime() - checkIn0In.getTime()) < 5 * 60 * 1000) {
            errorMessage = 'Please Maintain 5 Min gap between Check In and Check Out';
          } else if (!checkIn0In && checkIn0Out <= rowStartDate) {
            errorMessage = 'Check-out time must be after the row date.';
          }
        }
        break;
  
      case 'LoginData[1].In':
        if (checkIn1In) {
          if (checkIn0Out && checkIn1In <= checkIn0Out) {
            errorMessage = 'Second check-in must be after the first check-out.';
          }else if (checkIn0Out && (checkIn1In.getTime() - checkIn0Out.getTime()) < 5 * 60 * 1000) {
            errorMessage = 'Please Maintain 5 Min gap between Check In and Check Out';
          } else if (!checkIn0Out && checkIn0In && checkIn1In <= checkIn0In) {
            errorMessage = 'Second check-in must be after the first check-in.';
          } else if (!checkIn0Out && checkIn0In && (checkIn1In.getTime() - checkIn0In.getTime()) < 5 * 60 * 1000) {
            errorMessage = 'Please Maintain 5 Min gap between Check In and Check Out';
          }else if (!checkIn0Out && !checkIn0In && checkIn1In <= rowStartDate) {
            errorMessage = 'Second check-in must be after the row date.';
          }
        }
        break;
  
      case 'LoginData[1].Out': 
        if (checkIn1Out) {
          if (checkIn1In && checkIn1Out <= checkIn1In) {
            errorMessage = 'Second check-out must be after the second check-in.';
          } else if (checkIn1In && (checkIn1Out.getTime() - checkIn1In.getTime()) < 5 * 60 * 1000) {
            errorMessage = 'Please Maintain 5 Min gap between Check In and Check Out';
          }else if (!checkIn1In && checkIn0Out && checkIn1Out <= checkIn0Out) {
            errorMessage = 'Second check-out must be after the first check-out.';
          } else if (!checkIn1In && checkIn0Out && (checkIn1Out.getTime() - checkIn0Out.getTime()) < 5 * 60 * 1000) {
            errorMessage = 'Please Maintain 5 Min gap between Check In and Check Out';
          } else if (!checkIn1In && !checkIn0Out && checkIn0In && checkIn1Out <= checkIn0In) {
            errorMessage = 'Second check-out must be after the first check-in.';
          }  else if (!checkIn1In && !checkIn0Out && checkIn0In && (checkIn1Out.getTime() - checkIn0In.getTime())< 5 * 60 * 1000) {
            errorMessage = 'Please Maintain 5 Min gap between Check In and Check Out';
          } else if (!checkIn1In && !checkIn0Out && !checkIn0In && checkIn1Out <= rowStartDate) {
            errorMessage = 'Second check-out must be after the row date.';
          }
        }
        break;
    }
  
    // Display the error message if any
    if (errorMessage) {
      // this.globalToastService.warning(errorMessage);
      this.ShowToast(errorMessage,"warning")
      setTimeout(() => {
        switch (field) {
          case 'LoginData[0].In':
            row.LoginData[0].In = null;
            break;
          case 'LoginData[0].Out':
            row.LoginData[0].Out = null;
            break;
          case 'LoginData[1].In':
            row.LoginData[1].In = null;
            break;
          case 'LoginData[1].Out':
            row.LoginData[1].Out = null;
            break;
        }
      });
    }
  }
  //------------------datewise ends here----------------------------------------------
  

  getCheckinCheckoutData(row:any,value:any){
    console.log(row,"rowdata");
    if(value === 'EMP'){
      let json = {
        "EmpID": this.selectedEmployees.map((se:any)=>se.ID)[0],
        "AttendanceIDs":row.CheckInData.map((cd:any)=>cd.AttendanceID)
      }
      this.gettypewiseinout(json)
    }
    if(value === 'DATE'){
      let json = {
        "EmpID": row.Employee,
        "AttendanceIDs":row.LoginData.map((cd:any)=>cd.AttendanceID)
      }
      this.gettypewiseinout(json)
    }
  }
  gettypewiseinout(json:any){
    this._commonservice.ApiUsingPost("Attendancerectification/GetEmployeeAllAttendance",json).subscribe((res:any)=>{
      if(res.Status == true){
        this.dialog.open(CheckinoutdataComponent, {
          data: { fulldata:res.List }
        })
      }else if(res.Status == false){
        // this.globalToastService.error(res.Message)
        this.ShowToast(res.Message,"error")
      }else {
        // this.globalToastService.error(res.Message)
        this.ShowToast(res.Message,"error")
      }
    },(error)=>{
      // this.globalToastService.error(error.error.Message)
      this.ShowToast(error.error.Message,"error")
    })
  }


  saveAttendance(){
  var ReturnList:any=[];
  for(let i=0;i<this.FinalList.length;i++)
    {
      if(this.FinalList[i].CheckInData[0].In!=this.OriginalList[i].CheckInData[0].In || this.FinalList[i].CheckInData[0].Out!=this.OriginalList[i].CheckInData[0].Out || 
        this.FinalList[i].CheckInData[1].In!=this.OriginalList[i].CheckInData[1].In || this.FinalList[i].CheckInData[1].Out!=this.OriginalList[i].CheckInData[1].Out){
      var tmp:any=[];
       if(this.FinalList[i].CheckInData[0].In!="" && this.FinalList[i].CheckInData[0].Out=="" && this.FinalList[i].CheckInData[1].In=="" && this.FinalList[i].CheckInData[1].Out!=""){
        
          if(this.FinalList[i].CheckInData[0].AttendanceID != 0 && this.FinalList[i].CheckInData[1].AttendanceID != 0){
            tmp.push({"AttendanceID":this.FinalList[i].CheckInData[0].AttendanceID,"SessionID":6, "checkin":"", "checkout":""})
            tmp.push({"AttendanceID":this.FinalList[i].CheckInData[1].AttendanceID,"SessionID":6, "checkin":this.FinalList[i].CheckInData[0].In, "checkout":this.FinalList[i].CheckInData[1].Out})
          }
         else if(this.FinalList[i].CheckInData[0].AttendanceID != 0 && this.FinalList[i].CheckInData[1].AttendanceID == 0){
          tmp.push({"AttendanceID":this.FinalList[i].CheckInData[0].AttendanceID,"SessionID":6, "checkin":this.FinalList[i].CheckInData[0].In, "checkout":this.FinalList[i].CheckInData[1].Out})
          }
         else if(this.FinalList[i].CheckInData[0].AttendanceID == 0 && this.FinalList[i].CheckInData[1].AttendanceID != 0){
          tmp.push({"AttendanceID":this.FinalList[i].CheckInData[1].AttendanceID,"SessionID":6, "checkin":this.FinalList[i].CheckInData[0].In, "checkout":this.FinalList[i].CheckInData[1].Out})
          }
          else {
            tmp.push({"AttendanceID":0,"SessionID":6, "checkin":this.FinalList[i].CheckInData[0].In, "checkout":this.FinalList[i].CheckInData[1].Out})
          }
       }
       else if((this.FinalList[i].CheckInData[0].In!="" && this.FinalList[i].CheckInData[0].Out!="") ||(this.FinalList[i].CheckInData[0].In!="" && this.FinalList[i].CheckInData[0].Out=="")){
        
        if((this.FinalList[i].CheckInData[1].In!="" && this.FinalList[i].CheckInData[1].Out!="") || (this.FinalList[i].CheckInData[1].In!="" && this.FinalList[i].CheckInData[1].Out=="")){
          if(this.FinalList[i].CheckInData[0].AttendanceID != 0 && this.FinalList[i].CheckInData[1].AttendanceID != 0){
            tmp.push({"AttendanceID":this.FinalList[i].CheckInData[0].AttendanceID,"SessionID":4, "checkin":this.FinalList[i].CheckInData[0].In, "checkout":this.FinalList[i].CheckInData[0].Out})
            tmp.push({"AttendanceID":this.FinalList[i].CheckInData[1].AttendanceID,"SessionID":5, "checkin":this.FinalList[i].CheckInData[1].In, "checkout":this.FinalList[i].CheckInData[1].Out})
          }
         else if(this.FinalList[i].CheckInData[0].AttendanceID != 0 && this.FinalList[i].CheckInData[1].AttendanceID == 0){
          tmp.push({"AttendanceID":this.FinalList[i].CheckInData[0].AttendanceID,"SessionID":4, "checkin":this.FinalList[i].CheckInData[0].In, "checkout":this.FinalList[i].CheckInData[0].Out})
          tmp.push({"AttendanceID":0,"SessionID":5, "checkin":this.FinalList[i].CheckInData[1].In, "checkout":this.FinalList[i].CheckInData[1].Out})
        }
         else if(this.FinalList[i].CheckInData[0].AttendanceID == 0 && this.FinalList[i].CheckInData[1].AttendanceID != 0){
          tmp.push({"AttendanceID":0,"SessionID":4, "checkin":this.FinalList[i].CheckInData[0].In, "checkout":this.FinalList[i].CheckInData[0].Out})
          tmp.push({"AttendanceID":this.FinalList[i].CheckInData[1].AttendanceID,"SessionID":5, "checkin":this.FinalList[i].CheckInData[1].In, "checkout":this.FinalList[i].CheckInData[1].Out})
          }
          else {
            tmp.push({"AttendanceID":0,"SessionID":4, "checkin":this.FinalList[i].CheckInData[0].In, "checkout":this.FinalList[i].CheckInData[0].Out})
            tmp.push({"AttendanceID":0,"SessionID":5, "checkin":this.FinalList[i].CheckInData[1].In, "checkout":this.FinalList[i].CheckInData[1].Out})
          } 
        } 
        else{
          if(this.FinalList[i].CheckInData[0].AttendanceID != 0 && this.FinalList[i].CheckInData[1].AttendanceID != 0){
            tmp.push({"AttendanceID":this.FinalList[i].CheckInData[0].AttendanceID,"SessionID":4, "checkin":this.FinalList[i].CheckInData[0].In, "checkout":this.FinalList[i].CheckInData[0].Out})
            tmp.push({"AttendanceID":this.FinalList[i].CheckInData[1].AttendanceID,"SessionID":5, "checkin":"", "checkout":""})
          }
         else if(this.FinalList[i].CheckInData[0].AttendanceID != 0 && this.FinalList[i].CheckInData[1].AttendanceID == 0){
          tmp.push({"AttendanceID":this.FinalList[i].CheckInData[0].AttendanceID,"SessionID":4, "checkin":this.FinalList[i].CheckInData[0].In, "checkout":this.FinalList[i].CheckInData[0].Out})
        }
         else if(this.FinalList[i].CheckInData[0].AttendanceID == 0 && this.FinalList[i].CheckInData[1].AttendanceID != 0){
          tmp.push({"AttendanceID":this.FinalList[i].CheckInData[1].AttendanceID,"SessionID":4, "checkin":this.FinalList[i].CheckInData[0].In, "checkout":this.FinalList[i].CheckInData[0].Out})
        }
          else {
            tmp.push({"AttendanceID":0,"SessionID":4, "checkin":this.FinalList[i].CheckInData[0].In, "checkout":this.FinalList[i].CheckInData[0].Out})
          }
        } 
       }
       else if((this.FinalList[i].CheckInData[1].In!="" && this.FinalList[i].CheckInData[1].Out!="") ||(this.FinalList[i].CheckInData[1].In!="" && this.FinalList[i].CheckInData[1].Out=="")){
        
        if(this.FinalList[i].CheckInData[0].AttendanceID != 0 && this.FinalList[i].CheckInData[1].AttendanceID != 0){
          tmp.push({"AttendanceID":this.FinalList[i].CheckInData[0].AttendanceID,"SessionID":4, "checkin":"", "checkout":""})
          tmp.push({"AttendanceID":this.FinalList[i].CheckInData[1].AttendanceID,"SessionID":5, "checkin":this.FinalList[i].CheckInData[1].In, "checkout":this.FinalList[i].CheckInData[1].Out})
        }
       else if(this.FinalList[i].CheckInData[0].AttendanceID != 0 && this.FinalList[i].CheckInData[1].AttendanceID == 0){
        tmp.push({"AttendanceID":this.FinalList[i].CheckInData[0].AttendanceID,"SessionID":5, "checkin":this.FinalList[i].CheckInData[1].In, "checkout":this.FinalList[i].CheckInData[1].Out})
      }
       else if(this.FinalList[i].CheckInData[0].AttendanceID == 0 && this.FinalList[i].CheckInData[1].AttendanceID != 0){
        tmp.push({"AttendanceID":this.FinalList[i].CheckInData[1].AttendanceID,"SessionID":5, "checkin":this.FinalList[i].CheckInData[1].In, "checkout":this.FinalList[i].CheckInData[1].Out})
      }
        else {
          tmp.push({"AttendanceID":0,"SessionID":5, "checkin":this.FinalList[i].CheckInData[1].In, "checkout":this.FinalList[i].CheckInData[1].Out})
        }
       }
      else {
        if((this.FinalList[i].CheckInData[0].In =="" && this.FinalList[i].CheckInData[0].Out =="") ||(this.FinalList[i].CheckInData[1].In =="" && this.FinalList[i].CheckInData[1].Out =="")){
          
          if(this.FinalList[i].CheckInData[0].AttendanceID != 0 && this.FinalList[i].CheckInData[1].AttendanceID != 0){
              tmp.push({"AttendanceID":this.FinalList[i].CheckInData[0].AttendanceID,"SessionID":0, "checkin":"", "checkout":""})
              tmp.push({"AttendanceID":this.FinalList[i].CheckInData[1].AttendanceID,"SessionID":0, "checkin":"", "checkout":""})
            }
            else if(this.FinalList[i].CheckInData[0].AttendanceID != 0 && this.FinalList[i].CheckInData[1].AttendanceID == 0){
 
             tmp.push({"AttendanceID":this.FinalList[i].CheckInData[0].AttendanceID,"SessionID":0, "checkin":"", "checkout":""})
            }
            else if(this.FinalList[i].CheckInData[0].AttendanceID == 0 && this.FinalList[i].CheckInData[1].AttendanceID != 0){
 
              tmp.push({"AttendanceID":this.FinalList[i].CheckInData[1].AttendanceID,"SessionID":0, "checkin":"", "checkout":""})
            }
       else if(this.FinalList[i].CheckInData[0].In == "" && this.FinalList[i].CheckInData[0].Out != ""){
        // this.globalToastService.warning("You Cant Add First Half Checkout Without Adding First Half CheckIn For " + this.FinalList[i].Name)
        this.ShowToast("You Cant Add First Half Checkout Without Adding First Half CheckIn For " + this.FinalList[i].Name,"warning")
        return
      }
       else if((this.FinalList[i].CheckInData[1].In == "" && this.FinalList[i].CheckInData[1].Out != "")|| (this.FinalList[i].CheckInData[0].In == "" && this.FinalList[i].CheckInData[1].Out != "")){
        // this.globalToastService.warning("You Cant Add Second Half Checkout Without Adding Second Half CheckIn Or First Half CheckIn For " + this.FinalList[i].Name)
        this.ShowToast("You Cant Add Second Half Checkout Without Adding Second Half CheckIn Or First Half CheckIn For " + this.FinalList[i].Name,"warning")
        return
      }
        else {
          tmp.push({"AttendanceID":0,"SessionID":0, "checkin":"", "checkout":""})
        }
      }
      }
      ReturnList.push({"LoginuserID":parseInt(this.AdminID),"EmployeeID":this.AttendanceList[i].EmployeeID,"SelectedDate":this.FinalList[i].Date,"attendancelist":tmp})
  }
}
    console.log(ReturnList,"save attendance");
    this.finalSave(ReturnList,"empwise")
  }

    preventTyping(event: KeyboardEvent): void {
  const allowedKeys = ['Tab', 'ArrowLeft', 'ArrowRight', 'Backspace', 'Delete'];
  if (!allowedKeys.includes(event.key)) {
    event.preventDefault();
  }
}

  saveDateWiseAttendance(){
    var ReturnList:any=[];
    for(let i=0;i<this.FinalEmployeeList.length;i++)
      {
          if(this.FinalEmployeeList && this.FinalEmployeeList[i].LoginData && this.FinalEmployeeList[i].LoginData[0]){
        if(this.FinalEmployeeList[i].LoginData[0].In!=this.OriginalDateWiseList[i].LoginData[0].In || this.FinalEmployeeList[i].LoginData[0].Out!=this.OriginalDateWiseList[i].LoginData[0].Out || 
          this.FinalEmployeeList[i].LoginData[1].In!=this.OriginalDateWiseList[i].LoginData[1].In || this.FinalEmployeeList[i].LoginData[1].Out!=this.OriginalDateWiseList[i].LoginData[1].Out){
        var tmp:any=[];
        if(this.FinalEmployeeList[i].LoginData[0].In!="" && this.FinalEmployeeList[i].LoginData[0].Out=="" && this.FinalEmployeeList[i].LoginData[1].In=="" && this.FinalEmployeeList[i].LoginData[1].Out!=""){
            if(this.FinalEmployeeList[i].LoginData[0].AttendanceID != 0 && this.FinalEmployeeList[i].LoginData[1].AttendanceID != 0){
              tmp.push({"AttendanceID":this.FinalEmployeeList[i].LoginData[0].AttendanceID,"SessionID":6, "checkin":"", "checkout":""})
              tmp.push({"AttendanceID":this.FinalEmployeeList[i].LoginData[1].AttendanceID,"SessionID":6, "checkin":this.FinalEmployeeList[i].LoginData[0].In, "checkout":this.FinalEmployeeList[i].LoginData[1].Out})
            }
           else if(this.FinalEmployeeList[i].LoginData[0].AttendanceID != 0 && this.FinalEmployeeList[i].LoginData[1].AttendanceID == 0){
            tmp.push({"AttendanceID":this.FinalEmployeeList[i].LoginData[0].AttendanceID,"SessionID":6, "checkin":this.FinalEmployeeList[i].LoginData[0].In, "checkout":this.FinalEmployeeList[i].LoginData[1].Out})
            }
           else if(this.FinalEmployeeList[i].LoginData[0].AttendanceID == 0 && this.FinalEmployeeList[i].LoginData[1].AttendanceID != 0){
            tmp.push({"AttendanceID":this.FinalEmployeeList[i].LoginData[1].AttendanceID,"SessionID":6, "checkin":this.FinalEmployeeList[i].LoginData[0].In, "checkout":this.FinalEmployeeList[i].LoginData[1].Out})
            }
            else {
              tmp.push({"AttendanceID":0,"SessionID":6, "checkin":this.FinalEmployeeList[i].LoginData[0].In, "checkout":this.FinalEmployeeList[i].LoginData[1].Out})
            }
          }
         else if((this.FinalEmployeeList[i].LoginData[0].In!="" && this.FinalEmployeeList[i].LoginData[0].Out!="") ||(this.FinalEmployeeList[i].LoginData[0].In!="" && this.FinalEmployeeList[i].LoginData[0].Out=="")){
        
         if((this.FinalEmployeeList[i].LoginData[1].In!="" && this.FinalEmployeeList[i].LoginData[1].Out!="") || (this.FinalEmployeeList[i].LoginData[1].In!="" && this.FinalEmployeeList[i].LoginData[1].Out=="")){
            if(this.FinalEmployeeList[i].LoginData[0].AttendanceID != 0 && this.FinalEmployeeList[i].LoginData[1].AttendanceID != 0){
              tmp.push({"AttendanceID":this.FinalEmployeeList[i].LoginData[0].AttendanceID,"SessionID":4, "checkin":this.FinalEmployeeList[i].LoginData[0].In, "checkout":this.FinalEmployeeList[i].LoginData[0].Out})
              tmp.push({"AttendanceID":this.FinalEmployeeList[i].LoginData[1].AttendanceID,"SessionID":5, "checkin":this.FinalEmployeeList[i].LoginData[1].In, "checkout":this.FinalEmployeeList[i].LoginData[1].Out})
            }
           else if(this.FinalEmployeeList[i].LoginData[0].AttendanceID != 0 && this.FinalEmployeeList[i].LoginData[1].AttendanceID == 0){
            tmp.push({"AttendanceID":this.FinalEmployeeList[i].LoginData[0].AttendanceID,"SessionID":4, "checkin":this.FinalEmployeeList[i].LoginData[0].In, "checkout":this.FinalEmployeeList[i].LoginData[0].Out})
            tmp.push({"AttendanceID":0,"SessionID":5, "checkin":this.FinalEmployeeList[i].LoginData[1].In, "checkout":this.FinalEmployeeList[i].LoginData[1].Out})
          }
           else if(this.FinalEmployeeList[i].LoginData[0].AttendanceID == 0 && this.FinalEmployeeList[i].LoginData[1].AttendanceID != 0){
            tmp.push({"AttendanceID":0,"SessionID":4, "checkin":this.FinalEmployeeList[i].LoginData[0].In, "checkout":this.FinalEmployeeList[i].LoginData[0].Out})
            tmp.push({"AttendanceID":this.FinalEmployeeList[i].LoginData[1].AttendanceID,"SessionID":5, "checkin":this.FinalEmployeeList[i].LoginData[1].In, "checkout":this.FinalEmployeeList[i].LoginData[1].Out})
            }
            else {
              tmp.push({"AttendanceID":0,"SessionID":4, "checkin":this.FinalEmployeeList[i].LoginData[0].In, "checkout":this.FinalEmployeeList[i].LoginData[0].Out})
              tmp.push({"AttendanceID":0,"SessionID":5, "checkin":this.FinalEmployeeList[i].LoginData[1].In, "checkout":this.FinalEmployeeList[i].LoginData[1].Out})
            } 
          } 
          else{
            if(this.FinalEmployeeList[i].LoginData[0].AttendanceID != 0 && this.FinalEmployeeList[i].LoginData[1].AttendanceID != 0){
              tmp.push({"AttendanceID":this.FinalEmployeeList[i].LoginData[0].AttendanceID,"SessionID":4, "checkin":this.FinalEmployeeList[i].LoginData[0].In, "checkout":this.FinalEmployeeList[i].LoginData[0].Out})
              tmp.push({"AttendanceID":this.FinalEmployeeList[i].LoginData[1].AttendanceID,"SessionID":5, "checkin":"", "checkout":""})
            }
           else if(this.FinalEmployeeList[i].LoginData[0].AttendanceID != 0 && this.FinalEmployeeList[i].LoginData[1].AttendanceID == 0){
            tmp.push({"AttendanceID":this.FinalEmployeeList[i].LoginData[0].AttendanceID,"SessionID":4, "checkin":this.FinalEmployeeList[i].LoginData[0].In, "checkout":this.FinalEmployeeList[i].LoginData[0].Out})
          }
           else if(this.FinalEmployeeList[i].LoginData[0].AttendanceID == 0 && this.FinalEmployeeList[i].LoginData[1].AttendanceID != 0){
            tmp.push({"AttendanceID":this.FinalEmployeeList[i].LoginData[1].AttendanceID,"SessionID":4, "checkin":this.FinalEmployeeList[i].LoginData[0].In, "checkout":this.FinalEmployeeList[i].LoginData[0].Out})
          }
            else {
              tmp.push({"AttendanceID":0,"SessionID":4, "checkin":this.FinalEmployeeList[i].LoginData[0].In, "checkout":this.FinalEmployeeList[i].LoginData[0].Out})
            }
          } 
      }
      else if((this.FinalEmployeeList[i].LoginData[1].In!="" && this.FinalEmployeeList[i].LoginData[1].Out!="") ||(this.FinalEmployeeList[i].LoginData[1].In!="" && this.FinalEmployeeList[i].LoginData[1].Out=="")){
          if(this.FinalEmployeeList[i].LoginData[0].AttendanceID != 0 && this.FinalEmployeeList[i].LoginData[1].AttendanceID != 0){
            tmp.push({"AttendanceID":this.FinalEmployeeList[i].LoginData[0].AttendanceID,"SessionID":4, "checkin":"", "checkout":""})
            tmp.push({"AttendanceID":this.FinalEmployeeList[i].LoginData[1].AttendanceID,"SessionID":5, "checkin":this.FinalEmployeeList[i].LoginData[1].In, "checkout":this.FinalEmployeeList[i].LoginData[1].Out})
          }
         else if(this.FinalEmployeeList[i].LoginData[0].AttendanceID != 0 && this.FinalEmployeeList[i].LoginData[1].AttendanceID == 0){
          tmp.push({"AttendanceID":this.FinalEmployeeList[i].LoginData[0].AttendanceID,"SessionID":5, "checkin":this.FinalEmployeeList[i].LoginData[1].In, "checkout":this.FinalEmployeeList[i].LoginData[1].Out})
        }
         else if(this.FinalEmployeeList[i].LoginData[0].AttendanceID == 0 && this.FinalEmployeeList[i].LoginData[1].AttendanceID != 0){
          tmp.push({"AttendanceID":this.FinalEmployeeList[i].LoginData[1].AttendanceID,"SessionID":5, "checkin":this.FinalEmployeeList[i].LoginData[1].In, "checkout":this.FinalEmployeeList[i].LoginData[1].Out})
        }
          else {
            tmp.push({"AttendanceID":0,"SessionID":5, "checkin":this.FinalEmployeeList[i].LoginData[1].In, "checkout":this.FinalEmployeeList[i].LoginData[1].Out})
          }
      }
      else{
        if((this.FinalEmployeeList[i].LoginData[0].In =="" && this.FinalEmployeeList[i].LoginData[0].Out =="") ||(this.FinalEmployeeList[i].LoginData[1].In =="" && this.FinalEmployeeList[i].LoginData[1].Out =="")){
          
         if(this.FinalEmployeeList[i].LoginData[0].AttendanceID != 0 && this.FinalEmployeeList[i].LoginData[1].AttendanceID != 0){
             tmp.push({"AttendanceID":this.FinalEmployeeList[i].LoginData[0].AttendanceID,"SessionID":0, "checkin":"", "checkout":""})
             tmp.push({"AttendanceID":this.FinalEmployeeList[i].LoginData[1].AttendanceID,"SessionID":0, "checkin":"", "checkout":""})
           }
           else if(this.FinalEmployeeList[i].LoginData[0].AttendanceID != 0 && this.FinalEmployeeList[i].LoginData[1].AttendanceID == 0){

            tmp.push({"AttendanceID":this.FinalEmployeeList[i].LoginData[0].AttendanceID,"SessionID":0, "checkin":"", "checkout":""})
           }
           else if(this.FinalEmployeeList[i].LoginData[0].AttendanceID == 0 && this.FinalEmployeeList[i].LoginData[1].AttendanceID != 0){

             tmp.push({"AttendanceID":this.FinalEmployeeList[i].LoginData[1].AttendanceID,"SessionID":0, "checkin":"", "checkout":""})
           }
          else if(this.FinalEmployeeList[i].LoginData[0].In == "" && this.FinalEmployeeList[i].LoginData[0].Out != ""){
          //  this.globalToastService.warning("You Cant Add First Half Checkout Without Adding First Half CheckIn For " + this.FinalEmployeeList[i].Name)
          this.ShowToast("You Cant Add First Half Checkout Without Adding First Half CheckIn For " + this.FinalEmployeeList[i].Name,"warning")
           return
          }
           else if((this.FinalEmployeeList[i].LoginData[1].In == "" && this.FinalEmployeeList[i].LoginData[1].Out != "")|| (this.FinalEmployeeList[i].LoginData[0].In == "" && this.FinalEmployeeList[i].LoginData[1].Out != "")){
            // this.globalToastService.warning("You Cant Add Second Half Checkout Without Adding Second Half CheckIn Or First Half CheckIn For " + this.FinalEmployeeList[i].Name)
            this.ShowToast("You Cant Add Second Half Checkout Without Adding Second Half CheckIn Or First Half CheckIn For " + this.FinalEmployeeList[i].Name,"warning")
            return
          }
        else {
          tmp.push({"AttendanceID":0,"SessionID":0, "checkin":"", "checkout":""})
        }
        }
      }
        ReturnList.push({"LoginuserID":this.FinalEmployeeList[i].Admin,"EmployeeID":this.FinalEmployeeList[i].Employee,"SelectedDate":this.FinalEmployeeList[i].Date,"attendancelist":tmp})
    }
  }
  }
      console.log(ReturnList,"save attendance");
      this.finalSave(ReturnList,"datewise")
  }

  finalSave(ReturnList:any,type:any){
    if(ReturnList.length === 0 || ReturnList == null){
      // this.globalToastService.warning("Please Make Any Changes To Proceed")
      this.ShowToast("Please Make Any Changes To Proceed","warning")
    }else{
    this.spinnerService.show();
      this._commonservice.ApiUsingPost("Attendancerectification/SaveRectifiedAttendance",ReturnList).subscribe((res:any)=>{
        if(res.Status == true){
          this.spinnerService.hide();
          this.dialog.open(SavedailogComponent, {
            data: { message:res.Message }
          })
          if(type==='empwise'){
            this.GetAttendanceDetails()
          }
          if(type==='datewise'){
            this.GetDateWiseDetails()
          }
        }else {
          // this.globalToastService.warning("Sorry"+ res.Message)
          this.ShowToast("Sorry"+ res.Message,"warning")
          if(type==='empwise'){
            this.GetAttendanceDetails()
          }
          if(type==='datewise'){
            this.GetDateWiseDetails()
          }
          this.spinnerService.hide();
        }
      },(error)=>{
        // this.globalToastService.error(error.error.Message)
        this.ShowToast(error.error.Message,"error")
      })
    }
  }
  getLogsData(row:any){
    this._commonservice.ApiUsingGetWithOneParam("Attendancerectification/GetRectifiedAttLog?date="+row.Date+"&EmployeeID="+row.Employee+"").subscribe((res:any)=>{
      if(res.Status == true){
        // this.LogsData = res.List
        this.dialog.open(ShowlogsComponent, {
          data: { fulldata : res.List ,name:row.Name }
        })
      }else if(res.Status == false){
        // this.globalToastService.error(res.Message)
        this.ShowToast(res.Message,"error")
      }else {
        // this.globalToastService.error(res.Message)
        this.ShowToast(res.Message,"error")
      }
    },(error)=>{
      // this.globalToastService.error(error.error.Message)
      this.ShowToast(error.error.Message,"error")
    })
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