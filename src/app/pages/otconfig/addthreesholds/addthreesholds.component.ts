import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ShowalertComponent } from '../../create-employee/showalert/showalert.component';

@Component({
  selector: 'app-addthreesholds',
  templateUrl: './addthreesholds.component.html',
  styleUrls: ['./addthreesholds.component.css']
})
export class AddthreesholdsComponent {
  isMonths:boolean = false
  BranchApiURL:any
  EmployeelistApiURL: any
  EmployeeList: any[] = []
  OrgID:any
  AdminID:any
  BranchList:any[]=[]
  BranchID :any;
  selectedBranch:any
  IsHoliday:boolean = false
  IsWeekOff:boolean = false
  OtName:any
  MinimumWorkingHours:any
  IsHoursBased:boolean = false
  DailyOtHours:any
  Time:any
  WeeklyOtHours:any
  MonthlyOtHours:any
  GraceTime:any;DepartmentName:any;
  Amount:any;BranchName:any;OtType:any;
  AmountPercent:any
  IsPercent:boolean = false
  isEdit:boolean;OTName:any;UserID:any;
  TypeList:any[]=['DailyOt','Holiday','Week Off']
  selectedType:any
  DepartmentList: any[] = []
  DepartmentID : any;
  OTID : any;
  selectedDepartment: any
  departmentSettings: IDropdownSettings = {}
  selectedEmployee: any = []
  branchSettings:IDropdownSettings = {}
  typeSettings:IDropdownSettings = {}
  employeeSettings: IDropdownSettings = {}
  errorMessages :any = {}
  ApiURL:any
  selectedEmployeeOriginalList : any[] = []
  SalaryTypeList:any[]=['Basic','Gross']
  selectedSalaryType:any=[]
  SalaryTypeSettings:IDropdownSettings = {}
  checkAllFeilds:boolean = false

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private globalToastService: ToastrService, private _commonservice: HttpCommonService,private dialog:MatDialog, private toastr: ToastrService,
    private spinnerService: NgxSpinnerService, public dialogRef: MatDialogRef<AddthreesholdsComponent>
  ) {
    this.isEdit = this.data.isEdit || false;
    this.IsHoliday = this.data.row?.IsHoliday || false;
    this.IsWeekOff = this.data.row?.IsWeekOff || false;
    this.OtName = this.data.row?.OTName || '';
    this.MinimumWorkingHours = this.data.row?.MinWorkingHours || 0;
    this.IsHoursBased = this.data.row?.IsHoursBased || false;
    this.DailyOtHours = this.data.row?.DailyOTHours || 0;
    this.WeeklyOtHours = this.data.row?.WeeklyOTHours || 0;
    this.MonthlyOtHours=  this.data.row?.MonthlyOTHours || 0;
    this.GraceTime = this.data.row?.grace_time || 0;
    this.Amount = this.data.row?.Amount || 0;
    this.AmountPercent = this.data.row?.AmountPercent || 0;
    this.IsPercent = this.data.row?.IsPercent || false;
    this.BranchName=this.data.row?.BranchName||'';
    this.DepartmentName=this.data.row?.DepartmentName||'';
    this.OtType=this.data.row?.OtType||'';
    this.Time = this.data.row?.Times || 1;
    // this.selectedSalaryType = this.data.row?.isgross === 'false'
    if(this.BranchName==null || this.BranchName==''|| this.BranchName==undefined)
    {
      this.BranchName="All Branches";
    }
    if(this.DepartmentName==null || this.DepartmentName==''|| this.DepartmentName==undefined)
      {
        this.DepartmentName="All Departments";
      }
      if(this.data.row?.isgross == false){
        this.selectedSalaryType = ["Basic"]
      }else if(this.data.row?.isgross == true){
        this.selectedSalaryType = ["Gross"]
      }
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
    this.departmentSettings = {
      singleSelection:true,
      idField: 'id',
      textField: 'text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
      enableCheckAll:false
    };
    this.employeeSettings = {
      singleSelection: false,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit:1,
      allowSearchFilter: true,
      enableCheckAll:true
    };
    this.SalaryTypeSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    }

    if(this.isEdit){
      this.BranchID = this.data.row.BranchID
      this.DepartmentID = this.data.row.DepartmentID
      this.OTID = this.data.row.OTID
    }
    
  }
  CurrentMonth:any;
  CurrentYear:any;

  ngOnInit() {
    this.OrgID = localStorage.getItem("OrgID");
    this.AdminID = localStorage.getItem("AdminID");
    this.UserID=localStorage.getItem("UserID");
    this.BranchApiURL = "Admin/GetBranchList?OrgID=" + this.OrgID + "&AdminId=" + this.UserID;

    this.GetBranches()
    if(this.isEdit){
      this.GetEmployeeList()
      this.GetAllocatedEmployeeList()
    }

  }
  close(){
    this.dialogRef.close();
  }
  onBranchSelect(item: any) {
    this.GetDepartments()
    // this.GetEmployeeList()
  }
  onBranchDeSelect(item: any) {
    this.GetDepartments();
    this.selectedDepartment =[]
    // this.GetEmployeeList()
  }
  onDepartmentSelect(item:any){
    console.log(item);
    this.selectedEmployee = []
    this.GetEmployeeList()
  }
  onDepartmentDeSelect(item:any){
    this.selectedEmployee = []
    if(this.selectedDepartment.length == 0){
      this.EmployeeList = []
    }else{
      this.selectedEmployee = []
      this.GetEmployeeList() 
    }
    console.log(item);
    
  }
  onTypeSelect(item:any){
  if(item === 'Week Off'){
    this.IsWeekOff = true
    this.IsHoliday = false
  }
  else if(item === 'Holiday'){
    this.IsHoliday = true
    this.IsWeekOff = false
  } else{
    this.IsHoliday = false;
    this.IsWeekOff = false;
  }
  
  }
  onTypeDeSelect(item:any){
    if(item === 'Week Off'){
      this.IsWeekOff = false
    }
    if(item === 'Holiday'){
      this.IsHoliday = false
    }
    else{
      this.IsHoliday = false;
      this.IsWeekOff = false;
    }
  }
  onSalaryTypeSelect(item:any){
    
  }
  onSalaryTypeDeSelect(item:any){

  }

  GetBranches() {
    this._commonservice.ApiUsingGetWithOneParam(this.BranchApiURL).subscribe((data) => {
      this.BranchList = data.List;
    }, (error) => {
      // this.globalToastService.error(error); 
      this.ShowAlert(error,"error")
      console.log(error);
    });
 
  }
  GetDepartments() {
    this.selectedEmployee=[];
    this.selectedDepartment=[];
    var loggedinuserid=localStorage.getItem("UserID");
    const json = {
      "OrgID":this.OrgID,
"AdminID":loggedinuserid,
      "Branches": this.selectedBranch.map((br:any)=>{
        return {
          "id": br.Value
        }
      })
      }
    this._commonservice.ApiUsingPost("Portal/GetEmployeeDepartments", json).subscribe((data) => {
      this.DepartmentList = data.DepartmentList;
    }, (error) => {
      // this.globalToastService.error(error); 
      this.ShowAlert(error,"error")
      console.log(error);
    });
  }
  

  //This is for select amount or ot rate function
  clearAmount(type: 'percent' | 'rs') {
    if (type === 'percent' ) {
      this.Amount = 0;
    }
    if (type === 'rs' ) {
      this.Time = 0;
    }
  }
  //end here--------------------------------------
  validateOTRate(rate: any) {
    if (rate !== null && rate !== '' && rate !== undefined) {
      this.Amount = null;  // Clear the Amount field when Time is entered
    }
  }
  
  validateOTAmount(amount: any) {
    if (amount !== null && amount !== '' && amount !== undefined) {
      this.Time = null;  // Clear the Time field when Amount is entered
    }
  }

  validateFields() : boolean{
    
    let validation = true
    this.errorMessages = {}

    if(this.isEdit==false && ( this.selectedBranch==null || this.selectedBranch==undefined || this.selectedBranch.length<1))
    {
      validation = false
      this.errorMessages['branch'] = 'Please Select a Branch'
    }
   else if(this.isEdit==false && ( this.selectedDepartment==null || this.selectedDepartment==undefined || this.selectedDepartment.length<1))
    {
      validation = false
      this.errorMessages['department'] = 'Please Select a department'
    }
   else if(this.selectedEmployee==null || this.selectedEmployee==undefined || this.selectedEmployee.length<1)
      {
        // this.toastr.warning("Please Enter OTName");
        validation = false
        this.errorMessages['employee'] = 'Please select atleast one employee'
      }
      else if(this.isEdit==false && ( this.selectedType==null || this.selectedType==undefined || this.selectedType==' ' || this.selectedType==""))
        {
          // this.toastr.warning("Please Select OT Type");
          validation = false
          this.errorMessages['ottype'] = 'Please Select OT Type'
        }
   else if(this.OtName==null || this.OtName==undefined|| this.OtName==' '||this.OtName=="")
    {
      // this.toastr.warning("Please Enter OTName");
      validation = false
      this.errorMessages['otname'] = 'Please Enter OT Name'
    }
   else if(this.MinimumWorkingHours==null || this.MinimumWorkingHours==0 || this.MinimumWorkingHours==undefined|| this.MinimumWorkingHours==' '||this.MinimumWorkingHours=="")
      {
        // this.toastr.warning("Please Enter OTName");
        validation = false
        this.errorMessages['minimumworkinghours'] = 'Please Enter Minimum Working Hours'
      } 
      else if(this.DailyOtHours==null || this.DailyOtHours==0|| this.DailyOtHours==undefined|| this.DailyOtHours==' '||this.DailyOtHours=="")
        {
          // this.toastr.warning("Please Enter OTName");
          validation = false
          this.errorMessages['dailyothours'] = 'Please Enter Maximum OT Hours'
        }
    // console.log('=========================================');
    // console.log({Amount:this.Amount,Time:this.Time});
    // console.log((this.Amount==null || this.Amount==undefined|| this.Amount==' ' || this.Amount==0 || this.Amount=="" ) && (this.Time==null || this.Time==undefined || this.Time==' '|| this.Time=="" || this.Time==0))
    // console.log((this.Time==null || this.Time==undefined || this.Time==' '|| this.Time=="" || this.Time==0))
    // console.log((this.Amount==null || this.Amount==undefined|| this.Amount==' ' || this.Amount==0 || this.Amount=="" ))
    // console.log('=========================================');
    
   else if(
      (this.Amount==null || this.Amount==undefined|| this.Amount==' ' || this.Amount==0 || this.Amount=="" ) && 
      (this.Time==null || this.Time==undefined || this.Time==' '|| this.Time=="" || this.Time==0)
    )
    {
      // this.toastr.warning("Please Enter Either the Amount/ Hours Ratio");
      validation = false
      this.errorMessages['amount'] = 'Please Enter Either the Amount/ Hours Ratio'
    }

    return validation
  }

  employeeDeSelectAll(){
    this.selectedEmployee = JSON.parse(JSON.stringify(this.selectedEmployeeOriginalList))
    // this.validateFields()
  }
  
  employeeSelectAll(){
    this.selectedEmployee = JSON.parse(JSON.stringify(this.EmployeeList))
    // this.validateFields()

  }

  CreateOT(){
    let validation = this.validateFields()
    
    if(validation){
      // this.spinnerService.show();
      let data:any = {
        "Branches": [],
       "Departments":[],
        "OTName":this.OtName,
        "DailyOTHours": this.DailyOtHours,
        "WeeklyOTHours": 0,
        "MonthlyOTHours": 0,
        "AdminID": this.AdminID,
        "IsHoliday": this.IsHoliday,
        "IsWeekOff": this.IsWeekOff,
        "grace_time": this.GraceTime,
        "Amount": this.Amount || this.AmountPercent,
        "IsPercent": !!this.AmountPercent,
        "MinWorkingHours": this.MinimumWorkingHours,
        "IsHoursBased": this.IsHoursBased,
        "Times":this.Time,
        "Employees":[],
        "isgross": this.selectedSalaryType ? this.selectedSalaryType == 'Gross' ? true : false : ''
      }

      if(this.selectedDepartment)
      {
        data.Departments=this.selectedDepartment.map((department: any) => {
          return {
            "id": department.id
          }
        });
      }
      if(this.selectedBranch)
      {
        data.Branches=this.selectedBranch.map((branch: any) => {
          return {
            "id": branch.Value
          }
        });
      }
      if(this.selectedEmployee)
      {
        data.Employees=this.selectedEmployee.map((e:any) =>{ return {"EmployeeID":e.Value}})
      }
      console.log(data,"Add OT");
      
      this._commonservice.ApiUsingPost("Portal/CreateOT", data).subscribe(
        (data: any) => {
          if(data.Status==true){
            // this.allocateotforemployee(data.RecordID)
          this.spinnerService.hide();
          // this.globalToastService.success(data.Message);
          this.ShowAlert(data.Message,"success")
           this.dialogRef.close({...data})
          }
          else
          {
            // this.globalToastService.warning(data.Message);
            this.ShowAlert(data.Message,"warning")
              this.spinnerService.hide();
          }
          
        }, (error: any) => {
         localStorage.clear();
    
        //  this.globalToastService.error(error.message);
        this.ShowAlert(error.message,"error")
         this.spinnerService.hide();
        }
      )
    }
  }


