import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
export class DynamicArrayPattern
{
WeekName:any;
WeekOffDays:any=Array<TextValue>;
WorkingDays:any=Array<TextValue>;
ShiftID:any;
ID:any;
}

export class TextValue{
  Text:any;
  Value:any;
  id:any;
}

@Component({
  selector: 'app-config-shift',
  templateUrl: './config-shift.component.html',
  styleUrls: ['./config-shift.component.css']
})
export class ConfigShiftComponent {
  OrgID: any;
  // formInput: FormInput|any;
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
  selectedBranch: any
  selectedDepartment: any
  selectedEmployee: any
  selectedDays: number[] = []
  selectedShift:any
  branchSettings: IDropdownSettings = {};
  departmentSettings: IDropdownSettings = {};
  shiftSettings: IDropdownSettings = {};
  employeeSettings: IDropdownSettings = {};
  isEdit: boolean
  NewApiURL:any
  BranchID:any
  isMonths:boolean = false
  IsJan:boolean = false
  IsFeb:boolean = false
  IsMarch:boolean = false
  IsApril:boolean = false
  IsMay:boolean = false
  IsJune:boolean = false
  IsJuly:boolean = false
  IsAug:boolean = false
  IsSep:boolean = false
  IsOct:boolean = false
  IsNov:boolean = false
  IsDec:boolean = false
  branch:any;UserID:any
  department:any
  Shift:any
  EmployeeName:any
  ShiftID:any;institutionsList:any;
  EmployeelistApiURL:any;
  IsWholeYear:any; tempemparray:any=[];
  AllotID:any;employeeid:any;

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




  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private globalToastService: ToastrService, private _commonservice: HttpCommonService, private toastr: ToastrService,
    private spinnerService: NgxSpinnerService, public dialogRef: MatDialogRef<ConfigShiftComponent>
  ) {
    this.isEdit = this.data.isEdit || false;
    this.branch = this.data.row?.Branch || '';
    this.department = this.data.row?.Department.Name || '';
    this.EmployeeName = this.data.row?.EmployeeName || '';
    this.IsWholeYear = this.data.row?.IsWholeYear || '';
    this.IsJan = this.data.row?.IsJanSelected || false
    this.IsFeb = this.data.row?.IsFebSelected || false
    this.IsMarch = this.data.row?.IsMarchSelected || false
    this.IsApril = this.data.row?.IsAprilSelected || false
    this.IsMay = this.data.row?.IsMaySelected || false
    this.IsJune = this.data.row?.IsJuneSelected || false
    this.IsJuly = this.data.row?.IsJulySelected || false
    this.IsAug = this.data.row?.IsAugSelected || false
    this.IsSep = this.data.row?.IsSepSelected || false
    this.IsOct = this.data.row?.IsOctSelected || false
    this.IsNov = this.data.row?.IsNovSelected || false
    this.IsDec = this.data.row?.IsDecSelected || false
    this.AllotID=this.data.row?.AllotID||false
    this.employeeid=this.data.row?.EmployeeID||0
    this.DynamicArray=this.data.row?.WeekConfig || []
    this.branchSettings = {
      singleSelection: true,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.departmentSettings = {
      singleSelection: false,
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
    this.employeeSettings = {
      singleSelection: false,
      idField: 'ID',
      textField: 'Name',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };

  }
  ngOnInit() {
    this.OrgID = localStorage.getItem("OrgID");
    this.AdminID = localStorage.getItem("AdminID");
    this.BranchApiURL = "Admin/GetBranchList?OrgID=" + this.OrgID + "&AdminId=" + this.UserID;
    console.log(this.BranchApiURL, "url");
   
    if(this.isEdit==false){ this.IsWholeYear=true;}
    this.NewApiURL="Portal/GetShiftbyBranch";
    this.GetShiftList()
  }
  close(){
    this.dialogRef.close();
  }
  GetShiftList(){
    const json:any = {
      "DepartmentID":[],
      "AdminId":this.AdminID
      }
      if (this.selectedBranch) {
       json["BranchID"] =  this.selectedBranch.map((br:any)=>{return  br.Value})
      }
    this._commonservice.ApiUsingPost(this.NewApiURL,json).subscribe((data) => {
      this.ShiftList = data.List
    },
     (error) => {
      this.globalToastService.error(error); console.log(error);
      
    });
  }


  onShiftSelect(item: any) {
    this.shiftID = item.ID
  }

  updateAllocation() {
    this.selectedEmployee =  this.tempemparray.map((br: any) => {
      return {
       "id": br.id, // Ensure this is the correct property
       "text":br.text

       };
      })
    const json = {
      "IsWholeYear": this.IsWholeYear,
      "Employees":  this.selectedEmployee,
      "AllotID":this.AllotID,
      "EmployeeID":this.employeeid,
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
      "WeekConfig":this.DynamicArray
  }
    console.log(json,"check Values going this is edit");
    
    this._commonservice.ApiUsingPost("ShiftMaster/UpdateAllotShift",json).subscribe(data => {
      this.toastr.success(data.Message);
      this.spinnerService.hide();
      this.dialogRef.close();
      window.location.reload();
    })
  }
  OnCheckSelect(j:any,i:any,type:any)
  {
    if(type=="week")
    {
      if(this.DynamicArray[i].WeekOffDays[j].Value==true){this.DynamicArray[i].WorkingDays[j].Value=false;} else{this.DynamicArray[i].WorkingDays[j].Value=true;}
    }
    else
    {
      if(this.DynamicArray[i].WorkingDays[j].Value==true){this.DynamicArray[i].WeekOffDays[j].Value=false;}else{this.DynamicArray[i].WeekOffDays[j].Value=true;}
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




