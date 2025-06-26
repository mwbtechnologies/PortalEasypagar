import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { NgForm } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { MatDialog } from '@angular/material/dialog';
import { ShowcredComponent } from '../employee-muster/showcred/showcred.component';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import { environment } from 'src/environments/environment.prod';
import { ShowalertComponent } from './showalert/showalert.component';
import { SendwhatsappmsgComponent } from './sendwhatsappmsg/sendwhatsappmsg.component';
import { LeavesettingsComponent } from './leavesettings/leavesettings.component';
import { th } from 'date-fns/locale';


export class FormInput{
  Trainings:any;
  IsPercentage:any;
  SecurityDeposit:any;
  SDmonthlydeduction:any;
  EmployeeId:any;
  AlternateMobileNumber:any;
  EmpID:any;
  EmergencyNumber:any;
  OT:any;
  BloodGroup:any;
  OfficeStartTime:any;
  OfficeEndTime:any;
  Gender:any;
  Education:any;
  FatherName:any;
  Relationship:any;
  DOB:any;
  Age:any;
  Organization:any;
  OldPassword:any;
  BranchID:any;
  DepartmentID:any;
  Designation:any;
  DateOfJoining:any;
  LoanAdvanceBalance:any;
  Deduction:any;
  OldSalaryBalance:any;
  OldSalaryAdvance:any;
  AdminBalance:any;
  EmployeeBalance:any;
  NoOfSickLeave:any;
  NoOfPaidLeave:any;
  BasicSalary:any;
  Logo:any;
  AdminID:any;
  ProfileImageURl:any;
  Password:any;
  ConfirmPassword:any;
  Email:any;
  FirstName:any;
  LastName:any;
  MobileNumber:any;
  StateID:any;
  CityID:any;
  Address:any;
  Proofs:Array<Proof> = [];
  IsMondayOff:any;
  IsTuesdayOff:any;
  IsWednesdayOff:any;
  IsFridayOff:any;
  IsSaturdayOff:any;
  IsThursdayOff:any;
  IsSundayOff:any;
  AppVersion:any;
  IsPerday:any;
  IsYearlyLeaves:any;
 GrossSalary:any;
 CTC:any;
 HRA:any;
 Allowances:any;
 ESI:any; 
 PF:any;
 GaurdianName:any;
 DNS:any;
 AccountName:any;
 AccountNumber:any;
 Bank:any;
 IFSC:any;
 Branch:any;
 UPIID:any;
 DesignationID:any;
 RoleID:any;
 ProofID1:any;
 ProofID2:any;
 SettingID:any;
 FinancialTypeID:any;
 Proof2:any;
 Proof1:any;
 OrgID:any;
 IsGeofenced:boolean=true;
 FixedIncentive:any;
 CTCSalary:any;
 IsWFH:any;
    TrainerID: any;
    IsESIStopped:any;
    IsPTStopped:any;
    IsPFStopped:any;
    IsSDStopped:any;
    LTA:any;
    Conveyance:any;
    PSA:any;