UpdateShift(){
  // this.spinnerService.show();
  let data:any = {
    "Branches": [{"id":this.data.row?.BranchID}],
    "OTID":this.data.row?.OTID,
    "OTName":this.OtName,
    "DailyOTHours": this.DailyOtHours,
    "WeeklyOTHours": this.WeeklyOtHours,
    "MonthlyOTHours": this.MonthlyOtHours,
    "AdminID": this.AdminID,
    "IsHoliday": this.IsHoliday,
    "IsWeekOff": this.IsWeekOff,
    "grace_time": this.GraceTime,
    "Amount": this.Amount,
    "IsPercent": this.IsPercent,
    "MinWorkingHours": this.MinimumWorkingHours,
    "IsHoursBased": this.IsHoursBased,
    "Times":this.Time,
    "Employees": [],
     "isgross": this.selectedSalaryType ? this.selectedSalaryType == 'Gross' ? true : false : ''
  }
  if(this.selectedEmployee)
    {
      data.Employees=this.selectedEmployee.map((e:any) =>{ return {"EmployeeID":e.Value}})
    }
    console.log(data,"update ot");
    
  this._commonservice.ApiUsingPost("Portal/UpdateOT", data).subscribe(
    (data: any) => {
      if(data.Status==true){
        // this.allocateotforemployee(this.OTID)
        this.spinnerService.hide();
      // this.globalToastService.success(data.Message);
      this.ShowAlert(data.Message,"success")
       this.dialogRef.close({...data})
      //  window.location.reload();
      }
      else
      {
        // this.globalToastService.warning(data.Message);
        this.ShowAlert(data.Message,"warning")
          this.spinnerService.hide();
      }
      
    }, (error: any) => {
      localStorage.clear();

      // this.globalToastService.error(error.message);
      this.ShowAlert(data.Message,"error")
      this.spinnerService.hide();
     }
)
}


