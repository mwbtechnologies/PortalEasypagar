import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ShowalertComponent } from '../../create-employee/showalert/showalert.component';
export class DynamicArrayPattern
{
WeekName:any;
WeekOffDays:any=Array<TextValue>;
WorkingDays:any=Array<TextValue>;
ShiftID:any;
ID:any;
}

export class FormInput{
  StartDate:any;
}
export class TextValue{
  Text:any;
  Value:any;
  id:any;
}

@Component({
  selector: 'app-addedit',
  templateUrl: './addedit.component.html',
  styleUrls: ['./addedit.component.css']
})
export class AddeditComponent {
  OrgID: any;
  formInput: FormInput|any;
  AdminID: any;
  BranchApiURL: any
  shiftID:any;
  WeekOffDays:Array<TextValue>=[];
WorkingDays:Array<TextValue>=[];
  DepartmentApiURL: any
  BranchList: any[] = []
  ShiftList: any[] = []
  EmployeeList: any[] = []
  DepartmentList: any[] = []
  branches: any[] = []
  startTime: any
  endTime: any
  selectedBranch: any[]=[]
  selectedDepartment: any[]=[]
  selectedEmployee: any[]=[]
  selectedDays: number[] = []
  selectedShift:any;monthid:any;
  branchSettings: IDropdownSettings = {};
  departmentSettings: IDropdownSettings = {};
  shiftSettings: IDropdownSettings = {};
  employeeSettings: IDropdownSettings = {};
  NewApiURL:any
  BranchID:any
  isMonths:boolean = false
  IsJan:boolean = true
  IsFeb:boolean = true
  IsMarch:boolean = true
  IsApril:boolean = true
  IsMay:boolean = true
  IsJune:boolean = true
  IsJuly:boolean = true
  IsAug:boolean = true
  IsSep:boolean = true
  IsOct:boolean = true
  IsNov:boolean = true
  IsDec:boolean = true
  branch:any
  department:any
  Shift:any
  EmployeeName:any
  ShiftID:any;institutionsList:any;
  EmployeelistApiURL:any;UserID:any;
  IsWholeYear:any; tempemparray:any=[];
  AllotID:any;employeeid:any;CurrentDate:any;