    BasicAndDA: any;
    WashingAllowance: any;
    FuelAllowance: any;
    SpecialAllowance: any;
}
export class dateclass
{
  StartDate:any;
}
export class Proof{
  ProofTypeID:any;
  FrontImage:any;
  BackImage:any;
  ProofNumber:any;
}
export class Dropdown{
  Text:any;
  Value:any;
}
@Component({
  selector: "app-create-employee",
  templateUrl: "./create-employee.component.html",
  styleUrls: ["./create-employee.component.css"],
})
export class CreateEmployeeComponent implements OnInit {
  formInput: FormInput | any;
  ProofClass:Array<Proof> = [];
  ListTypes:Array<Dropdown> = [];
  BloodGroups:Array<Dropdown> = [];
  ProofInput: Proof | any;
  all_selected_values:any;
  isProofType1Selected:any;
  isProofType2Selected:any;
  isProofType3Selected:any;
  multiselectcolumns: IDropdownSettings = {};
  BranchSettings: IDropdownSettings = {};
  branchSettings: IDropdownSettings = {};
  departmentSettings: IDropdownSettings = {};
  ShowWeekOff=true;
  public isSubmit: boolean | any;
  ShowList=true;
  LoginUserData:any;
  AdminID: any;
  ApiURL: any;
  NoBranchFound: any;
  file:File | any;
  EmployeeId:any;
  originalProofList:any;
  ProofList:any;
  selectedListId: string[] | any;
  selectedCityId:string[]|any;
  selectedBranchId:string[]|any;
  selectedDepartmentId:string[]|any;
  tempcredarray:any[]=[];
  OrgID:any;
  CurrentDate:any;
  EmployeeDetails:any;
  StateList:any;
  CityList: any;
  EditBranchValue: any;
  DesignationList: any;
  RoleList: any;
  GenderList: any;
  ProofNumberI: any;
  ProofNumberII: any;
  ProofNumberIII: any;
  ProofIImageURl1: any;
  ProofIImageURl2: any;
  ProofIImageURl3: any;
  ProofIIImageURl1: any;
  ProofIIImageURl2: any;
  ProofIIImageURl3: any;
  P1choose1 = false;
  P1choose2 = false;
  P2choose1 = false;
  P2choose2 = false;
  P3choose1 = false;
  P3choose2 = false;
  ProofImage1: any;
  ProofImage2: any;
  ProofImage3: any;
  ProofImage4: any;
  ProofImage5: any;
  ProofImage6: any;
  LoginType:any;
  NewAPIUrl: any;
  passwordinput: any;
  confirmpasswordinput: any;
  DOB: any;
  IsPercentageselected:any=false;
  MonthlySalary:any;
  SettingList: any;
  Showshift: any = false;
  SettingID: any;
  AddPermission: any = true;
  EditPermission: any = true;
  ViewPermission: any = true;
  DeletePermission: any = true;
  UserID: any;
  ProofIPlaceHolder: any;
  ProofIIPlaceHolder: any;
  mail: any;
  OriginalBranchList: any;
  OriginalDepartmentList: any;
  chips: any[] = [];
  selectedDepartments: any = [];
  DeptColumns:any[]=[];
  index: any;
  ApplicationList: any = ["All","Active", "Inactive"];
  Columns: any[] = [];
  ShowShareButton: any;
  selectedBranches: any = [];
  isScrolled: boolean = false;
  searchText: string = "";
  SingleSelectionSettings:IDropdownSettings = {};
  ShiftList: any[] = [];
  IsWholeYear:any;
  branch: any;
  department: any;
  Shift: any;
  EmployeeName: any;
  shiftID:any;
  AllotID:any=0;
  shiftSettings: IDropdownSettings = {};
  esiUpdating: boolean = false;
  pfUpdating: boolean = false;
  FilterType: any;
  ShowKYCTab: boolean = false;
  ShowSalaryTab: boolean = false;
  selectedbranchid: any;
  selecteddepartmentid: any;
  RegDepartmentList: any;
  selectedListType: any;
  selectedDepartmentid: any;
  selectedlisttype: any;
  selectedBranch: any[] = [];
  selectedDepartment: any[] = [];
  temparray: any = [];
  tempdeparray: any = [];
  BranchList: any[] = [];
  selectall: any;
  ProofIIIPlaceHolder:any;
  DepartmentList:any;
   SelectedBranches:any[]=[];
   SelectedDepartments:any[]=[];
   proofName1:any
   proofName2:any
   proofName3:any
  SalarySettingList: any;
  SalaryFormulae: any;
  salaryTemp : any = {}
  timeFormat:any;
  selectedOrganization:any[]=[]
   selectedTrainer:any[]=[]
  OrgList:any[]=[]
  orgSettings:IDropdownSettings = {}
    TrainerSettings:IDropdownSettings = {}
  IsSecuritydeposit:boolean=false;
  showsdoption:any;
  TrainerList: any;
  constructor(
    public dialog: MatDialog,
    private _router: Router,
    private spinnerService: NgxSpinnerService,
    private _commonservice: HttpCommonService,
    private cdr: ChangeDetectorRef
  ) {
    this.isSubmit = false;
    this.shiftSettings = {
      singleSelection: true,
      idField: "Value",
      textField: "Text",
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.SingleSelectionSettings = {
      singleSelection: true,
      idField: "id",
      textField: "text",
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.BranchSettings = {
      singleSelection: true,
      idField: "Value",
      textField: "Text",
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.multiselectcolumns = {
      singleSelection: true,
      idField: "Value",
      textField: "Text",
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.branchSettings = {
      singleSelection: true,
      idField: "Value",
      textField: "Text",
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
  this.departmentSettings = {
      singleSelection: true,
      idField: "Value",
      textField: "Text",
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

    this.TrainerSettings={
        singleSelection: false,
      idField: 'TrainingId',
      textField: 'TrainingHeading',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    }
  }
  ngOnInit(): void {
    this.showsdoption=false;
    this.ShowShareButton=false;
this.NoBranchFound="No Branches Found";
console.log("called");
// this.selectedbranchid=0;
this.selecteddepartmentid=0;
    this.FilterType = ["All"];
this.AdminID = localStorage.getItem("AdminID");
this.UserID = localStorage.getItem("UserID");
this.OrgID = localStorage.getItem("OrgID");
    if (
      this.AdminID == null ||
      this.AdminID == "" ||
      this.OrgID == undefined ||
      this.OrgID == null ||
      this.OrgID == "" || 
      this.AdminID == undefined
    ) {
  this._router.navigate(["auth/signin-v2"]);
}
    this.formInput = { 
      SecurityDeposit:0,
      SDmonthlydeduction:0,
      EmployeeId:0,  
      EmpID: "",
      EmergencyNumber: "",
      GaurdianName: "",
      OT: "0",
      BloodGroup: "",
      OfficeStartTime: "",
      OfficeEndTime: "",
      Gender: "",
      Education: "",
      FatherName: "",
      DOB: "",
      Age:0,
      Organization: "",
      OldPassword: "",
      BranchID: "",
      DepartmentID: "",
      Designation: "",
      DateOfJoining: "",
  LoanAdvanceBalance:0,
  Deduction:0,
  OldSalaryBalance:0,
  OldSalaryAdvance:0,
  AdminBalance:0,
  EmployeeBalance:0,
  NoOfSickLeave:0,
  NoOfPaidLeave:0,
  BasicSalary:0,
  PSA:0,
      GrossSalary: 0,
      CTC:0,
      Logo: "",
  AdminID:this.AdminID,
      ProfileImageURl: "",
      Password: "",
      ConfirmPassword: "",
      Email: "",
      FirstName: "",
      LastName: "",
      MobileNumber: "",
      StateID: "",
      CityID: "",
      Address: "",
      isGeoFenced: true,
  IsMondayOff:false,
  IsTuesdayOff:false,
  IsWednesdayOff:false,
  IsFridayOff:false,
  IsSaturdayOff:false,
  IsThursdayOff:false,
  IsSundayOff:false,
      AppVersion: "1.0.0",
  IsPerday:false,
  IsYearlyLeaves:false,
      Relationship: "",
  HRA:0,
  FixedIncentive:0,
  DA:0,
  TA:0,
  MA:0,
  Allowances:0,
  ESI:0,
  PF:0,
  DNS:0,
  RoleID:2,
  DesignationID:0,
      ProofID1: "",
      ProofID2: "",
      ProofID3: "",
  SettingID:0,
  FinancialTypeID:1,
      Proof2: "",
      Proof1: "",
      Proof3: "",
  OrgID:0,
  CTCSalary:0,
      AlternateMobileNumber: "",
      Proofs: [],
      IsWFH:false,
      TrainerID:0,
      Trainings:[],
         IsESIStopped:false,
    IsPTStopped:false,
    IsPFStopped:false,
    IsSDStopped:false,
    LTA:0,
        Conveyance: 0,
        BasicAndDA: 0,
        WashingAllowance: 0,
        FuelAllowance: 0,
        SpecialAllowance:0,
    };
    this.formInput.isGeoFenced=true;
this.MonthlySalary=true;
this.selectedListType=0;
this.selectall=true;
    this.LoginType = localStorage.getItem("LoginStatus");
    if (this.LoginType == "true") {
      this.LoginType = "Email";
    } else {
      this.LoginType = "Mobile";
    }

this.ShowKYCTab=false;
this.formInput.OrgID=this.OrgID;
    this.passwordinput = "password";
    this.confirmpasswordinput = "password";
    this.GetBloodGroupTypes();
this.formInput.AdminID=this.AdminID;
    this._commonservice.ApiUsingGetWithOneParam("Admin/GetProofList").subscribe(
      (data) => {
        this.originalProofList = data.List;
        this.ProofList = data.List;
      },
      (error) => {
        this.ShowAlert(error.message,"error");
        console.log(error);
      }
    );

    // this._commonservice.ApiUsingGetWithOneParam("Admin/GetStateList").subscribe(
    //   (data) => (this.StateList = data.List),
    //   (error) => {
    //     this.ShowAlert(error);
    //     console.log(error);
    //   }
    // );

    // this._commonservice
    //   .ApiUsingGetWithOneParam("Admin/GetGenderList")
    //   .subscribe(
    //     (data) => (this.GenderList = data.List),
    //     (error) => {
    //       this.ShowAlert(error);
    //       console.log(error);
    //     }
    //   );

  // this.NewAPIUrl="Portal/GetOrgRoles?OrgID="+this.OrgID;
  //   this._commonservice.ApiUsingGetWithOneParam(this.NewAPIUrl).subscribe(
  //     (data) => (this.RoleList = data.List),
  //     (error) => {
  //       this.ShowAlert(error);
  //       console.log(error);
  //     }
  //   );

     this.selectedbranchid=0;
    this.selecteddepartmentid = 0;
    this.selectedlisttype = 0;
    this.GetOrganization();
    this.GetBranches();
// this.GetDesignations();
this.GetDepartments();
// this.GetRegDepartments(0);
// this.Getsettings();
    // this.GetBranchesList();
// this.AddPermission=localStorage.getItem("AddPermission"); if(this.AddPermission=="true"){this.AddPermission=true;} else{this.AddPermission=false;}
//     this.EditPermission=localStorage.getItem("EditPermission");  if(this.EditPermission=="true"){this.EditPermission=true;}else{this.EditPermission=false;}
//     this.ViewPermission=localStorage.getItem("ViewPermission");  if(this.ViewPermission=="true"){this.ViewPermission=true;}else{this.ViewPermission=false;}
//     this.DeletePermission=localStorage.getItem("DeletePermission");  if(this.DeletePermission=="true"){this.DeletePermission=true;}else{this.DeletePermission=false;}
    this.AddPermission = true;
    this.EditPermission = true;
    this.ViewPermission = true;
    this.DeletePermission = true;
this.ProofIPlaceHolder="Proof Number/ID";
    this.ProofIIPlaceHolder="Proof Number/ID";
    this.ProofIIIPlaceHolder="Proof Number/ID";
    this.getTimeFormat()
  }

  getTimeFormat(){
    this.timeFormat = 24;
    let TimeFormat:boolean  = Boolean(localStorage.getItem("TimeFormat"))
    if(TimeFormat == true){
      this.timeFormat = 12
    }
  }
    ShowAlert(message: string, type: 'success' | 'warning' | 'error'): void {
      this.dialog.open(ShowalertComponent, {
        data: { message, type } 
         ,panelClass: 'custom-dialog',
        disableClose: true }).afterClosed().subscribe((res) => {
        if (res) {
          console.log("Dialog closed");
        }
      });
    }
  onDateChange(event: any) {
    const dateValue = event.target.value;
    if (dateValue) {
      const year = new Date(dateValue).getFullYear().toString();
      if (year.length > 4) {
        this.ShowAlert('The year cannot exceed four digits',"warning");
        this.formInput.DateOfJoining = ''
        console.log(this.formInput.DateOfJoining);
      } else {
        console.log(this.formInput.DateOfJoining);
        return 
      }
    }
    
  }
  getProofName1(name:any){
   this.proofName1 = name.Text
  }
  getProofName2(name:any){
   this.proofName2 = name.Text
  }
  getProofName3(name:any){
    this.proofName3 = name.Text
   }
  validateProofID1():boolean {
    const proofType = this.proofName1;
    const proofID = this.formInput.ProofID1;  
    if (proofType === 'Aadhar Card' && !/^\d{12}$/.test(proofID)) {
       this.ShowAlert('Aadhar number must be 12 digits.',"warning");
       this.formInput.ProofID1.control.setErrors({ pattern: true });
       return false
    } else if (proofType === 'PAN Card' && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(proofID)) {
      this.ShowAlert('PAN number must be 10 characters in the correct format.',"warning");
      this.formInput.ProofID1.control.setErrors({ pattern: true });
      return false
    } else if (proofType === 'Driving License' && !/^[A-Z]{2}\d{2}\d{4}\s?\d{7}$/.test(proofID)) {
       this.ShowAlert('Driving License number must be 10 to 15 alphanumeric characters.',"warning");
       this.formInput.ProofID1.control.setErrors({ pattern: true });
       return false
    } else {
      return true
    }
 }
  validateProofID2():boolean {
    const proofType = this.proofName2;
    const proofID = this.formInput.ProofID2;  
    if (proofType === 'Aadhar Card' && !/^\d{12}$/.test(proofID)) {
       this.ShowAlert('Aadhar number must be 12 digits.',"warning");
       this.formInput.ProofID2.control.setErrors({ pattern: true });
       return false
    } else if (proofType === 'PAN Card' && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(proofID)) {
      this.ShowAlert('PAN number must be 10 characters in the correct format.',"warning");
      this.formInput.ProofID2.control.setErrors({ pattern: true });
      return false
    } else if (proofType === 'Driving License' && !/^[A-Z]{2}\d{2}\d{4}\s?\d{7}$/.test(proofID)) {
       this.ShowAlert('Driving License number must be 10 to 15 alphanumeric characters.',"warning");
       this.formInput.ProofID2.control.setErrors({ pattern: true });
       return false
    } else {
      return true
    }
 }
 validateProofID3():boolean {
  const proofType = this.proofName3;
  const proofID = this.formInput.ProofID3;  
  if (proofType === 'Aadhar Card' && !/^\d{12}$/.test(proofID)) {
     this.ShowAlert('Aadhar number must be 12 digits.',"warning");
     this.formInput.ProofID3.control.setErrors({ pattern: true });
     return false
  } else if (proofType === 'PAN Card' && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(proofID)) {
    this.ShowAlert('PAN number must be 10 characters in the correct format.',"warning");
    this.formInput.ProofID3.control.setErrors({ pattern: true });
    return false
  } else if (proofType === 'Driving License' && !/^[A-Z]{2}\d{2}\d{4}\s?\d{7}$/.test(proofID)) {
     this.ShowAlert('Driving License number must be 10 to 15 alphanumeric characters.',"warning");
     this.formInput.ProofID3.control.setErrors({ pattern: true });
     return false
  } else {
    return true
  }
}

  
  GetDepartmentsList() {
    const json={
      Branches:this.selectedBranch.map((br: any) => {
        return {
          id: br.Value,
        };
      }),
    };
    this._commonservice.ApiUsingPost("Portal/GetDepartments", json).subscribe(
      (data) => {
      console.log(data);
      if (data.DepartmentList.length > 0) {
        this.DepartmentList = data.List;
        console.log(this.DepartmentList,"department list");
      }
      },
      (error) => {
        this.ShowAlert(error,"error");
        console.log(error);
  }
    );
  }
 onDeptSelect(item:any){
    console.log(item,"item");
    this.tempdeparray.push({id:item.Value, text:item.Text });
   }
  onDeptSelectAll(item:any){
   console.log(item,"item");
   this.tempdeparray = item;
  }
  onDeptDeSelectAll(){
   this.tempdeparray = [];
  }
  onDeptDeSelect(item:any){
   console.log(item,"item");
   this.tempdeparray.splice(this.tempdeparray.indexOf(item), 1);
  }
  onBranchtextSelect(item:any){
   console.log(item,"item");
   this.temparray.push({id:item.Value,text:item.Text });
   this.GetDepartmentsList();
   this.GetSalaryConfigs();
  }
  onBranchDeSelect(item:any){
   console.log(item,"item");
   this.temparray.splice(this.temparray.indexOf(item), 1);
   this.GetDepartmentsList();
   
   this.GetSalaryConfigs();
  }
  ShowKYCDetails() {
    if (this.ShowKYCTab == true) {
      this.ShowKYCTab = false;
    } else {
      this.ShowKYCTab = true;
  }
  }
  ShowSalaryDetails() {
    if (this.ShowSalaryTab == true) {
      this.ShowSalaryTab = false;
    } else {
      this.ShowSalaryTab = true;
}
  }
  checkbox() {}
onShiftSelect(item: any) {
    this.shiftID = item.ID;
}
  // Getsettings() {
  //   this.NewAPIUrl="Admin/GetSalaryDropdown?OrgID="+this.OrgID;
  //   this._commonservice.ApiUsingGetWithOneParam(this.NewAPIUrl).subscribe(
  //     (data) => (this.SettingList = data.List),
  //     (error) => {
  //       this.ShowAlert(error);
  //       console.log(error);
  // }
  //   );
  // }
  GetDesignations() {
    this.NewAPIUrl="Portal/GetOrgDesignations?OrgID="+this.OrgID;
    this._commonservice.ApiUsingGetWithOneParam(this.NewAPIUrl).subscribe(
      (data) => (this.DesignationList = data.List),
      (error) => {
        this.ShowAlert(error,"error");
        console.log(error);
  }
    );
  }


    validateWashingAllowance(value: any) {
        if (!/^[1-9][0-9]*|0?\.[0-9]+|[0-9]+\.[0-9]+$/.test(value)) {
            // this.globalToastService.warning("Please Enter Valid MA");
            this.ShowAlert("Please Enter Valid WashingAllowance", "warning");
            setTimeout(() => {
                this.formInput.WashingAllowance = 0;
                this.calculateGross()
                this.calculateESI();
                this.calculatePF();
            });
        } else {
            this.formInput.WashingAllowance = value;
            this.calculateGross()
            this.calculateESI();
            this.calculatePF();
        }
    }

    validateSpecialAllowance(value: any) {
        if (!/^[1-9][0-9]*|0?\.[0-9]+|[0-9]+\.[0-9]+$/.test(value)) {
            // this.globalToastService.warning("Please Enter Valid MA");
            this.ShowAlert("Please Enter Valid Special Allowance", "warning");
            setTimeout(() => {
                this.formInput.SpecialAllowance = 0;
                this.calculateGross()
                this.calculateESI();
                this.calculatePF();
            });
        } else {
            this.formInput.SpecialAllowance = value;
            this.calculateGross()
            this.calculateESI();
            this.calculatePF();
        }
    }

    validateFuelAllowance(value: any) {
        if (!/^[1-9][0-9]*|0?\.[0-9]+|[0-9]+\.[0-9]+$/.test(value)) {
            // this.globalToastService.warning("Please Enter Valid MA");
            this.ShowAlert("Please Enter Valid Fuel Allowance", "warning");
            setTimeout(() => {
                this.formInput.FuelAllowance = 0;
                this.calculateGross()
                this.calculateESI();
                this.calculatePF();
            });
        } else {
            this.formInput.FuelAllowance = value;
            this.calculateGross()
            this.calculateESI();
            this.calculatePF();
        }
    }

    validateBasicAndDA(value: any) {
        if (!/^[1-9][0-9]*|0?\.[0-9]+|[0-9]+\.[0-9]+$/.test(value)) {
            // this.globalToastService.warning("Please Enter Valid MA");
            this.ShowAlert("Please Enter Valid Basic And DA", "warning");
            setTimeout(() => {
                this.formInput.BasicAndDA = 0;
                this.calculateGross()
                this.calculateESI();
                this.calculatePF();
            });
        } else {
            this.formInput.BasicAndDA = value;
            this.calculateGross()
            this.calculateESI();
            this.calculatePF();
        }
    }

  GetBloodGroupTypes() {
  let arr=new Dropdown();
  arr.Text="A+";
  arr.Value="A+";
  this.BloodGroups.push(arr);

  arr=new Dropdown();
  arr.Text="A-";
  arr.Value="A-";
  this.BloodGroups.push(arr);

  arr=new Dropdown();
  arr.Text="B+";
  arr.Value="B+";
  this.BloodGroups.push(arr);

  arr=new Dropdown();
  arr.Text="B-";
  arr.Value="B-";
  this.BloodGroups.push(arr);

  arr=new Dropdown();
  arr.Text="O+";
  arr.Value="O+";
  this.BloodGroups.push(arr);

  arr=new Dropdown();
  arr.Text="O-";
  arr.Value="O-";
  this.BloodGroups.push(arr);

  arr=new Dropdown();
  arr.Text="AB+";
  arr.Value="AB+";
  this.BloodGroups.push(arr);

  arr=new Dropdown();
  arr.Text="AB-";
  arr.Value="AB-";
  this.BloodGroups.push(arr);
}
  OnBranchSelect(event: any) {
    if (event != null && event != undefined) {
    this.selectedBranchId=event.Value;
  }
}

SDUpdate()
{
  if(this.IsSecuritydeposit==true)
  {
    this.showsdoption=false;
    this.formInput.SecurityDeposit=0;
    this.formInput.SDmonthlydeduction=0;
    this.IsSecuritydeposit=false;
  }
  else{
  
this.showsdoption=true;
this.IsSecuritydeposit=true;
  }
}

SDSelected()
{
  if(this.IsPercentageselected==true)
  {
    this.IsPercentageselected=false;
  }
  else{
this.IsPercentageselected=true;
if (this.formInput.SDmonthlydeduction > 100) {
  this.ShowAlert(
    "Deduction % Cannot be greater than 100"
  ,"warning");
this.formInput.SDmonthlydeduction=0;
}
  }

}

  WeekOff() {
    if (this.ShowWeekOff == true) {
      this.ShowWeekOff=false;
      this.formInput.IsPerday=true;
      this.MonthlySalary=false;
      this.salaryTemp = {
        GrossSalary : this.formInput.GrossSalary,
        BasicSalary : this.formInput.BasicSalary,
        HRA : this.formInput.HRA,
        DA : this.formInput.DA,
        TA : this.formInput.TA,
        MA : this.formInput.MA,
        PF : this.formInput.PF,
        ESI : this.formInput.ESI,
        LTA : this.formInput.LTA,
          Conveyance : this.formInput.Conveyance,
        Allowances : this.formInput.Allowances
      }
      this.formInput.GrossSalary=Math.floor(this.formatNumber((this.formInput.GrossSalary > 0 ? this.formatNumber(this.formInput.GrossSalary) : this.formatNumber(this.formInput.BasicSalary))/30))
      this.formInput.BasicSalary=this.formatNumber(this.formInput.GrossSalary)
      this.formInput.HRA=0;
      this.formInput.DA=0;
      this.formInput.TA=0;
      this.formInput.MA=0;
      this.formInput.PF=0;
      this.formInput.ESI=0;
      this.formInput.LTA=0;
      this.formInput.Conveyance=0;
      this.formInput.Allowances=0;
    } else {
      this.ShowWeekOff=true;
      this.formInput.IsPerday=false;
      this.MonthlySalary=true;
      // this.formInput.GrossSalary = Math.floor((this.formatNumber(this.formInput.GrossSalary)) * 30)
      // this.validateGross(this.formatNumber(this.formInput.GrossSalary))
      this.formInput.GrossSalary =  this.salaryTemp.GrossSalary,
      this.formInput.BasicSalary =  this.salaryTemp.BasicSalary,
      this.formInput.HRA =  this.salaryTemp.HRA,
      this.formInput.DA =  this.salaryTemp.DA,
      this.formInput.TA =  this.salaryTemp.TA,
      this.formInput.MA =  this.salaryTemp.MA,
      this.formInput.PF =  this.salaryTemp.PF,
      this.formInput.ESI =  this.salaryTemp.ESI,
      this.formInput.LTA =  this.salaryTemp.LTA,
      this.formInput.Conveyance =  this.salaryTemp.Conveyance,
      this.formInput.Allowances =  this.salaryTemp.Allowances
    }

    // this.formInput.BasicSalary=0;
  }

  CalculateAge(date: Date): void {
         if(date){
          this.CurrentDate=new Date();
      const dateString = date + "T10:30:00"; // Assuming the string is in ISO 8601 format

           const dateObj = new Date(dateString);
          this.DOB = dateObj;
            var timeDiff = Math.abs(this.CurrentDate - this.DOB);
      this.formInput.Age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365);
        }
    }



  validateIFSC(ifscCode: string) {
    const ifscPattern = /^[A-Z]{4}[0-9]{7}$/;

    if (!ifscPattern.test(ifscCode)) {
      return "Fail";
    } else {
      console.log("Valid IFSC code");
      return "Ok";
    }
  }

  validateUPIID(UpiID: string) {
    const upiPattern =  /^(?!.*\s)(?:[a-zA-Z0-9._-]+|\d{10})@[a-zA-Z0-9.-]+$/;

    if (!upiPattern.test(UpiID)) {
      return "Fail";
    } else {
      console.log("Valid UpiID");
      return "Ok";
    }
  }

  SendEmail(ID: number) {
    this.spinnerService.show();
    this.EmployeeId=ID;
this.CurrentDate=new Date();
    this.ApiURL="Admin/ShareCredentials?EmployeeID="+this.EmployeeId;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(
      (data) => {
     if(data.Status==true){
      this.ShowAlert(data.Message,"success");
      this.spinnerService.hide();
        // window.location.reload();
        } else {
      this.ShowAlert(data.Message,"warning");
      this.spinnerService.hide();
     }
      },
      (error: any) => {
      this.ShowAlert(error.message,"error");
      this.spinnerService.hide();
    }
    );
  }

  SendSMS(ID: number) {
    this.spinnerService.show();
    this.EmployeeId=ID;
this.CurrentDate=new Date();
    this.ApiURL="Account/SendCredentials?EmployeeID="+this.EmployeeId;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(
      (data) => {
      this.ShowAlert("Credentials Shared Successfully","success");
      this.spinnerService.hide();
        // window.location.reload();   
      },
      (error: any) => {
      this.ShowAlert(error.message,"error");
      this.spinnerService.hide();
    }
    );
  }

 validateEmail(inputval:any) {
  const input = inputval;
    const isValidEmail =
      /^(?=[a-zA-Z0-9._%+-]*[a-zA-Z])[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(input);

  if (!isValidEmail ) {
   return "Fail";
  }

    return "Ok";
}
validateblood(inputval:any) {
  const input = inputval;
  const isValidEmail = /^(A|B|AB|O)[+-]$/.test(input);

  if (!isValidEmail ) {
   return "Fail";
  }

    return "Ok";
}
  close() {
  this.Showshift=false;
  this.ShowList=true;
}


  CheckDate(date: any) {
  this.ApiURL="Admin/CheckDate?UserDate="+date;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(
      (data) => {
    if(data.Status==true){
     this.spinnerService.hide();
        return true;
        } else {
       this.spinnerService.hide();
          this.ShowAlert(
            "Date should be greater than Current Date"
          ,"warning");
          this.formInput.DateOfJoining = "";
      
        return false;
     }
      },
      (error: any) => {
   this.spinnerService.hide();
   this.ShowAlert(error.message,"error");
   return false;
  }
  );
 }

  CheckDOB(date: any) {
  this.ApiURL="Admin/CheckDate?UserDate="+date;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(
      (data) => {
    if(data.Status==true){
     this.spinnerService.hide();
        return true;
        } else {
       this.spinnerService.hide();
          this.ShowAlert(
            "Date should be greater than Current Date"
          ,"warning");
          this.formInput.DOB = "";
      
        return false;
     }
      },
      (error: any) => {
   this.spinnerService.hide();
   this.ShowAlert(error.message,"error");
   return false;
  }
  );
 }

 UploadProof1Image1(event:any,form: NgForm) {
    if (this.formInput.Proof1 == "") {
    this.ShowAlert("Please select Proof Type","warning");
    } else {
    const target = event.target as HTMLInputElement;
    var img=(target.files as FileList)[0];
      if (img && img.type.startsWith("image/")) {
    this.file = (target.files as FileList)[0];
   
      var reader = new FileReader();
      reader.onload = (event: any) => {
          this, (this.ProofIImageURl1 = event.target.result);
        };
      reader.readAsDataURL(this.file);
      this.P1choose1 = true;
      const fData: FormData = new FormData();
        fData.append("formdata", JSON.stringify(form.value));
        fData.append("FileType", "IDProof");
        if (this.file != undefined) {
          fData.append("File", this.file, this.file.name);
          this._commonservice
            .ApiUsingPost("Admin/FileUpload", fData)
            .subscribe((data) => {
              this.ProofImage1 = data.NewUrl;
            });
      }
    } else {
      this.ShowAlert("Please Select valid image File","warning");
    }
  }
}
UploadProof1Image2(event:any,form: NgForm) {
    if (this.formInput.Proof1 == "") {
    this.ShowAlert("Please select Proof Type","warning");
    } else {
  const target = event.target as HTMLInputElement;
        this.file = (target.files as FileList)[0];
      if (this.file && this.file.type.startsWith("image/")) {
  var reader = new FileReader();
  reader.onload = (event: any) => {
          this, (this.ProofIImageURl2 = event.target.result);
        };
  reader.readAsDataURL(this.file);
  this.P1choose2 = true;
  const fData: FormData = new FormData();
        fData.append("formdata", JSON.stringify(form.value));
        fData.append("FileType", "IDProof");
        if (this.file != undefined) {
          fData.append("File", this.file, this.file.name);
          this._commonservice
            .ApiUsingPost("Admin/FileUpload", fData)
            .subscribe((data) => {
              this.ProofImage2 = data.NewUrl;
            });
        }
} else {
  this.ShowAlert("Please Select valid image File","error");
}
}
}
UploadProof2Image1(event:any,form: NgForm) {
    if (this.formInput.Proof2 == "") {
    this.ShowAlert("Please select Proof Type","warning");
    } else {
  const target = event.target as HTMLInputElement;
        this.file = (target.files as FileList)[0];
      if (this.file && this.file.type.startsWith("image/")) {
  var reader = new FileReader();
  reader.onload = (event: any) => {
          this, (this.ProofIImageURl1 = event.target.result);
        };
  reader.readAsDataURL(this.file);
  this.P2choose1 = true;
  const fData: FormData = new FormData();
        fData.append("formdata", JSON.stringify(form.value));
        fData.append("FileType", "IDProof");
        if (this.file != undefined) {
          fData.append("File", this.file, this.file.name);
          this._commonservice
            .ApiUsingPost("Admin/FileUpload", fData)
            .subscribe((data) => {
              this.ProofImage3 = data.NewUrl;
            });
        }
} else {
  this.ShowAlert("Please Select valid image File","error");
}
}
}
UploadProof2Image2(event:any,form: NgForm) {
    if (this.formInput.Proof2 == "") {
    this.ShowAlert("Please select Proof Type","error");
    } else {
  const target = event.target as HTMLInputElement;
        this.file = (target.files as FileList)[0];
      if (this.file && this.file.type.startsWith("image/")) {
  var reader = new FileReader();
  reader.onload = (event: any) => {
          this, (this.ProofIImageURl2 = event.target.result);
        };
  reader.readAsDataURL(this.file);
  this.P2choose2 = true;
  const fData: FormData = new FormData();
        fData.append("formdata", JSON.stringify(form.value));
        fData.append("FileType", "IDProof");
        if (this.file != undefined) {
          fData.append("File", this.file, this.file.name);
          this._commonservice
            .ApiUsingPost("Admin/FileUpload", fData)
            .subscribe((data) => {
              this.ProofImage4 = data.NewUrl;
            });
        }
} else {
  this.ShowAlert("Please Select valid image File","error");
}
    }
  }


  UploadProof3Image1(event:any,form: NgForm) {
    if (this.formInput.Proof3 == "") {
    this.ShowAlert("Please select Proof Type","warning");
    } else {
    const target = event.target as HTMLInputElement;
    var img=(target.files as FileList)[0];
      if (img && img.type.startsWith("image/")) {
    this.file = (target.files as FileList)[0];
   
      var reader = new FileReader();
      reader.onload = (event: any) => {
          this, (this.ProofIIImageURl1 = event.target.result);
        };
      reader.readAsDataURL(this.file);
      this.P3choose1 = true;
      const fData: FormData = new FormData();
        fData.append("formdata", JSON.stringify(form.value));
        fData.append("FileType", "IDProof");
        if (this.file != undefined) {
          fData.append("File", this.file, this.file.name);
          this._commonservice
            .ApiUsingPost("Admin/FileUpload", fData)
            .subscribe((data) => {
              this.ProofImage3 = data.NewUrl;
            });
      }
    } else {
      this.ShowAlert("Please Select valid image File","warning");
    }
  }
}
UploadProof3Image2(event:any,form: NgForm) {
    if (this.formInput.Proof3 == "") {
    this.ShowAlert("Please select Proof Type","warning");
    } else {
  const target = event.target as HTMLInputElement;
        this.file = (target.files as FileList)[0];
      if (this.file && this.file.type.startsWith("image/")) {
  var reader = new FileReader();
  reader.onload = (event: any) => {
          this, (this.ProofIIImageURl2 = event.target.result);
        };
  reader.readAsDataURL(this.file);
  this.P3choose2 = true;
  const fData: FormData = new FormData();
        fData.append("formdata", JSON.stringify(form.value));
        fData.append("FileType", "IDProof");
        if (this.file != undefined) {
          fData.append("File", this.file, this.file.name);
          this._commonservice
            .ApiUsingPost("Admin/FileUpload", fData)
            .subscribe((data) => {
              this.ProofImage3 = data.NewUrl;
            });
        }
} else {
  this.ShowAlert("Please Select valid image File","error");
}
}
}
  checkProof(event: any) {
    if (
      this.formInput.Proof1 == null ||
      this.formInput.Proof1 == undefined ||
      this.formInput.Proof1 == ""
    ) {
    this.ShowAlert("Please select Proof I","warning");
    this.formInput.Proof2="";
    } else {
      if (this.formInput.Proof1 == event.Value) {
  this.ShowAlert("Proof Types should be unique","warning");
  this.formInput.Proof1="";
  this.formInput.Proof2="";
}
  }
}
getImageUrl(imagePath: string): string {
  if (!imagePath) return ''; 
  if (imagePath.startsWith('http') || imagePath.startsWith('https')) {
    return imagePath;
  } else {
    return environment.Url + imagePath;
  }
}


  OnMonthlySalaryChange(val: any, text: any) {
    if (text == "Month") {
var amount=val/30;
this.formInput.BasicSalary=amount;
  }
    if (text == "Day") {
    var amount=val*30;
    this.formInput.GrossSalary=amount;
  }
}

  SetSalaryID(ID: any) {
  this.SettingID=ID;
    if (
      this.formInput.GrossSalary != null &&
      this.formInput.GrossSalary != "" &&
      this.formInput.GrossSalary != 0 &&
      this.formInput.GrossSalary != undefined &&
      this.formInput.GrossSalary != ""
    ) {
    this.OnSalaryChange(this.formInput.GrossSalary);
  }
}

  OnSalaryChange(val: any) {
    if (
      this.SettingID != null &&
      this.SettingID != "" &&
      this.SettingID != 0 &&
      this.SettingID != undefined &&
      this.SettingID != ""
    ) {
    this.spinnerService.show();
      this.ApiURL =
        "Admin/GetSalaryCalculation?SettingID=" +
        this.SettingID +
        "&GrossSalary=" +
        val;
      this._commonservice
        .ApiUsingGetWithOneParam(this.ApiURL)
        .subscribe((data) => {
          if (data.Status == true) {
      this.formInput.HRA=data.List.HRA;
      this.formInput.DA=data.List.DA;
      this.formInput.PF=data.List.PF;
      this.formInput.ESI=data.List.ESI;
      this.formInput.LTA=data.List.LTA;
      this.formInput.Conveyance=data.List.Conveyance;
      this.formInput.TA=data.List.TA;
      this.formInput.Allowances=0;
      this.formInput.BasicSalary=data.List.BasicSalary;
          }
        });
    this.spinnerService.hide();
  }
}

OnConfirmClick() {
  if (this.confirmpasswordinput == "text") {
    this.confirmpasswordinput = "password";
    } else {
    this.confirmpasswordinput = "text";
  }
}
OnPassClick() {
  if (this.passwordinput == "text") {
    this.passwordinput = "password";
    } else {
    this.passwordinput = "text";
  }
}

  validatealternatemobile(event: any, val: any) {
  const inputChar = String.fromCharCode(event.keyCode || event.charCode);
  if (!/^\d+$/.test(inputChar)) {
      this.ShowAlert("Please Enter Valid Input","warning");
  this.formInput.AlternateMobileNumber = '';
    } else {
      if (
        (val == "" || val == undefined || val == null) &&
        event.key != "6" &&
        event.key != "7" &&
        event.key != "8" &&
        event.key != "9"
      ) {
        this.ShowAlert(
          "First digit should contain numbers between 6 to 9"
        ,"warning");
      this.formInput.AlternateMobileNumber = '';
    }
  }
}
  validatemobilenumber(event: any, val: any) {
  const inputChar = String.fromCharCode(event.keyCode || event.charCode);
  if (!/^\d+$/.test(inputChar)) {
      this.ShowAlert("Please Enter Valid Input","warning");
  this.formInput.MobileNumber.clear();
    } else {
      if (
        (val == "" || val == undefined || val == null) &&
        event.key != "6" &&
        event.key != "7" &&
        event.key != "8" &&
        event.key != "9"
      ) {
        this.ShowAlert(
          "First digit should contain numbers between 6 to 9"
        ,"warning");
      this.formInput.MobileNumber.clear();
    }
  }
}
  validategardiannumber(event: any) {
  const inputChar = String.fromCharCode(event.keyCode || event.charCode);
  if (!/^\d+$/.test(inputChar)) {
      this.ShowAlert("Please Enter Valid Input","warning");
  {
    this.formInput.EmergencyNumber.clear();
  }
    } else {
      if (
        (this.formInput.EmergencyNumber == "" ||
          this.formInput.EmergencyNumber == undefined ||
          this.formInput.EmergencyNumber == null) &&
        event.key != "6" &&
        event.key != "7" &&
        event.key != "8" &&
        event.key != "9"
      ) {
        this.ShowAlert(
          "First digit should contain numbers between 6 to 9"
        ,"warning");
      this.formInput.EmergencyNumber.clear();
    }
  }
}
  // validategross(event: any) {
  //   const inputChar = String.fromCharCode(event.keyCode || event.charCode);
  //   if (!/^\d+$/.test(inputChar)) {
  //     this.ShowAlert("Please Enter Valid Input");
  //     {
  //       this.formInput.GrossSalary = "";
  //     }
  //   }
  // }

  formatNumber(num: number) {
    return num % 1 === 0 ? num : parseFloat(num.toFixed(2));
  }

  calculate(type:string){
    for (let i = 0; i < this.SalaryFormulae.length; i++) {
      const sf = this.SalaryFormulae[i];
      if(sf.SalaryType == type){
        let value =0
        if(sf.isBasic) value += this.formInput.BasicSalary
        if(sf.isHRA) value += this.formInput.HRA
        if(sf.isDA) value += this.formInput.DA
        if(sf.isTA) value += this.formInput.TA
        if(sf.isMA) value += this.formInput.MA
        if(sf.isLTA) value +=this.formInput.LTA
         if(sf.isConveyance) value +=this.formInput.isConveyance

        value = this.formatNumber(Number(value))
        
        
        if((sf.Min == null || value >= sf.Min) && (sf.Max == null || value <= sf.Max)){
          
          console.log("--------------------------");
          console.log("--------------------------");
          console.log(sf);
          console.log("value : ", value);
          console.log(sf.Min ," - ", sf.Max);
          console.log(sf.Min == null,value >= sf.Mi,sf.Max == null,value <= sf.Max);
          
          console.log("--------------------------");
          console.log("--------------------------");
          if(sf.isAmount == true){
            return this.formatNumber(Number(sf.Value))
          }else{
            return this.formatNumber(Number(value * (sf.Value/100)))
  }
}
      }
    }
    return 0
  }

  calculatePF() {
    if (this.SalarySettingList["isPF"] == false || this.formInput.IsPerday == true) return;

    let oldPFValue = Number(this.formInput.PF);
    this.formInput.PF = this.calculate('EPF')

  if(Number(this.formInput.PF) !== Number(oldPFValue)){
      this.pfUpdating = true;
    setTimeout(() => {
        this.pfUpdating = false;
    }, 3000);
  }
}

calculateESI(){
    if (this.SalarySettingList == undefined || this.SalarySettingList["isESI"] == false || this.formInput.IsPerday == true) return;
    let oldESIValue = Number(this.formInput.ESI);

    this.formInput.ESI = this.calculate('ESI')
    
  if(Number(this.formInput.ESI) !== Number(oldESIValue)){
      this.esiUpdating = true;
    setTimeout(() => {
        this.esiUpdating = false;
    }, 3000);
  }
}

    calculateGross() {
        debugger;
  this.formInput.GrossSalary = this.formatNumber((Number(this.formInput.BasicSalary) || 0) + 
  (Number(this.formInput.HRA) || 0) + 
  (Number(this.formInput.DA) || 0) + 
  (Number(this.formInput.TA) || 0) + 
  (Number(this.formInput.MA) || 0) +
      (Number(this.formInput.LTA) || 0) +
      (Number(this.formInput.BasicAndDA) || 0) +
      (Number(this.formInput.WashingAllowance) || 0) +
      (Number(this.formInput.FuelAllowance) || 0) +
      (Number(this.formInput.SpecialAllowance) || 0) +
  (Number(this.formInput.Conveyance) || 0)
);


  this.formInput.CTC=this.formInput.GrossSalary * 12;

}

    removeLeadingZero(event: Event, paramText: string): void {
        debugger;
    const inputElement = event.target as HTMLInputElement;
    if (inputElement == null) return;
  if (inputElement.value.startsWith('0') && inputElement.value.length > 1) {
    inputElement.value = inputElement.value.replace(/^0+/, '');
    this.formInput[paramText] = inputElement.value;
  }
  let value = inputElement.value;
  // Limit to 2 digits after decimal
  // const regex = /^\d+(\.\d{0,2})?$/; // Matches numbers with up to 2 decimal places
  // if (!regex.test(value)) {
        let splitValue = value.split('.') // Remove the last character if invalid
        if (splitValue.length > 1) {
            value = splitValue[0] + (splitValue[1].length == 0 ? '' : '.' + splitValue[1].slice(0, splitValue[1].length > 2 ? 2 : splitValue[1].length))

        }
  // }

  inputElement.value = value;
  this.formInput[paramText] = value;
}

  validatebasic(basic: any) {
    if (!/^[1-9][0-9]*|0?\.[0-9]+|[0-9]+\.[0-9]+$/.test(basic)) {
      this.ShowAlert("Please Enter Valid Basic Salary","warning");
      setTimeout(() => {
        this.formInput.BasicSalary = 0;
        this.calculateGross()
        this.calculatePF();
        this.calculateESI();
    });
    } else {
      this.formInput.BasicSalary = basic;
      this.calculateGross()
      this.calculatePF();
      this.calculateESI();
    }
  }
    validateGross(event: any) {
      
    this.cdr.detectChanges()
    console.log(event);
    
      let setGrossParameters = () => {

       if (this.SalarySettingList) {

           console.log(this.SalarySettingList);

         if (this.SalarySettingList.isBasic) {
             if (this.SalarySettingList.isBasicAmount) {
                 this.formInput.BasicSalary = this.SalarySettingList.Basic;
             } else {
                 this.formInput.BasicSalary = this.formatNumber(event * (this.SalarySettingList["Basic"] / 100));
             }
           }

           if (this.SalarySettingList.isHRA) {
               if (this.SalarySettingList.isHRAAmount) {
                   this.formInput.HRA = this.SalarySettingList.HRA;
               } else {
                   this.formInput.HRA = this.formatNumber(event * (this.SalarySettingList["HRA"] / 100));
               }
           }

           if (this.SalarySettingList.isDA) {
               if (this.SalarySettingList.isDAAmount) {
                   this.formInput.DA = this.SalarySettingList.DA;
               } else {
                   this.formInput.DA = this.formatNumber(event * (this.SalarySettingList["DA"] / 100));
               }
           }


           if (this.SalarySettingList.isTA) {
               if (this.SalarySettingList.isTAAmount) {
                   this.formInput.TA = this.SalarySettingList.TA;
               } else {
                   this.formInput.TA = this.formatNumber(event * (this.SalarySettingList["TA"] / 100));
               }
           }


           if (this.SalarySettingList.isMA) {
               if (this.SalarySettingList.isMAAmount) {
                   this.formInput.MA = this.SalarySettingList.MA;
               } else {
                   this.formInput.MA = this.formatNumber(event * (this.SalarySettingList["MA"] / 100));
               }
           }

           if (this.SalarySettingList.isLTA) {
               if (this.SalarySettingList.isLTAAmount) {
                   this.formInput.LTA = this.SalarySettingList.LTA;
               } else {
                   this.formInput.LTA = this.formatNumber(event * (this.SalarySettingList["LTA"] / 100));
               }
           }


           if (this.SalarySettingList.isConveyance) {
               if (this.SalarySettingList.isConveyanceAmount) {
                   this.formInput.Conveyance = this.SalarySettingList.Conveyance;
               } else {
                   this.formInput.Conveyance = this.formatNumber(event * (this.SalarySettingList["Conveyance"] / 100));
               }
           }

           if (this.SalarySettingList.isFuelAllowance) {
               if (this.SalarySettingList.isFuelAllownceAmount) {
                   this.formInput.FuelAllowance = this.SalarySettingList.FuelAllowance;
               } else {
                   this.formInput.FuelAllowance = this.formatNumber(event * (this.SalarySettingList["FuelAllowance"] / 100));
               }
           }

           if (this.SalarySettingList.isWashingAllowance) {
               if (this.SalarySettingList.isWashingAllowanceAmount) {
                   this.formInput.WashingAllowance = this.SalarySettingList.WashingAllowance;
               } else {
                   this.formInput.WashingAllowance = this.formatNumber(event * (this.SalarySettingList["WashingAllowance"] / 100));
               }
           }

           if (this.SalarySettingList.isSpecialAllowance) {
               if (this.SalarySettingList.isSpecialAllowanceAmount) {
                   this.formInput.SpecialAllowance = this.SalarySettingList.SpecialAllowance;
               } else {
                   this.formInput.SpecialAllowance = this.formatNumber(event * (this.SalarySettingList["SpecialAllowance"] / 100));
               }
           }

           if (this.SalarySettingList.isBasicAndDA) {
               if (this.SalarySettingList.isBasicAndDAAmount) {
                   this.formInput.BasicAndDA = this.SalarySettingList.BasicAndDA;
               } else {
                   this.formInput.BasicAndDA = this.formatNumber(event * (this.SalarySettingList["BasicAndDA"] / 100));
               }
           }

           this.calculateGross();

      } else{
           this.formInput.BasicSalary = 0;
           this.formInput.HRA = 0;
           this.formInput.DA = 0;
           this.formInput.TA = 0;
           this.formInput.MA = 0;
           this.formInput.LTA = 0;
           this.formInput.Conveyance = 0;
           this.formInput.FuelAllowance = 0;
           this.formInput.WashingAllowance = 0;
           this.formInput.SpecialAllowance = 0;
           this.formInput.BasicAndDA = 0;

      }
     // this.validatebasic(this.formInput.BasicSalary);
    }

    if (!/^[1-9]\d*$/.test(event)) {
      this.ShowAlert("Please Enter Valid Gross","warning");
      setTimeout(() => {
        this.formInput.GrossSalary = 0; 
        setGrossParameters()
      });
    }else {
      setGrossParameters()
    }
  }

   validateCTC(event: any) {
    this.cdr.detectChanges()
    if(this.formInput.GrossSalary > 0){
    this.formInput.CTC= this.formInput.GrossSalary * 12;
    }

    
    


    
  }

validateHRA(value:any){
  if (!/^[1-9][0-9]*|0?\.[0-9]+|[0-9]+\.[0-9]+$/.test(value)) {
    this.ShowAlert("Please Enter Valid HRA","warning");
    setTimeout(() => {
      this.formInput.HRA = 0;
      this.calculateGross()
      this.calculateESI();
      this.calculatePF;
  });
  } else {
    this.formInput.HRA = value;
    this.calculateGross()
    this.calculateESI();
    this.calculatePF;
}
}
validateDA(value:any){
  if (!/^[1-9][0-9]*|0?\.[0-9]+|[0-9]+\.[0-9]+$/.test(value)) {
    this.ShowAlert("Please Enter Valid DA","warning");
    setTimeout(() => {
      this.formInput.DA = 0;
      this.calculateGross()
      this.calculateESI();
      this.calculatePF;
  });
  } else {
    this.formInput.DA = value;
    this.calculateGross()
    this.calculateESI();
    this.calculatePF;
}
}
validateTA(value:any){
  if (!/^[1-9][0-9]*|0?\.[0-9]+|[0-9]+\.[0-9]+$/.test(value)) {
    this.ShowAlert("Please Enter Valid TA","warning");
    setTimeout(() => {
      this.formInput.TA = 0;
      this.calculateGross()
      this.calculateESI();
      this.calculatePF;
  });
  } else {
    this.formInput.TA = value;
    this.calculateGross()
    this.calculateESI();
    this.calculatePF;
}
}
validateMA(value:any){
  if (!/^[1-9][0-9]*|0?\.[0-9]+|[0-9]+\.[0-9]+$/.test(value)) {
    this.ShowAlert("Please Enter Valid MA","warning");
    setTimeout(() => {
      this.formInput.MA = 0;
      this.calculateGross()
      this.calculateESI();
      this.calculatePF;
  });
  } else {
    this.formInput.MA = value;
    this.calculateGross()
    this.calculateESI();
    this.calculatePF;
}
}

validateLTA(value:any){
  if (!/^[1-9][0-9]*|0?\.[0-9]+|[0-9]+\.[0-9]+$/.test(value)) {
    this.ShowAlert("Please Enter Valid LTA","warning");
    setTimeout(() => {
      this.formInput.LTA = 0;
      this.calculateGross()
      this.calculateESI();
      this.calculatePF;
  });
  } else {
    this.formInput.LTA = value;
    this.calculateGross()
    this.calculateESI();
    this.calculatePF;
}
}

validateConveyance(value:any){
  if (!/^[1-9][0-9]*|0?\.[0-9]+|[0-9]+\.[0-9]+$/.test(value)) {
    this.ShowAlert("Please Enter Valid Conveyance","warning");
    setTimeout(() => {
      this.formInput.Conveyance = 0;
      this.calculateGross()
      this.calculateESI();
      this.calculatePF;
  });
  } else {
    this.formInput.Conveyance = value;
    this.calculateGross()
    this.calculateESI();
    this.calculatePF;
}
}
  validateother(event: any) {
  const inputChar = String.fromCharCode(event.keyCode || event.charCode);
  if (!/^\d+$/.test(inputChar)) {
      this.ShowAlert("Please Enter Valid Input","warning");
  {
        this.formInput.Allowances = "";
  }
  }
}
  validateesi(event: any) {
  const inputChar = String.fromCharCode(event.keyCode || event.charCode);
  if (!/^\d+$/.test(inputChar)) {
      this.ShowAlert("Please Enter Valid Input","warning");
  {
        this.formInput.ESI = "";
  }
  }
}
  validatepf(event: any) {
  const inputChar = String.fromCharCode(event.keyCode || event.charCode);
  if (!/^\d+$/.test(inputChar)) {
      this.ShowAlert("Please Enter Valid Input","warning");
  {
        this.formInput.PF = "";
  }
  }
}
  validateda(event: any) {
  const inputChar = String.fromCharCode(event.keyCode || event.charCode);
  if (!/^\d+$/.test(inputChar)) {
      this.ShowAlert("Please Enter Valid Input","warning");
  {
        this.formInput.DA = "";
  }
  }
}
  validatehra(event: any) {
  const inputChar = String.fromCharCode(event.keyCode || event.charCode);
  if (!/^\d+$/.test(inputChar)) {
      this.ShowAlert("Please Enter Valid Input","warning");
  {
        this.formInput.HRA = "";
  }
  }
}

validateaccountnumber(event:any)
{
  const inputChar = String.fromCharCode(event.keyCode || event.charCode);
  if (!/^\d+$/.test(inputChar)) {
  this.ShowAlert("Please Enter Valid Input","warning")
  this.formInput.AccountNumber.clear();
  }
}

validateoldsalary(event:any)
{
  const inputChar = String.fromCharCode(event.keyCode || event.charCode);
  if (!/^\d+$/.test(inputChar)) {
  this.ShowAlert("Please Enter Valid Input","warning")
  this.formInput.OldSalaryBalance.clear();
  }
}
validatefixedincentive(event:any)
{
  const inputChar = String.fromCharCode(event.keyCode || event.charCode);
  if (!/^\d+$/.test(inputChar)) {
  this.ShowAlert("Please Enter Valid Input","warning")
  this.formInput.FixedIncentive.clear();
  }
}
validatePSA(event:any)
{
  const inputChar = String.fromCharCode(event.keyCode || event.charCode);
  if (!/^\d+$/.test(inputChar)) {
  this.ShowAlert("Please Enter Valid Input","warning")
  this.formInput.PSA.clear();
  }
}

validatepaidleave(event:any){
  const inputChar = String.fromCharCode(event.keyCode || event.charCode);
  if (!/^\d+$/.test(inputChar)) {
  this.ShowAlert("Please Enter Valid Input","warning")
  this.formInput.NoOfPaidLeave.clear();
  }
}
validatePaidLeaveRange() {
  const value = this.formInput.NoOfPaidLeave;
  if (value > 365 && this.formInput.IsYearlyLeaves==true) {
    this.ShowAlert("Paid leaves should be between 1 to 365","warning");
    this.formInput.NoOfPaidLeave = 365;
  }
  if (value > 12 && this.formInput.IsYearlyLeaves==false) {
    this.ShowAlert("Paid leaves should be between 1 to 12","warning");
    this.formInput.NoOfPaidLeave = 12;
  }
}
validateESIRange() {
  const firstvalue = this.formInput.BasicSalary;
  const secondvalue = this.formInput.ESI;
  if (secondvalue > firstvalue) {
    this.ShowAlert("E.S.I Cannot Be Greater Than Salary","warning");
    this.formInput.ESI = null;
  }
  // else if(secondvalue >= 9999) {
  //   this.ShowAlert("ESI Cannot Be Greater Than 1000");
  //   // this.formInput.PF = null;
  // }
}
validatePFRange() {
  const firstvalue = this.formInput.BasicSalary;
  const secondvalue = this.formInput.PF;
  if (secondvalue > firstvalue) {
    this.ShowAlert("EPF Cannot Be Greater Than Salary","warning");
    this.formInput.PF = null;
  }
  // else if(secondvalue > 100000) {
  //   this.ShowAlert("EPF Cannot Be Greater Than 100000");
  //   // this.formInput.PF = null;
  // }
}
validatesickleave(event:any)
{
  const inputChar = String.fromCharCode(event.keyCode || event.charCode);
  if (!/^\d+$/.test(inputChar)) {
  this.ShowAlert("Please Enter Valid Input","warning")
  this.formInput.NoOfSickLeave.clear();
  }
}
validateSickLeaveRange() {
  const value = this.formInput.NoOfSickLeave;
  if (value > 365 && this.formInput.IsYearlyLeaves==true) {
    this.ShowAlert("Sick leaves should be between 1 to 365","warning");
    this.formInput.NoOfSickLeave = 365;
  }
  if (value > 12 && this.formInput.IsYearlyLeaves==false) {
    this.ShowAlert("Sick leaves should be between 1 to 12","warning");
    this.formInput.NoOfSickLeave = 12;
  }
}
validatesalaryadvance(event:any)
{
  const inputChar = String.fromCharCode(event.keyCode || event.charCode);
  if (!/^\d+$/.test(inputChar)) {
  this.ShowAlert("Please Enter Valid Input","warning")
  this.formInput.OldSalaryAdvance.clear();
  }
}

  validateloandue(event: any) {
  const inputChar = String.fromCharCode(event.keyCode || event.charCode);
  if (!/^\d+$/.test(inputChar)) {
      this.ShowAlert("Please Enter Valid Input","warning");
  this.formInput.LoanAdvanceBalance.clear();
  }
}
  validatededuction(event: any) {
  const inputChar = String.fromCharCode(event.keyCode || event.charCode);
  if (!/^\d+$/.test(inputChar)) {
      this.ShowAlert("Please Enter Valid Input","warning");
  this.formInput.Deduction.clear();
  }
}

  CheckDeduction(val: any) {
    if (
      this.formInput.LoanAdvanceBalance == null ||
      this.formInput.LoanAdvanceBalance == undefined ||
      this.formInput.LoanAdvanceBalance == ""
    ) {
  this.ShowAlert("Please Enter Loan Due First","warning");
  this.formInput.Deduction=0;
    } else {
      if (val > this.formInput.LoanAdvanceBalance) {
        this.ShowAlert(
          "Deduction Cannot be greater than Loan Due"
        ,"warning");
  this.formInput.Deduction=0;
}
}
}

CheckSDDeduction(val: any) {
  if (
    this.formInput.SecurityDeposit == null ||
    this.formInput.SecurityDeposit == undefined ||
    this.formInput.SecurityDeposit == "" || this.formInput.SecurityDeposit==0
  ) {
this.ShowAlert("Please Enter Security Deposit First","warning");
this.formInput.SDmonthlydeduction=0;
  } else {
    if (val > this.formInput.SecurityDeposit && this.IsPercentageselected==false) {
      this.ShowAlert(
        "Deduction Cannot be greater than security deposit amount"
      ,"warning");
this.formInput.SDmonthlydeduction=0;
}
if (val > 100 && this.IsPercentageselected==true) {
  this.ShowAlert(
    "Deduction % Cannot be greater than 100"
  ,"warning");
this.formInput.SDmonthlydeduction=0;
}
      if (val > this.formInput.GrossSalary) {
        this.ShowAlert(
          "Deduction Cannot be greater than gross salary"
        ,"warning");
  this.formInput.SDmonthlydeduction=0;
  }
}
}

updateProofList(){
    this.ProofList = [];
  for (let i = 0; i < this.originalProofList.length; i++) {
      const proof = this.originalProofList[i];
      proof["disabled"] = true;
      console.log(
        this.formInput.Proof1,
        proof.Value,
        this.formInput.Proof2,
        proof.Value,
        this.formInput.Proof1 != proof.Value &&
          this.formInput.Proof2 != proof.Value
      );
      if (
        this.formInput.Proof1 != proof.Value &&
        this.formInput.Proof2 != proof.Value
      ) {
        proof["disabled"] = false;
    }
      this.ProofList.push(proof);
  }
  console.log(this.ProofList.map((a:any)=>a.disabled));
}

  OnProofISelection(selectedValue: any) {
    const selectedtype = this.ProofList.find((state: { Value: any; }) => state.Value ===parseInt(selectedValue.value));
    if (selectedtype) {
      this.ProofIPlaceHolder=selectedtype.Key;
      this.isProofType1Selected=true;
    }
this.formInput.ProofID1 = ''
this.updateProofList()
}
OnProofIISelection(selectedValue: any) {
  const selectedtype = this.ProofList.find((state: { Value: any; }) => state.Value ===parseInt(selectedValue.value));
  if (selectedtype) {
    this.ProofIIPlaceHolder=selectedtype.Key;
    this.isProofType2Selected=true;
  }
this.formInput.ProofID2 = ''
this.updateProofList()
}
OnProofIIISelection(selectedValue: any) {
  const selectedtype = this.ProofList.find((state: { Value: any; }) => state.Value ===parseInt(selectedValue.value));
  if (selectedtype) {
    this.ProofIIIPlaceHolder=selectedtype.Key;
    this.isProofType3Selected=true;
  }
this.formInput.ProofID3 = ''
this.updateProofList()
}

  OnDesignationSelection(event: any) {
  var ID=event.target.Value;
}


clearAllDetails(){
  window.location.reload();

  // this.formInput.FirstName = ""
  // this.formInput.LastName = ""
  // this.formInput.MobileNumber = ""
  // this.formInput.Email = ""
  // this.formInput.DateOfJoining = ""
  // this.formInput.OfficeStartTime = ""
  // this.formInput.OfficeEndTime = ""
  // this.formInput.Password = ""
  // this.formInput.ConfirmPassword = ""
  // this.formInput.State = ""
  // this.formInput.City = ""
  // this.formInput.Address = ""
  // this.formInput.Proof1 = ""
  // this.formInput.ProofID1 = ""
  // this.formInput.Proof2 = ""
  // this.formInput.ProofID2 = ""
  // this.formInput.IsPerday = ""
  // this.formInput.IsSundayOff = ""
  // this.formInput.IsMondayOff = ""
  // this.formInput.IsTuesdayOff = ""
  // this.formInput.IsWednesdayOff = ""
  // this.formInput.IsThursdayOff = ""
  // this.formInput.IsFridayOff = ""
  // this.formInput.IsSaturdayOff = ""
  // this.formInput.NoOfPaidLeave = ""
  // this.formInput.NoOfSickLeave = ""
  // this.formInput.GrossSalary = ""
  // this.formInput.GrossSalary = ""
  // this.formInput.BasicSalary = ""
  // this.formInput.HRA = ""
  // this.formInput.DA = ""
  // this.formInput.OldSalaryBalance = ""
  // this.formInput.OldSalaryAdvance = ""
  // this.formInput.LoanAdvanceBalance = ""
  // this.formInput.Deduction = ""
  // this.formInput.Deduction = ""
  // this.formInput.ESI = ""
  // this.formInput.PF = ""
  // this.formInput.TA = ""
  // this.formInput.MA = ""
  // this.formInput.Proofs = []

  // this.selectedBranch = []
  // this.selectedDepartmentid = null
}

showSuccessDialog(){
  this.spinnerService.hide();
    this.dialog
      .open(SuccessDialogComponent, {
    disableClose: true,
        data: {
          title: "Congratulations",
          subTitle: "Employee has been created successfully",
        },
      })
      .afterClosed()
      .subscribe((res: any) => {
    // if(res){
             this.spinnerService.show();
             window.location.reload();
    // }
      });
}
validateOfficeEndTimings(endTime: string): boolean {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

  const startTime = this.formInput.OfficeStartTime;

  // Validate format
  if (timeRegex.test(startTime) && timeRegex.test(endTime))
     {
        // Convert to Date objects (same day, only time is compared)
  const today = new Date().toDateString();
  const start = new Date(`${today} ${startTime}`);
  const end = new Date(`${today} ${endTime}`);
      if (end <= start) {
        this.ShowAlert("OfficeEndTime should be greater than OfficeStartTime.", "warning");
        this.formInput.OfficeEndTime = "";
        setTimeout(() => {
          this.formInput.OfficeEndTime = null;
        });
        return false;
      }
  }
  return true;
}

// validateOfficeEndTimings(endTime: any):boolean {
//   if (endTime < this.formInput.OfficeStartTime) {
//   this.ShowAlert("OfficeEndTime Should Be Greater Than OfficeStartTime","warning")
//   this.formInput.OfficeEndTime = ""
//   setTimeout(() => {
//     this.formInput.OfficeEndTime = null;
//   });
//   return false
//   } else {
//     return true
//   }
// }
validateOfficeStartTimings(startTime:any){
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

  const endTime = this.formInput.OfficeEndTime;

  // Validate format
  if (timeRegex.test(startTime) && timeRegex.test(endTime))
     {
        // Convert to Date objects (same day, only time is compared)
  const today = new Date().toDateString();
  const start = new Date(`${today} ${startTime}`);
  const end = new Date(`${today} ${endTime}`);
      if (end <= start) {
        this.ShowAlert("OfficeEndTime should be greater than OfficeStartTime.", "warning");
        this.formInput.OfficeEndTime = "";
        setTimeout(() => {
          this.formInput.OfficeEndTime = null;
        });
        return false;
      }
  }
  return true;
}

formatTimeToSeconds() {
  if (this.formInput.OfficeStartTime) {
    this.formInput.OfficeStartTime = this.formInput.OfficeStartTime + ":00";
  }
  if (this.formInput.OfficeEndTime) {
    this.formInput.OfficeEndTime = this.formInput.OfficeEndTime + ":00";
  }
}
  SaveEmployee() {
  // this.formatTimeToSeconds();
  if (!this.validateProofID1()) {
    return;
  }
  if (!this.validateProofID2()) {
    return;
  }
  if (!this.validateProofID3()) {
    return;
  }
  console.log(this.formInput.MobileNumber);
  // this.formInput.Proofs=this.ProofClass;
  this.formInput.CityID=this.selectedCityId;
  // this.formInput.OfficeStartTime =`{:00}` 
  this.formInput.Proofs = [
    {
        ProofTypeID: this.formInput.Proof1,
        FrontImageUrl:this.ProofImage1,
        BackImageUrl:this.ProofImage2,
        ProofNumber: this.formInput.ProofID1,
    },
    {
        ProofTypeID: this.formInput.Proof2,
        FrontImageUrl:this.ProofImage3,
        BackImageUrl:this.ProofImage4,
        ProofNumber: this.formInput.ProofID2,
      },
      ]
      
    //  let trainerid = this.selectedTrainer.map(res => res.ID)[0] || 0;
     let trainings=this.selectedTrainer.length>0? this.selectedTrainer.map((br: any) => {
        return {
          TrainingID: br.TrainingId,
        };
      }):[];
      this.formInput.Trainings=trainings;
  this.spinnerService.show();
    this._commonservice
      .ApiUsingPost("Account/CreateEmployee", this.formInput)
      .subscribe(
        (data) => {
      if(data.Status==true){
       this.spinnerService.hide();
        // this.ShowAlert("Employee Created Successfully","success");
            try {
          this.tempcredarray=[];
              this.tempcredarray.push({
                FirstName: this.formInput.FirstName,
                LastName: this.formInput.LastName,
                MobileNumber: this.formInput.MobileNumber,
                EmployeeID: data.EmployeeID,
                Password: this.formInput.Password,
              });
              this.dialog.open(SendwhatsappmsgComponent, {
                data: { empid:this.formInput.EmployeeId,empname:this.formInput.FirstName } 
             }).afterClosed().subscribe(res=>{
               this.showSuccessDialog();
             })
          }catch{}

          return true;
          } else {
         this.spinnerService.hide();
       this.ShowAlert(data.Message,"warning");
          return false;
       }
        },
        (error: any) => {
     this.spinnerService.hide();
     this.ShowAlert(error.message,"error");
     return false;
    }
    );
}

  ValidateAll() {
    this.isSubmit=true;
 
    this.formInput.BranchID = this.selectedbranchid;
    this.formInput.DepartmentID = this.selectedDepartmentid;
    if(this.selectedbranchid==0 || this.selectedbranchid=='0')
    {
      this.ShowAlert(
        "Please Select Branch","warning"
        );
        this.spinnerService.hide();
      return
    }
    else if(this.selectedDepartmentid==0 || this.selectedDepartmentid=='0')
      {
        this.ShowAlert(
          "Please Select Department","warning"
        );
        this.spinnerService.hide();
        return
      }
   else if (
      this.formInput.FirstName == "" ||
      this.formInput.FirstName == null ||
      this.formInput.FirstName == undefined
    ) {
    // this.ShowAlert("Please Enter FirstName","warning");
    return false;
    } else if (
      this.formInput.MobileNumber == "" ||
      this.formInput.MobileNumber == null ||
      this.formInput.MobileNumber == undefined
    ) {
      // this.ShowAlert(
      //   "Please Enter 10 digit Mobile Number...!"
      // ,"warning");
    return false;
    } else if (
      this.formInput.DateOfJoining == "" ||
      this.formInput.DateOfJoining == null ||
      this.formInput.DateOfJoining == undefined
    ) {
    // this.ShowAlert("Please Enter DateOfJoining","warning");
    // this.spinnerService.hide();
    return false;
    }
    //  else if (
    //   this.formInput.OfficeStartTime == "" ||
    //   this.formInput.OfficeStartTime == null ||
    //   this.formInput.OfficeStartTime == undefined
    // ) {
    // // this.ShowAlert("Please Enter OfficeStartTime","warning");
    // // this.spinnerService.hide();
    // return false;
    // } else if (
    //   this.formInput.OfficeEndTime == "" ||
    //   this.formInput.OfficeEndTime == null ||
    //   this.formInput.OfficeEndTime == undefined
    // ) {
    // this.ShowAlert("Please Enter OfficeEndTime","warning");
    // this.spinnerService.hide();
    // return false;
    // } 
    else {
  const digitCount: number = this.formInput.MobileNumber.toString().length;
  if(digitCount<10)    {
        this.ShowAlert(
          "Mobile number must have at least 10 digits","warning"
      );
      this.spinnerService.hide();
    return false;
  }else{
    this.formInput.AlternateMobileNumber=this.formInput.MobileNumber;
    this.mail="Ok";
        if (
          this.formInput.Email != "" &&
          this.formInput.Email != null &&
          this.formInput.Email != undefined
        ) {
       this.mail=this.validateEmail(this.formInput.Email);
     }
        if (this.mail != "Ok") {
            this.ShowAlert("Please Enter Valid Email ID", "warning");
            this.spinnerService.hide();
      return false;
        } else console.log(this.formInput.MobileNumber);
        this.ApiURL =
          "Account/CheckDuplicateMobile?Mobile=" + this.formInput.MobileNumber;
         this.spinnerService.show();
        this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(
          (res: any) => {
            if (res.Status == true) {
              if (res.MobileExist != true) {
                if (
                  this.formInput.Email != "" &&
                  this.formInput.Email != null &&
                  this.formInput.Email != undefined
                ) {
                  this.ApiURL =
                    "Account/CheckDuplicateEmail?Email=" + this.formInput.Email;
                  this._commonservice
                    .ApiUsingGetWithOneParam(this.ApiURL)
                    .subscribe(
                        (rest: any) => {
                            this.spinnerService.hide();
                        if (rest.Status == true) {
                          if (rest.EmailExist != true) {
                            if (
                              this.formInput.BranchID == "" ||
                              this.formInput.BranchID == null ||
                              this.formInput.BranchID == undefined
                            ) {
                              this.ShowAlert(
                                "Please Select Branch","warning"
                                );
                                this.spinnerService.hide();
                              return false;
                            } else if (
                              this.formInput.DepartmentID == "" ||
                              this.formInput.DepartmentID == null ||
                              this.formInput.DepartmentID == undefined
                            ) {
                              this.ShowAlert(
                                "Please Select Department","warning"
                                );
                                this.spinnerService.hide();
                              return false;
                            } else if (
                              this.formInput.Password == "" ||
                              this.formInput.Password == null ||
                              this.formInput.Password == undefined
                            ) {
    //                           this.ShowAlert(
    //                             "Please Enter Password","warning"
    //                           );
    // this.spinnerService.hide();
    return false;
                            } else if (
                              this.formInput.ConfirmPassword == "" ||
                              this.formInput.ConfirmPassword == null ||
                              this.formInput.ConfirmPassword == undefined 
                            ) {
    //                           this.ShowAlert(
    //                             "Please Enter Confirm Password","warning"
    //                           );
    // this.spinnerService.hide();
    return false;
                            }  else if (this.formInput.Password.length < 6){
                              // this.ShowAlert("Password must be at least 6 characters","warning")
                              // this.spinnerService.hide();
                              return false;
                            }  
                            else if (
                              this.formInput.Password !=
                              this.formInput.ConfirmPassword
                            ) {
                              this.ShowAlert(
                                "Password and Confirm Password doesn't match","warning"
                              );
    this.spinnerService.hide();
    return false;
                            }
                            
                            else if (
                              this.formInput.IsPerday != true &&
                              this.formInput.IsPerday != false
                            ) {
                              this.ShowAlert(
                                "Please Select Salary Type","warning"
                              );
        this.spinnerService.hide();
        return false;
      } 
    //  else if (this.formInput.GrossSalary == ""||this.formInput.GrossSalary==null ||this.formInput.GrossSalary==undefined) {
    //     this.ShowAlert("Please Enter Gross Salary");
    //     this.spinnerService.hide();
    //     return false;
    //   } 
                            else if (
                              this.formInput.BasicSalary == "" ||
                              this.formInput.BasicSalary == null ||
                              this.formInput.BasicSalary == undefined
                            ) {
                              // this.ShowAlert(
                              //   "Please Enter Basic Salary","warning"
                              // );
        this.spinnerService.hide();
        return false;
                            }
                            
                            else if (this.formInput.SecurityDeposit>0 &&this.formInput.SDmonthlydeduction==0) {
                              this.ShowAlert( "Please enter security deposit deduction","warning" );
        this.spinnerService.hide();
        return false;
      } 
      else if (this.formInput.SecurityDeposit>0 &&this.formInput.SDmonthlydeduction>this.formInput.SecurityDeposit) {
        this.ShowAlert( "Security deposit deduction should be lesser than actual amount","warning" );
this.spinnerService.hide();
return false;
} 
                            else {
        if(this.formInput.IsPerday==true){
          this.formInput.IsSundayOff=false;
          this.formInput.IsMondayOff=false;
          this.formInput.IsTuesdayOff=false;
          this.formInput.IsWednesdayOff=false;
          this.formInput.IsThursdayOff=false;
          this.formInput.IsFridayOff=false;
          this.formInput.IsSaturdayOff=false;
        }
        this.SaveEmployee();
        return true;
       }
                          } else {
    this.ShowAlert(rest.Message,"warning");
    this.formInput.Email == "";
    return false;
  }
                        } else {
                          this.ShowAlert(
                            "Failed to validate Duplicate Email","warning"
                          );
    return false;
  }
                      },
                      (error) => {
      this.spinnerService.hide();
      this.ShowAlert(error.message,"error");
  }
                    );
                } else {
                  if (
                    this.formInput.BranchID == "" ||
                    this.formInput.BranchID == null ||
                    this.formInput.BranchID == undefined
                  ) {
                      this.ShowAlert("Please Select Branch", "warning");
                      this.spinnerService.hide();
      return false;
                  }
                  if (
                    this.formInput.DepartmentID == "" ||
                    this.formInput.DepartmentID == null ||
                    this.formInput.DepartmentID == undefined
                  ) {
                      this.ShowAlert("Please Select DepartmentID", "warning");
                      this.spinnerService.hide();
      return false;
                  }
                   else if (
                    this.formInput.Password == "" ||
                    this.formInput.Password == null ||
                    this.formInput.Password == undefined
                  ) {
                      this.ShowAlert("Please Enter Password", "warning");

    this.spinnerService.hide();
    return false;
                  } else if (
                    this.formInput.ConfirmPassword == "" ||
                    this.formInput.ConfirmPassword == null ||
                    this.formInput.ConfirmPassword == undefined
                  ) {
                    this.ShowAlert(
                      "Please Enter Confirm Password","warning"
                    );
    this.spinnerService.hide();
    return false;
                  } else if (
                    this.formInput.Password != this.formInput.ConfirmPassword
                  ) {
                    this.ShowAlert(
                      "Password and Confirm Password doesn't match","warning"
                    );
    this.spinnerService.hide();
    return false;
                  } else if (
                    this.formInput.IsPerday != true &&
                    this.formInput.IsPerday != false
                  ) {
                    this.ShowAlert(
                      "Please Select Salary Type","warning"
                    );
        this.spinnerService.hide();
        return false;
      } 
    //  else if (this.formInput.GrossSalary == ""||this.formInput.GrossSalary==null ||this.formInput.GrossSalary==undefined) {
    //     this.ShowAlert("Please Enter Gross Salary");
    //     this.spinnerService.hide();
    //     return false;
    //   } 
                  else if (
                    this.formInput.GrossSalary == "" ||
                      this.formInput.GrossSalary == null ||
                      this.formInput.GrossSalary == undefined
                  ) {
                    this.ShowAlert(
                      "Please Enter  Salary","warning"
                    );
        this.spinnerService.hide();
        return false;
                  } else {
        if(this.formInput.IsPerday==true){
          this.formInput.IsSundayOff=false;
          this.formInput.IsMondayOff=false;
          this.formInput.IsTuesdayOff=false;
          this.formInput.IsWednesdayOff=false;
          this.formInput.IsThursdayOff=false;
          this.formInput.IsFridayOff=false;
          this.formInput.IsSaturdayOff=false;
        }
        this.SaveEmployee();
        return true;
       }
  }
              } else {
  this.ShowAlert(res.Message,"error");
  return false;
}
return false;
            } else {
  console.log(this.formInput.MobileNumber);
              this.ShowAlert(
                "Failed to validate Duplicate MobileNumber","warning"
              );
return false;
}
          },
          (error) => {
  this.spinnerService.hide();
  this.ShowAlert(error.message,"error");
  return false;
}
        );
      }
console.log(this.formInput.MobileNumber);
console.log("--------------------");
  return true;
   }
}

validatesddue(event: any) {
  const inputChar = String.fromCharCode(event.keyCode || event.charCode);
  if (!/^\d+$/.test(inputChar)) {
    // this.globalToastService.warning("Please Enter Valid Input")
    this.ShowAlert("Please Enter Valid Input", "warning")
    this.formInput.SecurityDeposit.clear();
  }
}
validatesddeduction(event: any) {
  const inputChar = String.fromCharCode(event.keyCode || event.charCode);
  if (!/^\d+$/.test(inputChar)) {
    // this.globalToastService.warning("Please Enter Valid Input")
    this.ShowAlert("Please Enter Valid Input", "warning")
    this.formInput.SDmonthlydeduction.clear();
  }
  else
  {
    if (this.formInput.SDmonthlydeduction > 100 &&  this.IsPercentageselected==true) {
      this.ShowAlert(
        "Deduction % Cannot be greater than 100"
      ,"warning");
    this.formInput.SDmonthlydeduction=0;
    }
  }
 
}

  ValidateProfession() {
  // if (this.formInput.BranchID == "" ||this.formInput.BranchID ==null||this.formInput.BranchID ==undefined) {
  //     this.ShowAlert("Please Select Branch");
  //     return false;
  //    }
  //     else if (this.formInput.Password == ""||this.formInput.Password==null ||this.formInput.Password==undefined) {
  //   this.ShowAlert("Please Enter Password");
  //   this.spinnerService.hide();
  //   return false;
  // }
  // else if (this.formInput.ConfirmPassword == ""||this.formInput.ConfirmPassword==null ||this.formInput.ConfirmPassword==undefined) {
  //   this.ShowAlert("Please Enter Confirm Password");
  //   this.spinnerService.hide();
  //   return false;
  // }
  // else if (this.formInput.Password != this.formInput.ConfirmPassword) {
  //   this.ShowAlert("Password and Confirm Password doesn't match");
  //   this.spinnerService.hide();
  //   return false;
  // }
  //    else{
      return true;
    //  }
}

  ValidateProfile() {
  // if (this.formInput.FirstName == "" ||this.formInput.FirstName==null ||this.formInput.FirstName==undefined) {
  //   this.ShowAlert("Please Enter FirstName");
  //   this.spinnerService.hide();
  //   return false;
  // }  
  // else if (this.formInput.MobileNumber == ""||this.formInput.MobileNumber==null ||this.formInput.MobileNumber==undefined) {
  //   this.ShowAlert("Please Enter 10 digit Mobile Number...!");
  //   this.spinnerService.hide();
  //   return false;
  // }
  // else if (this.formInput.DateOfJoining == ""||this.formInput.DateOfJoining==null ||this.formInput.DateOfJoining==undefined) {
  //   this.ShowAlert("Please Select DateOfJoining...!");
  //   this.spinnerService.hide();
  //   return false;
  // }
  // else if (this.formInput.BranchID == "" ||this.formInput.BranchID ==null||this.formInput.BranchID ==undefined) {
  //   this.ShowAlert("Please Select Branch");
  //   return false;
  // }
  // else if (this.formInput.DepartmentID == "" ||this.formInput.DepartmentID ==null||this.formInput.DepartmentID ==undefined) {
  //   this.ShowAlert("Please Select Department");
  //   return false;
  // }
  // else if (this.formInput.RoleID == "" ||this.formInput.RoleID ==null||this.formInput.RoleID ==undefined) {
  //   this.ShowAlert("Please Select Role");
  //   return false;
  // }
  // else if (this.formInput.DesignationID == "" ||this.formInput.DesignationID ==null||this.formInput.DesignationID ==undefined) {
  //   this.ShowAlert("Please Select Designation");
  //   return false;
  // }

  // else if (this.formInput.Email == ""||this.formInput.Email==null ||this.formInput.Email==undefined) {
  //   this.ShowAlert("Please Enter EmailID");
  //   this.spinnerService.hide();
  //   return false;
  // }
  // else if (this.formInput.EmergencyNumber == ""||this.formInput.EmergencyNumber==null ||this.formInput.EmergencyNumber==undefined) {
  //   this.ShowAlert("Please Enter Emergency Number");
  //   this.spinnerService.hide();
  //   return false;
  // }
  // else if (this.formInput.Gender == ""||this.formInput.Gender==null ||this.formInput.Gender==undefined) {
  //   this.ShowAlert("Please Select Gender");
  //   this.spinnerService.hide();
  //   return false;
  // }
  // else if (this.formInput.Password == ""||this.formInput.Password==null ||this.formInput.Password==undefined) {
  //   this.ShowAlert("Please Enter Password");
  //   this.spinnerService.hide();
  //   return false;
  // }
  // else if (this.formInput.ConfirmPassword == ""||this.formInput.ConfirmPassword==null ||this.formInput.ConfirmPassword==undefined) {
  //   this.ShowAlert("Please Enter Confirm Password");
  //   this.spinnerService.hide();
  //   return false;
  // }
  // else if (this.formInput.Password != this.formInput.ConfirmPassword) {
  //   this.ShowAlert("Password and Confirm Password doesn't match");
  //   this.spinnerService.hide();
  //   return false;
  // }
  // else if (this.formInput.StateID == ""||this.formInput.StateID ==null||this.formInput.StateID ==undefined) {
  //   this.ShowAlert("Please Select State");
  //   return false;
  // }
  // else if (this.formInput.CityID == ""||this.formInput.CityID ==null || this.formInput.CityID==undefined) {
  //   this.ShowAlert("Please Select City");
  //   return false;
  // }
//   else
//   {
//     const digitCount: number = this.formInput.MobileNumber.toString().length;
//     if(digitCount<10)    {
//       this.ShowAlert("Mobile number must have at least 10 digits");
//       return false;
//     }else{
//       this.formInput.AlternateMobileNumber=this.formInput.MobileNumber;
//       this.mail="Ok";
//       if (this.formInput.Email != ""&&this.formInput.Email!=null &&this.formInput.Email!=undefined)
//        {
//          this.mail=this.validateEmail(this.formInput.Email);
//        }
//       if(this.mail!="Ok") 
//       {this.ShowAlert("Please Enter Valid Email ID"); 
//       return false; }
//       else
//      // {
//   //       const emdigit: number = this.formInput.EmergencyNumber.toString().length;
//   //       if(emdigit<10) 
//   //          {
//   //         this.ShowAlert("Gaurdian number must have at least 10 digits");
//   //         return false;
//   //       }
//   //       else
//   //       {

//   this.ApiURL="Account/CheckDuplicateMobile?Mobile="+this.formInput.MobileNumber;
//   this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((res:any) => {
// if(res.Status==true)
// {
//   if(res.MobileExist!=true)
//   {
//     if (this.formInput.Email == ""||this.formInput.Email==null ||this.formInput.Email==undefined)
//     {
//       this.ApiURL="Account/CheckDuplicateEmail?Email="+this.formInput.Email;
//       this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((rest:any) => {
//     if(rest.Status==true)
//     {
//       if(rest.EmailExist!=true)
//     {
//       return true;
//     }
//     else{
//       this.ShowAlert(res.Message);
//       return false;
//     }
//     }
//     else{
//       this.ShowAlert("Failed to validate Duplicate Email");
//       return false;
//     }
//       }, (error) => {
//         this.spinnerService.hide();
//         this.ShowAlert(error.message);
//       });
//     }
//     else
//     {
      // this.formInput.Email == "";
      // this.ShowProfile=false;
      // this.ShowLoan=false;
      // this.ShowProof=false;
      // this.ShowSalary=false;
      // this.ShowBank=false;
      // this.ShowProfession=true;
      // this.ProfessionClass="nav-link active";
      // this.ProfileClass="nav-link";
      // this.PrfClass="nav-link";
      // this.BankClass="nav-link";
      // this.LoanClass="nav-link";
      // this.SalaryClass="nav-link";
//     }

//   }
//   else{
//     this.ShowAlert(res.Message);
//     return false;
//   }
//   return false;
// }
// else{
//   this.ShowAlert("Failed to validate Duplicate MobileNumber");
//   return false;
// }
//   }, (error) => {
//     this.spinnerService.hide();
//     this.ShowAlert(error.message);
//     return false;
//   });
//     }
    return true;
    //  }
  //   }
  // }
}
  ValidateBank() {
//   if (this.formInput.AccountName == ""||this.formInput.AccountName==null ||this.formInput.AccountName==undefined) {
//     this.ShowAlert("Please Enter Account Name");
//     this.spinnerService.hide();
//     return false;
//   } 
//  else if (this.formInput.AccountNumber == ""||this.formInput.AccountNumber==null ||this.formInput.AccountNumber==undefined) {
//     this.ShowAlert("Please Enter Account Number");
//     this.spinnerService.hide();
//     return false;
//   } 
//   else if (this.formInput.Bank == ""||this.formInput.Bank==null ||this.formInput.Bank==undefined) {
//     this.ShowAlert("Please Enter Bank Name");
//     this.spinnerService.hide();
//     return false;
//   } 
//   else if (this.formInput.IFSC == ""||this.formInput.IFSC==null ||this.formInput.IFSC==undefined) {
//     this.ShowAlert("Please Enter Proof-I ID");
//     this.spinnerService.hide();
//     return false;
//   } 
//   else if (this.formInput.Branch == ""||this.formInput.Branch==null ||this.formInput.Branch==undefined) {
//     this.ShowAlert("Please Enter Proof-I ID");
//     this.spinnerService.hide();
//     return false;
//   } 
//   else if (this.formInput.UPIID == ""||this.formInput.UPIID==null ||this.formInput.UPIID==undefined) {
//     this.ShowAlert("Please Enter Proof-I ID");
//     this.spinnerService.hide();
//     return false;
//   } 
//   else
//   {
    // var Validateifsc=this.validateIFSC(this.formInput.IFSC)
    // if(this.formInput.IFSC==null||this.formInput.IFSC==""||this.formInput.IFSC==undefined)
    // {
    //   Validateifsc="Ok";
    // }
    // if(Validateifsc!="Ok")    {
    //   this.ShowAlert("InValid IFSC Code");
    //   return false;
    // }else
    // {

    //   var ValidateupiID=this.validateUPIID(this.formInput.UPIID)
    //   if(this.formInput.UPIID==null||this.formInput.UPIID==" "||this.formInput.UPIID==undefined)
    //   {
    //     ValidateupiID="Ok";
    //   }
    //   if(ValidateupiID!="Ok")    {
    //     this.ShowAlert("InValid Upi ID");
    //     return false;
    //   }else{
  //     }
  //   }
  // }
}
  ValidateSalary() {
//   if (this.formInput.IsPerday !=true &&this.formInput.IsPerday!=false) {
//     this.ShowAlert("Please Select Salary Type");
//     this.spinnerService.hide();
//     return false;
//   } 
//  else if (this.formInput.GrossSalary == ""||this.formInput.GrossSalary==null ||this.formInput.GrossSalary==undefined) {
//     this.ShowAlert("Please Enter Gross Salary");
//     this.spinnerService.hide();
//     return false;
//   } 
//  else if (this.formInput.BasicSalary == ""||this.formInput.BasicSalary==null ||this.formInput.BasicSalary==undefined) {
//     this.ShowAlert("Please Enter Basic Salary");
//     this.spinnerService.hide();
//     return false;
//   }
//   else
//   {
//     if(this.formInput.IsPerday==true){
//       this.formInput.IsSundayOff=false;
//       this.formInput.IsMondayOff=false;
//       this.formInput.IsTuesdayOff=false;
//       this.formInput.IsWednesdayOff=false;
//       this.formInput.IsThursdayOff=false;
//       this.formInput.IsFridayOff=false;
//       this.formInput.IsSaturdayOff=false;
//     }
    return true;
  //  }
}

  ValidateProof() {
//   if (this.formInput.Proof1 == ""||this.formInput.Proof1==null ||this.formInput.Proof1==undefined) {
//     this.ShowAlert("Please Select Proof-I");
//     this.spinnerService.hide();
//     return false;
//   } 
//  else if (this.formInput.ProofID1 == ""||this.formInput.ProofID1==null ||this.formInput.ProofID1==undefined) {
//     this.ShowAlert("Please Enter Proof-I ID");
//     this.spinnerService.hide();
//     return false;
//   } 
//   else if (this.formInput.Proof1 == this.formInput.Proof2) {
//     this.ShowAlert("Proof-I and Proof-II cannot be same");
//     this.spinnerService.hide();
//     return false;
//   }
//   else if (this.formInput.Proof2 == ""||this.formInput.Proof2==null ||this.formInput.Proof2==undefined) {
//     this.ShowAlert("Please Select Proof-II");
//     this.spinnerService.hide();
//     return false;
//   } 
//  else if (this.formInput.ProofID2 == ""||this.formInput.ProofID2==null ||this.formInput.ProofID2==undefined) {
//     this.ShowAlert("Please Enter Proof-II ID");
//     this.spinnerService.hide();
//     return false;
//   } 
//   else if (this.formInput.ProofID2 == this.formInput.ProofID1) {
//     this.ShowAlert("Proof-I and Proof-II Number cannot be same");
//     this.spinnerService.hide();
//     return false;
//   }
//   else
//   {
//     if(this.ProofImage1!=null && this.ProofImage2!=null && this.ProofImage2!=" " && this.ProofImage1!=" ")
//     {
//       let customObj = new Proof();
//       customObj.ProofTypeID=this.formInput.Proof1; 
//       customObj.FrontImage=this.ProofImage1; 
//       customObj.BackImage=this.ProofImage2; 
//       customObj.ProofNumber=this.formInput.ProofID1;   
//       this.ProofClass.push(customObj);
//     }
//     if(this.ProofImage3!=null && this.ProofImage4!=null && this.ProofImage3!=" " && this.ProofImage4!=" ")
//     {
//       let customObj = new Proof();
//       customObj.ProofTypeID=this.formInput.Proof2; 
//       customObj.FrontImage=this.ProofImage3; 
//       customObj.BackImage=this.ProofImage4;  
//       customObj.ProofNumber=this.formInput.ProofID2;   
//       this.ProofClass.push(customObj);
//     }
return true;
  //  }
}

  LoanBack() {
}

  ProofBack() {
}

  ProfessionBack() {
}

  BankBack() {
}

  SalaryBack() {
}

  CheckDateNew(date: any) {
 this.ApiURL="Admin/CheckDate?UserDate="+date;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(
      (data) => {
  if(data.Status!=true){
    this.spinnerService.hide();
       return true;
        } else {
      this.spinnerService.hide();
          this.ShowAlert(
            "Date should be greater than Current Date","warning"
          );
          this.formInput.StartDate = "";
       return false;
    }
      },
      (error: any) => {
  this.spinnerService.hide();
  return false;
 }
 );
}

getData1(List:any): void {
  let tmp = [];
  for (let i = 0; i < List.length; i++) {
    tmp.push({ id: List[i].id, text: List[i].text });
  }
  this.OriginalDepartmentList = tmp;
  this.DeptColumns = tmp;
}

onselectedBranchesDeSelectAll() {
  this.selectedBranches=[];
  this.chips=[];
    this.addChip(
      `From Date: ${moment(this.formInput.FromDate).format("MMMM Do YYYY")}`
    );
    this.addChip(
      `To Date: ${moment(this.formInput.ToDate).format("MMMM Do YYYY")}`
    );
  this.GetDepartments();
}

addChip(value: string) {
    const existingIndex = this.chips.findIndex((chip) =>
      chip.startsWith(value.split(":")[0])
    );
  if (existingIndex >= 0) {
    this.chips[existingIndex] = value;
  } else {
    this.chips.push(value);
  }
}



GetDepartments() {
  this.selectedDepartment=[];
  this.selectedDepartments=[];
  const json={
    AdminID:this.UserID,
      OrgID: this.OrgID,
      Branches: this.selectedBranch.map((br: any) => {
        return {
          id: br.Value,
        }
      }),
    }
    this._commonservice.ApiUsingPost("Portal/GetEmployeeDepartments", json).subscribe(
      (data) => {
    console.log(data);
        this.DeptColumns = data.DepartmentList;
      },
      (error) => {
        this.ShowAlert(error,"error");
        console.log(error);
}
    );
  }

GetRegDepartments(BranchID:any) {
    if (BranchID == null || BranchID == "undefined") {
      BranchID = 0;
    }
    this.ApiURL =
      "Portal/GetBranchWiseDepartments?BranchID=" +
      BranchID +
      "&OrgID=" +
      this.OrgID+"&UserID="+this.UserID;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(
      (data) => {
    console.log(data);
    if (data.DepartmentList.length > 0) {
      this.DepartmentList = data.List;
      this.getData1(data.DepartmentList);
    }
      },
      (error) => {
        this.ShowAlert(error,"error");
        console.log(error);
}
    );
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
      this.ShowAlert(error,"error")
       console.log(error);
    });
  }

    GetTrainees(BranchID:any) {
    this.ApiURL = "TraniningMaster/GetTrainingSessions?BranchID="+BranchID;
        this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => {
      this.TrainerList = data.Trainings;
    }, (error) => {
       console.log(error);
    });
  }

GetBranches() {
  let suborgid = this.selectedOrganization.map(res => res.Value)[0] || 0
  this.ApiURL = "Admin/GetBranchListupdated?OrgID="+this.OrgID+"&SubOrgID="+suborgid+"&AdminId="+this.AdminID
    this._commonservice
      .ApiUsingGetWithOneParam(this.ApiURL)
      .subscribe(
        (data) => {
    console.log(data);
          this.Columns = data.List;
    console.log(this.Columns,"colums data");
    // if (storedEmpBranch) {
    //   const selectedBranch = this.Columns.find(emp => emp.Text === storedEmpBranch);
    //   console.log('Selected Branch:', selectedBranch); // Debug log
    //   if (selectedBranch) {
    //       this.selectedBranch = [selectedBranch];
    //       console.log('Selected Branch Array:', this.selectedBranch); // Debug log
    //       this.cdr.detectChanges();
    //   }
    // }
        },
        (error) => {
          this.ShowAlert(error,"error");
          console.log(error);
}
      );
  }
onselectedTypeChangenew(event: any) {
    this.selectedListType = event;
    this.FilterType = [event];
}
onDeselectedTypeChange(event: any) {
    this.selectedListType = 0;
    this.FilterType = ["All"];
}

getData(List:any): void {
  let tmp = [];
  for (let i = 0; i < List.length; i++) {
    tmp.push({ id: List[i].Value, text: List[i].Text });
  }
  this.OriginalBranchList = tmp;
  this.Columns = tmp;
  this.GetDepartments();

}

  @ViewChild("drawer") drawer: any;
drawertoggle() {
  this.drawer.toggle();
  console.log("opened");
}
closeDrawer() {
  this.drawer.close();
  // console.log("closed");
}
SendCredentails() {
  this.spinnerService.show();
  if(this.EmployeeDetails)
  this.ApiURL="Admin/ShareCredentials?EmployeeID="+this.EmployeeId;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(
      (data) => {
   if(data.Status==true){
    this.ShowAlert(data.Message,"success");
    this.spinnerService.hide();
      // window.location.reload();
        } else {
    this.ShowAlert(data.Message,"warning");
    this.spinnerService.hide();
   }
      },
      (error: any) => {
    this.ShowAlert(error.message,"error");
    this.spinnerService.hide();
  }
  );
}

  newonDeselectedBranchesChange(event: any) {
    this.selectedDepartment = []
    this.selectedbranchid = 0;
    this.GetRegDepartments(0);
   this.TrainerList=[];
    this.GetSalaryConfigs();
    this.formInput.OfficeStartTime='';
    this.formInput.OfficeEndTime='';
  }
  newonselectedBranchesChange(event: any) {
    this.selectedDepartment = []
    this.selectedbranchid=event.Value;
    this.formInput.BranchId=event.Value;
    this.GetRegDepartments(this.selectedbranchid);
     this.GetTrainees(this.selectedbranchid);
    this.GetSalaryConfigs();
    const selectedtype = this.Columns.find((state: { Value: any; }) => state.Value ===parseInt(event.Value));
    if (selectedtype) {
      this.formInput.OfficeStartTime=selectedtype.WorkStartTime;
    this.formInput.OfficeEndTime=selectedtype.WorkEndTime;
    }
  }
  // newonselectedDepartmentDeSelectAll() {
  //   this.selectedDepartmentid=0;
  //   this.formInput.BranchId=0;
  // }
  // newonselectedDepartmentSelectAll(event: any) {
  //   this.selectedDepartmentid=0;
  // }

  newonDeselectedDepartmentChange(event: any) {
    this.selectedDepartmentid=0;
    this.GetSalaryConfigs();
  }
  newonselectedDepartmentChange(event: any) {
    this.selectedDepartmentid=event.id;
    this.formInput.DepartmentID=event.id;
    this.GetSalaryConfigs();
  }

  // onDeselectedDepartmentsChange(event: any) {
  //   this.selectedDepartmentId=0;}
  // onselectedDepartmentsChange(event: any) 
  // {
  //   this.selectedDepartmentId=event.id;
  // }
  // onDeselectedBranchesChange(event: any) {this.selectedBranchId=0;this.GetRegDepartments(0);  }
  // onselectedBranchesChange(event: any) {this.selectedBranchId=event.id;
  // this.GetRegDepartments(this.selectedBranchId); }
  // onselectedDepartmentsDeSelectAll(){this.selectedDepartmentId=0;}
  // onselectedBranchesSelectAll() {this.selectedBranchId=0;this.GetRegDepartments(0);  }

  openDialog(Array:any): void {
    this.dialog
      .open(ShowcredComponent, {
        data: { Array: Array },
      })
      .afterClosed()
      .subscribe((res: any) => {
          if(res){
            // window.location.reload();

              this.spinnerService.hide();
          }
      });
      }

  ShareWhatsapp() {
  this.tempcredarray=[];
  
  this.openDialog(this.tempcredarray);
  }

  Calculategross(Value:any)
  {
    this.formInput.GrossSalary=Value/12;
this.GetSalaryFieldStatus('isBasic');
  }


    GetSalaryFieldBasicAndBasicDaStatus() {
        if (!this.SalarySettingList) return true;
        let fieldStatus = this.SalarySettingList["isBasicAndDA"];
        return !(fieldStatus || this.SalarySettingList["isBasic"]);
    }

  GetSalaryFieldStatus(field: string) {
    if (!this.SalarySettingList) return true;
    let fieldStatus = this.SalarySettingList[field];
    return !fieldStatus;
  }

  GetSalaryConfigs() {
    let Branch = this.selectedbranchid || 0;
    let Dept = this.selectedDepartmentid || 0;
    if (Branch == 0 && Dept == 0) return;
    let json = {
      Employeelist: [],
      BranchList: Branch != 0 ? [Branch] : [],
      DepartmentList: Dept != 0 ? [Dept] : [],
    };

    if (
      json.Employeelist.length == 0 &&
      json.BranchList.length == 0 &&
      json.DepartmentList.length == 0
    ) {
      this.ShowAlert(
        "Please select a Branch or a Department or an Employee"
      ,"warning")
      return
  }
    this.spinnerService.show();
    this._commonservice
      .ApiUsingPost("SalaryCalculation/getSalaryConfiguration", json)
      .subscribe(
        (data) => {
          this.SalarySettingList = data?.List[0]?.Configfields[0];
          console.log(this.SalarySettingList);
          this._commonservice
            .ApiUsingPost("SalaryCalculation/GetSalaryCalculationConfig", json)
            .subscribe(
                (calData) => {
                  
                console.log({ calData });
                this.SalaryFormulae = calData.List[0]?.ConfigFields
                console.log(this.SalaryFormulae);
                if(this.formInput.GrossSalary){
                  this.validateGross(this.formInput.GrossSalary)
                  this.ShowAlert("Salary has been successfully calculated based on defined salary setting.","success")
                }
                this.spinnerService.hide();
              },
              (error) => {
                this.spinnerService.hide();
                this.ShowAlert(error.message,"warning");
}
            );
        },
        (error) => {
          this.spinnerService.hide();
          this.ShowAlert(error.message,"error");
        }
      );
  }
  limitSelection(event: any, day: string) {
    const checkedCount = [
      this.formInput.IsSundayOff,
      this.formInput.IsMondayOff,
      this.formInput.IsTuesdayOff,
      this.formInput.IsWednesdayOff,
      this.formInput.IsThursdayOff,
      this.formInput.IsFridayOff,
      this.formInput.IsSaturdayOff,
    ].filter(checked => checked).length;

    if (event.target.checked && checkedCount > 2) {
      event.target.checked = false;
      this.formInput[day] = false; 
      this.ShowAlert('You can only select up to 2 weekdays',"warning");
    }
  }

  preventPlusMinus(event: KeyboardEvent): void {
    if (event.key === '+' || event.key === '-') {
      event.preventDefault();
    }
  }


  @ViewChild('branchDropdownContainer') branchDropdownContainer!: ElementRef;
  @ViewChild('departmentDropdownContainer') departmentDropdownContainer!: ElementRef;
  @ViewChild('defaultDropdownContainer') defaultDropdownContainer!: ElementRef;
  dropdownIndex = {
    branch : {
      currentIndex : -1,
      container : this.branchDropdownContainer
    }
  }

  onKeyDown(event: KeyboardEvent,key:string,dropdown:any) {
    let dpContainer : ElementRef;

    switch (key) {
      case "branch":
        dpContainer= this.branchDropdownContainer
        break;
      case "department":
        dpContainer= this.departmentDropdownContainer
        break;
        
      default:
        dpContainer= this.defaultDropdownContainer
        break;
    }
    if(dpContainer != undefined && dpContainer != null){
      const dropdownOptions = dpContainer.nativeElement.querySelectorAll('.multiselect-item-checkbox');
  
      if (!dropdownOptions.length) return;
  
      switch (event.key) {
        case 'ArrowDown':
          // Move focus to the next option
          dropdown.currentIndex = (dropdown.currentIndex + 1) % dropdownOptions.length;
          this.highlightOption(dropdownOptions,dropdown);
          event.preventDefault(); // Prevent page scroll
          break;
  
        case 'ArrowUp':
          // Move focus to the previous option
          dropdown.currentIndex = 
            (dropdown.currentIndex - 1 + dropdownOptions.length) % dropdownOptions.length;
          this.highlightOption(dropdownOptions,dropdown);
          event.preventDefault(); // Prevent page scroll
          break;
  
        case 'Enter':
          // Select or toggle the current focused option
          const currentCheckbox = dropdownOptions[dropdown.currentIndex]?.querySelector('input');
          if (currentCheckbox) {
            currentCheckbox.click(); // Trigger checkbox selection
          }
          event.preventDefault();
          break;
  
        default:
          break;
      }
    }
  }

  highlightOption(dropdownOptions: NodeListOf<Element>, dropdown:any) {
    // Remove highlight class from all options
    dropdownOptions.forEach((option) => option.classList.remove('highlight'));

    // Add highlight class to the current focused option
    if (dropdown.currentIndex >= 0 && dropdown.currentIndex < dropdownOptions.length) {
      dropdownOptions[dropdown.currentIndex].classList.add('highlight');
      dropdownOptions[dropdown.currentIndex].scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }  

    LeaveSetting() {
      let branch = this.selectedBranch[0]
      this.dialog.open(LeavesettingsComponent, {
        data: { branchid:branch?.Value,branchname:branch?.Text}
      }).afterClosed().subscribe(res=>{
        if(res){
        }
      })
  
    }
    allowOnlyAlphanumeric(event: KeyboardEvent) {
      const key = event.key;
      if (/^[a-zA-Z0-9]$/.test(key) ||['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(key)) {
        return;
      }
      event.preventDefault();
    }


backtodashboard(){
  this._router.navigate(["appdashboard"]);
}

isPropertyVisible(property_name:string):Boolean{
  if(this.SalarySettingList==null || this.SalarySettingList==undefined)return true;
  let result=false;
  let salary_config_field=this.SalarySettingList[property_name];
  if(salary_config_field==null || salary_config_field==undefined){
    result=false;
  }else{
    result=salary_config_field;

   
  }


  return result;

}

  onselectedTrainer(item:any){
  }
  onDeselectedTrainer(item:any){
  }
}