GetEmployeeList() {
  // const json: any = {
  //   "BranchID": this.selectedBranch? this.selectedBranch.map((br:any)=>br.Value) : [this.BranchID]
  // }
  // if (this.selectedDepartment && this.selectedDepartment.length > 0) {
  //   json["DepartmentID"] = this.selectedDepartment.map((br: any) => { return br.id })
  // }else if(this.DepartmentID){
  //   json["DepartmentID"] = [this.DepartmentID]
  // }
  // // console.log(json, "dshdshjdhsjdjsjd"); 
  this.selectedEmployee=[];
  const now = new Date();
  this.CurrentMonth =  now.getMonth() + 1; 
  this.CurrentYear = now.getFullYear();
  if(this.isEdit){
    this.ApiURL="Admin/GetEmployees?AdminID="+this.AdminID+"&BranchID="+this.BranchID+"&DeptId="+this.DepartmentID+"&Year="+this.CurrentYear+"&Month="+this.CurrentMonth+"&Key=en";
  }
  if(!this.isEdit){
    let BranchID = this.selectedBranch?.map((y:any) => y.Value)[0] || 0
    let deptID = this.selectedDepartment?.map((y:any) => y.id)[0] || 0
    this.ApiURL="Admin/GetEmployees?AdminID="+this.AdminID+"&BranchID="+BranchID+"&DeptId="+deptID+"&Year="+this.CurrentYear+"&Month="+this.CurrentMonth+"&Key=en";
  }

  this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => {
    this.EmployeeList = data.data
    if(this.isEdit){
    this.EmployeeList = this.EmployeeList.map((emp:any) => ({
      ...emp,
      isDisabled: this.selectedEmployee.filter((selected:any) => selected.Value === emp.Value).length>0 ? true : false,
    }));
    this.employeeSettings['disabledField']= 'isDisabled'
  }
  }
    , (error) => {
      console.log(error); this.spinnerService.hide();
    });
}