  DynamicArray: any[] = [
    {
      ShiftID :0,
      ID:1,
      WeekName: 'Week1',
      WeekOffDays: [
        { Text: 'S', Value: true },
        { Text: 'M', Value: false },
        { Text: 'T', Value: false },
        { Text: 'W', Value: false },
        { Text: 'T', Value: false },
        { Text: 'F', Value: false },
        { Text: 'S', Value: false },
      ],
      WorkingDays: [
        { Text: 'S', Value: false },
        { Text: 'M', Value: true },
        { Text: 'T', Value: true },
        { Text: 'W', Value: true },
        { Text: 'T', Value: true },
        { Text: 'F', Value: true },
        { Text: 'S', Value: true },
      ]
    },
    {
      ShiftID :0,
      ID:2,
      WeekName: 'Week2',
      WeekOffDays: [
        { Text: 'S', Value: true },
        { Text: 'M', Value: false },
        { Text: 'T', Value: false },
        { Text: 'W', Value: false },
        { Text: 'T', Value: false },
        { Text: 'F', Value: false },
        { Text: 'S', Value: false },
      ],
      WorkingDays: [
        { Text: 'S', Value: false },
        { Text: 'M', Value: true },
        { Text: 'T', Value: true },
        { Text: 'W', Value: true },
        { Text: 'T', Value: true },
        { Text: 'F', Value: true },
        { Text: 'S', Value: true },
      ]
    },
    {
      ShiftID :0,
      ID:2,
      WeekName: 'Week3',
      WeekOffDays: [
        { Text: 'S', Value: true },
        { Text: 'M', Value: false },
        { Text: 'T', Value: false },
        { Text: 'W', Value: false },
        { Text: 'T', Value: false },
        { Text: 'F', Value: false },
        { Text: 'S', Value: false },
      ],
      WorkingDays: [
        { Text: 'S', Value: false },
        { Text: 'M', Value: true },
        { Text: 'T', Value: true },
        { Text: 'W', Value: true },
        { Text: 'T', Value: true },
        { Text: 'F', Value: true },
        { Text: 'S', Value: true },
      ]
    },
    {
      ShiftID :0,
      ID:2,
      WeekName: 'Week4',
      WeekOffDays: [
        { Text: 'S', Value: true },
        { Text: 'M', Value: false },
        { Text: 'T', Value: false },
        { Text: 'W', Value: false },
        { Text: 'T', Value: false },
        { Text: 'F', Value: false },
        { Text: 'S', Value: false },
      ],
      WorkingDays: [
        { Text: 'S', Value: false },
        { Text: 'M', Value: true },
        { Text: 'T', Value: true },
        { Text: 'W', Value: true },
        { Text: 'T', Value: true },
        { Text: 'F', Value: true },
        { Text: 'S', Value: true },
      ]
    },
    {
      ShiftID :0,
      ID:2,
      WeekName: 'Week5',
      WeekOffDays: [
        { Text: 'S', Value: true },
        { Text: 'M', Value: false },
        { Text: 'T', Value: false },
        { Text: 'W', Value: false },
        { Text: 'T', Value: false },
        { Text: 'F', Value: false },
        { Text: 'S', Value: false },
      ],
      WorkingDays: [
        { Text: 'S', Value: false },
        { Text: 'M', Value: true },
        { Text: 'T', Value: true },
        { Text: 'W', Value: true },
        { Text: 'T', Value: true },
        { Text: 'F', Value: true },
        { Text: 'S', Value: true },
      ]
    },
    // add more weeks as necessary
  ];
  selectedOrganization:any[]=[]
  OrgList:any[]=[]
  orgSettings:IDropdownSettings = {}



  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private globalToastService: ToastrService, private _commonservice: HttpCommonService, private toastr: ToastrService,
    private spinnerService: NgxSpinnerService, public dialogRef: MatDialogRef<AddeditComponent>,private dialog:MatDialog
  ) {

    this.branchSettings = {
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
    this.shiftSettings = {
      singleSelection: true,
      idField: 'ID',
      textField: 'Name',
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
    this.employeeSettings = {
      singleSelection: false,
      idField: 'ID',
      textField: 'Name',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
  }
  ngOnInit() {
    this.formInput={
      StartDate:''
    }
    this.UserID=localStorage.getItem("UserID");
    this.OrgID = localStorage.getItem("OrgID");
    this.AdminID = localStorage.getItem("AdminID");
    this.GetOrganization()
    let suborgid = this.selectedOrganization.map(res => res.Value)[0] || 0
    this.BranchApiURL = "Admin/GetBranchListupdated?OrgID="+this.OrgID+"&SubOrgID="+suborgid+"&AdminId="+this.AdminID
    this.DepartmentApiURL = "Portal/GetEmployeeDepartments"
    console.log(this.BranchApiURL, "url");
    const today = new Date();
    const year = today.getFullYear();
    const month =(today.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const day = today.getDate().toString().padStart(2, '0');
    this.formInput.StartDate = `${year}-${month}-${day}`;
   this.IsWholeYear=true;
    this.NewApiURL="Portal/GetShiftbyBranch";
    this.GetBranches()
    this.GetEmployeeList()
  }
  onEmpSelect(item:any){
    console.log(item,"item");
    this.tempemparray.push({id:item.ID, text:item.Name });
   }
   onEmpDeSelect(item:any){
    console.log(item,"item");
    this.tempemparray.splice(this.tempemparray.indexOf(item), 1);
   }

   close(){
    this.dialogRef.close();
  }
  GetEmployeeList(){
    this.selectedEmployee=[];
    const json:any = {
      AdminID:this.AdminID
        }
        if (this.selectedBranch) {
          json["BranchID"] =  this.selectedBranch.map((br:any)=>{return br.Value})
         }
        if (this.selectedDepartment) {
          json["DepartmentID"] =  this.selectedDepartment.map((br:any)=>{ return br.Value})
         }
    this._commonservice.ApiUsingPost("Portal/GetEmpListOnBranch",json).subscribe((data) => {
      this.EmployeeList = data.List
    }
      ,(error) => {
      console.log(error);this.spinnerService.hide();
   });
  }

  GetShiftList(){
    const json:any = {
      "BranchID":[],
      "DepartmentID":[],
      "AdminId":this.AdminID
      }
      if (this.selectedBranch) {
       json["BranchID"] =  this.selectedBranch.map((br:any)=>{return  br.Value}) || 0
      }
      if (this.selectedDepartment) {
       json["DepartmentID"] =  this.selectedDepartment.map((br:any)=>{return br.Value}) || []
      }
      
    this._commonservice.ApiUsingPost("Portal/GetShiftbyBranch",json).subscribe((data) => {
      this.ShiftList = data.List
    },
     (error) => {
      // this.globalToastService.error(error);
      this.ShowAlert(error,"error",)
      //  console.log(error);
      
    });
  }
  onselectedOrg(item:any){
  }
  onDeselectedOrg(item:any){
  }
  GetOrganization() {
    this._commonservice.ApiUsingGetWithOneParam("Admin/GetSuborgList?OrgID="+this.OrgID+"&AdminId="+this.AdminID).subscribe((data) => {
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

  GetBranches() {
    const selectedBranchId = this.data.row?.BranchId;
    this._commonservice.ApiUsingGetWithOneParam(this.BranchApiURL).subscribe((data) => {
      this.BranchList = data.List;
      if (selectedBranchId) {
        this.selectedBranch = this.BranchList.filter(branch => branch.Value === selectedBranchId);
      }
    }, (error) => {
      // this.globalToastService.error(error);
      this.ShowAlert(error,"error",)
       console.log(error);
    });
 
  }
  GetDepartments() {
    this.DepartmentList=[];
    this.selectedDepartment=[];
    var loggedinuserid=localStorage.getItem("UserID");
    const json = { 
      AdminID:loggedinuserid,
      "OrgID":this.OrgID,
      "Branches": this.selectedBranch.map((br:any)=>{
        return {
          "id": br.Value
        }
      })
      }
      const selectedDepartmentId = this.data.row?.DepartmentID;
      this._commonservice.ApiUsingPost(this.DepartmentApiURL,json).subscribe((data) => {
        this.DepartmentList = data.List;
        if (selectedDepartmentId) {
          this.selectedDepartment = this.DepartmentList.filter(dep => dep.Value === selectedDepartmentId);
          // this.GetShiftList()
        }
      }, (error) => {
        // this.globalToastService.error(error);
        this.ShowAlert(error,"error",)
         console.log(error);
      });
   
  }
  onBranchSelect(item: any) {
    // this.GetShiftList()
    this.ShiftList=[];
    this.DepartmentList=[];
    this.GetDepartments()
    this.GetEmployeeList()
   
  }
  onBranchDeSelect(item: any) {
    this.ShiftList=[];
    this.DepartmentList=[];
    this.GetDepartments()
    // this.GetShiftList()
    this.GetEmployeeList()
  }
  onDepartmentSelect(item: any) {
    this.ShiftList=[];
    if(this.selectedDepartment.length>0)
      {
        this.GetShiftList();
      } 
      else{
        this.ShiftList=[];
        for(let i=0;i<this.DynamicArray.length;i++)
        {
          this.DynamicArray[i].ShiftID=[];
        }
      }
    this.GetEmployeeList()
  }
  onDeselectDepartment(item: any) {
    this.ShiftList=[];
    this.selectedDepartment = this.selectedDepartment.filter((dept: any) => dept.id !== item.id);
    if(this.selectedDepartment.length>0)
    {
      this.GetShiftList();
    }   
    this.GetEmployeeList()
  }
  onShiftSelect(item: any) {
    this.shiftID = item.ID
  }
  onEmployeeSelect(item: any) {
  }

  addAllocation() {
    let shiftWarningMessage = '';let WorkDayMissingmessage="";
    var shiftselected= this.DynamicArray.filter((item:any) => item.ShiftID.length>0);
    if(this.selectedBranch.length==0){
      // this.globalToastService.warning("Please Select a Branch");
      this.ShowAlert("Please Select a Branch","warning",)
      return false;
    }
    else if(this.selectedDepartment.length==0){
      // this.globalToastService.warning("Please Select a Branch");
      this.ShowAlert("Please Select a Department","warning",)
      return false;
    }
    else if(this.selectedEmployee.length==0){
      // this.globalToastService.warning("Please Select a Employee");
      this.ShowAlert("Please Select a Employee","warning",)
      return false;
    }

  else if(this.formInput.StartDate==null||this.formInput.StartDate==undefined||this.formInput.StartDate=='')
    {
      // this.globalToastService.warning("Please Select Shift StartDate");
      this.ShowAlert("Please Select Shift StartDate","warning",)
      return false;
    }
   else if(shiftselected.length==0)
    {
      shiftWarningMessage="Please select shift for atleast one week";
    }
    for(let i=0;i<this.DynamicArray.length;i++)
    {
      var shiftid=this.DynamicArray[i].ShiftID.length>0? this.DynamicArray[i].ShiftID?.map((y:any) => y.ID)[0]:0;
      var shiftname=this.DynamicArray[i].ShiftID.length?this.DynamicArray[i].ShiftID?.map((y:any) => y.Name)[0]:0;
if(shiftid>0)
{
//  this.DynamicArray[i].ShiftID=shiftid;
  var checkday= this.DynamicArray[i].WorkingDays.filter((item:any) => item.Value ===true);
  if(checkday.length==0)
  {
    WorkDayMissingmessage="Please Select working days for "+this.DynamicArray[i].WeekName +" "+shiftname ; 
    break;
  }
}
    }
    if (shiftWarningMessage) {
      // this.globalToastService.warning(shiftWarningMessage);
      this.ShowAlert(shiftWarningMessage,"warning",)
      return false;
    }
 else if (WorkDayMissingmessage) {
    // this.globalToastService.warning(WorkDayMissingmessage);
    this.ShowAlert(WorkDayMissingmessage,"warning",)
    return false;
  }
 
  else{
    this.selectedEmployee =  this.tempemparray.map((br: any) => {
      return {
       "id": br.id, 
       "text":br.text
       };
      })
       const json = {
        "IsWholeYear": this.IsWholeYear,
        "Employees":  this.selectedEmployee,
        "AllotID":0,
        "EmployeeID":0,
        "AdminID": this.AdminID,
        "IsJanSelected": this.IsJan,
        "IsFebSelected": this.IsFeb,
        "IsMarchSelected": this.IsMarch,
        "IsAprilSelected": this.IsApril,
        "IsMaySelected": this.IsMay,
        "IsJulySelected": this.IsJuly,
        "IsJuneSelected": this.IsJune,
        "IsAugSelected": this.IsAug,
        "IsSepSelected": this.IsSep,
        "IsOctSelected": this.IsOct,
        "IsNovSelected": this.IsNov,
        "IsDecSelected": this.IsDec,
        "WeekConfig":this.DynamicArray,
        "DepartmentID":this.selectedDepartment.length>0?this.selectedDepartment.map((br:any)=>{ return br.Value}):0,
        "StartDate":this.formInput.StartDate,  
        "BranchID":this.selectedBranch.map((br:any)=>{return br.Value})
    }
    console.log(json,"check Values going");
    
    this._commonservice.ApiUsingPost("ShiftMaster/AllotShifts",json).subscribe(data => {
      // this.toastr.success(data.Message);
      this.ShowAlert(data.Message,"success",)
      this.spinnerService.hide();
      this.dialogRef.close({...json});
      window.location.reload();
      return true;
      
    }, (error: any) => {
      // this.toastr.error(error.message);
      this.spinnerService.hide();
      return false;
     
    })
  }
  return true;
 
  }

  OnCheckSelect(j:any,i:any,type:any)
  {
    if(type=="week")
    {
      if(this.DynamicArray[i].WeekOffDays[j].Value==true){this.DynamicArray[i].WorkingDays[j].Value=false;} 
      // else{this.DynamicArray[i].WorkingDays[j].Value=true;}
    }
    else
    {
      if(this.DynamicArray[i].WorkingDays[j].Value==true){this.DynamicArray[i].WeekOffDays[j].Value=false;}
      // else{this.DynamicArray[i].WeekOffDays[j].Value=true;}
    }
   
  }
  changeyearselection()
  {
    if(this.IsWholeYear==true)
    {     
        this.IsJan=true;
        this.IsFeb=true;
       this.IsMarch=true;
         this.IsApril=true;
      this.IsMay=true;
       this.IsJuly=true;
         this.IsJune=true;
         this.IsAug=true;
        this.IsSep=true;
     this.IsOct=true;
       this.IsNov=true;
         this.IsDec=true;
 
    }
    else
    {
      if(this.monthid>0)
        {
        this.IsJan=false;this.IsFeb=false;this.IsMarch=false;this.IsApril=false;this.IsMay=false;this.IsJune=false;
        this.IsSep=false;this.IsAug=false;this.IsJuly=false;this.IsOct=false;this.IsNov=false;this.IsDec=false;
        if(this.monthid==1){this.IsJan=true;}      if(this.monthid==2){this.IsFeb=true;}       if(this.monthid==3){this.IsMarch=true;}
         if(this.monthid==4){this.IsApril=true;}       if(this.monthid==5){this.IsMay=true;}       if(this.monthid==6){this.IsJune=true;}
         if(this.monthid==7){this.IsJuly=true;}       if(this.monthid==8){this.IsAug=true;}       if(this.monthid==9){this.IsSep=true;}
         if(this.monthid==10){this.IsOct=true;}       if(this.monthid==11){this.IsNov=true;}       if(this.monthid==12){this.IsDec=true;}
        
      }
      else{
        this.IsJan=false;
        this.IsFeb=false;
       this.IsMarch=false;
         this.IsApril=false;
      this.IsMay=false;
       this.IsJuly=false;
         this.IsJune=false;
         this.IsAug=false;
        this.IsSep=false;
     this.IsOct=false;
       this.IsNov=false;
         this.IsDec=false;
      }
    
    }
  }
  preventKeyboardInput(event: KeyboardEvent) {
    event.preventDefault();
  }

  CheckDate(date:any)
  {
   this.NewApiURL="Admin/CheckDate?UserDate="+date;
   this._commonservice.ApiUsingGetWithOneParam(this.NewApiURL).subscribe(data => {
    if(data.Status!=true){
      this.monthid=data.month;
      // this.IsWholeYear=false;
      // this.IsJan=false;this.IsFeb=false;this.IsMarch=false;this.IsApril=false;this.IsMay=false;this.IsJune=false;
      // this.IsSep=false;this.IsAug=false;this.IsJuly=false;this.IsOct=false;this.IsNov=false;this.IsDec=false;
      if(this.monthid==1){this.IsJan=true;}      if(this.monthid==2){this.IsFeb=true;}       if(this.monthid==3){this.IsMarch=true;}
       if(this.monthid==4){this.IsApril=true;}       if(this.monthid==5){this.IsMay=true;}       if(this.monthid==6){this.IsJune=true;}
       if(this.monthid==7){this.IsJuly=true;}       if(this.monthid==8){this.IsAug=true;}       if(this.monthid==9){this.IsSep=true;}
       if(this.monthid==10){this.IsOct=true;}       if(this.monthid==11){this.IsNov=true;}       if(this.monthid==12){this.IsDec=true;}
      this.spinnerService.hide();
         return true;
      }
      else{
        this.spinnerService.hide();
        // this.toastr.warning("Date should be greater than Current Date");
        this.ShowAlert("Date should be greater than Current Date","warning",)
        this.formInput.StartDate='';
         return false;
      }
   
   }, (error: any) => {
    this.spinnerService.hide();
    return false;
   }
   );
  }
  setwholeyearvalue()
  {
    if(this.IsJan==false ||this.IsFeb==false||this.IsMarch==false||this.IsApril==false||this.IsMay==false||this.IsJune==false||this.IsJuly==false||this.IsAug==false||this.IsSep==false||this.IsOct==false||this.IsNov==false ||this.IsDec==false)
    {
      this.IsWholeYear=false;
    }
    else{
      this.IsWholeYear=true;
    }
      // if (this.IsFeb == false ) {
      //   this.IsJan = false;
      // }
      // if (this.IsMarch == false) {
      //   this.IsJan = false
      //   this.IsFeb = false
      // }
      // if (this.IsApril == false) {
      //   this.IsJan = false;
      //   this.IsFeb = false
      //   this.IsMarch = false
      // }
      // if (this.IsMay == false) {
      //   this.IsJan = false;
      //   this.IsFeb = false
      //   this.IsMarch = false
      //   this.IsApril = false
      // }
      // if (this.IsJune == false) {
      //   this.IsJan = false;
      //   this.IsFeb = false
      //   this.IsMarch = false
      //   this.IsApril = false
      //   this.IsMay = false
      // }
      // if (this.IsJuly == false) {
      //   this.IsJan = false;
      //   this.IsFeb = false
      //   this.IsMarch = false
      //   this.IsApril = false
      //   this.IsMay = false
      //   this.IsJune = false
      // }
      // if (this.IsAug == false) {
      //   this.IsJan = false;
      //   this.IsFeb = false
      //   this.IsMarch = false
      //   this.IsApril = false
      //   this.IsMay = false
      //   this.IsJune = false
      //   this.IsJuly = false
      // }
      // if (this.IsSep == false) {
      //   this.IsJan = false;
      //   this.IsFeb = false
      //   this.IsMarch = false
      //   this.IsApril = false
      //   this.IsMay = false
      //   this.IsJune = false
      //   this.IsJuly = false
      //   this.IsAug = false
      // }
      // if (this.IsOct == false) {
      //   this.IsJan = false;
      //   this.IsJan = false;
      //   this.IsFeb = false
      //   this.IsMarch = false
      //   this.IsApril = false
      //   this.IsMay = false
      //   this.IsJune = false
      //   this.IsJuly = false
      //   this.IsAug = false
      //   this.IsSep = false
      // }
      // if (this.IsNov == false) {
      //   this.IsJan = false;
      //   this.IsJan = false;
      //   this.IsFeb = false
      //   this.IsMarch = false
      //   this.IsApril = false
      //   this.IsMay = false
      //   this.IsJune = false
      //   this.IsJuly = false
      //   this.IsAug = false
      //   this.IsSep = false
      //   this.IsOct = false
      // }
      // if (this.IsDec == false) {
        // this.IsJan = false;
        // this.IsJan = false;
        // this.IsFeb = false
        // this.IsMarch = false
        // this.IsApril = false
        // this.IsMay = false
        // this.IsJune = false
        // this.IsJuly = false
        // this.IsAug = false
        // this.IsSep = false
        // this.IsOct = false
        // this.IsNov = false

  //}
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