GetAllocatedEmployeeList() {
  const json: any = {
    "BranchID": this.selectedBranch? this.selectedBranch.map((br:any)=>br.Value) : [this.BranchID]
  }
  if (this.selectedDepartment && this.selectedDepartment.length > 0) {
    json["DepartmentID"] = this.selectedDepartment.map((br: any) => { return br.id })
  }else if(this.DepartmentName){
    json["DepartmentID"] = [this.DepartmentID]
  }
  this._commonservice.ApiUsingGetWithOneParam("Portal/getAllocatedOT?OTID="+this.OTID+"&UserID="+this.AdminID+"&isactive=true").subscribe((data) => {
      this.addSelectedEmployee(data.List)
      this.selectedEmployeeOriginalList = JSON.parse(JSON.stringify(data.List))
    }
    , (error) => {
      console.log(error); this.spinnerService.hide();
    });
}

addSelectedEmployee(list:any){
  this.selectedEmployee = []
  for (let i = 0; i < list.length; i++) {
    const d = list[i];
    this.selectedEmployee.push({Value:d.employeeid,Text:d.employeename})
  }
  console.log(this.selectedEmployee);
}

onEmployeeSelect(item: any) {
  
}

allocateotforemployee(OTID:any) {
  const json ={ 
    "OTID":OTID,
    "EmployeeID": this.selectedEmployee.map((e:any) =>{ return e.Value}),
     "IsFriday": false, 
     "IsMonday": false, 
     "IsSaturday": false, 
     "IsSunday": false, 
     "IsThursday": false, 
     "IsTuesday": false, 
     "IsWednesday": false,
      "IsWeek1": false, 
      "IsWeek3": false, 
      "IsWeek2": false, 
      "IsWeek4": false, 
      "IsWeek5": false, 
      "AdminID": this.AdminID
    }
    console.log(json,"json for allocate");
    
    this._commonservice.ApiUsingPost("Portal/AllocateOT",json).subscribe(data => {
      // this.toastr.success(data.Message);
      this.ShowAlert(data.Message,"success")
      this.spinnerService.hide();
      this.dialogRef.close({...json});
    })
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

    CloseTab()
{
  this.dialogRef.close({})
}
}
