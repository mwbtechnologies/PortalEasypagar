
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { Subject } from 'rxjs';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { PdfExportService } from 'src/app/services/pdf-export.service';
import * as XLSX from 'xlsx';
import { MatDialog } from '@angular/material/dialog';
import { ShowcredComponent } from './showcred/showcred.component';
import { DeleteconfirmationComponent } from './deleteconfirmation/deleteconfirmation.component';
import { CommonTableComponent } from '../common-table/common-table.component';
import { ConfirmpasswordComponent } from './confirmpassword/confirmpassword.component';
import { environment } from 'src/environments/environment.prod';
import { CommonDialogComponent } from '../common-dialog/common-dialog.component';
import { ShowalertComponent } from '../create-employee/showalert/showalert.component';
import { LeavesettingsComponent } from './leavesettings/leavesettings.component';


export class FormInput {
  AlternateMobileNumber: any;
  EmpID: any;
  IsPercentage:any;
  EmergencyNumber: any;
  OT: any;
  BloodGroup: any;
  OfficeStartTime: any;
  OfficeEndTime: any;
  Gender: any;
  Education: any;
  FatherName: any;
  Relationship: any;
  DOB: any;
  Age: any;
  Organization: any;
  OldPassword: any;
  BranchID: any;
  DepartmentID: any;
  Designation: any;
  DateOfJoining: any;
  LoanAdvanceBalance: any;
  Deduction: any;
  OldSalaryBalance: any;
  OldSalaryAdvance: any;
  AdminBalance: any;
  EmployeeBalance: any;
  NoOfSickLeave: any;
  NoOfPaidLeave: any;
  BasicSalary: any;
  Logo: any;
  AdminID: any;
  ProfileImageURl: any;
  Password: any;
  ConfirmPassword: any;
  Email: any;
  FirstName: any;
  LastName: any;
  MobileNumber: any;
  StateID: any;
  CityID: any;
  Address: any;
  IsGeofenced: any
  Proofs: Array<Proof> = [];
  IsMondayOff: any;
  IsTuesdayOff: any;
  IsWednesdayOff: any;
  IsFridayOff: any;
  IsSaturdayOff: any;
  IsThursdayOff: any;
  IsSundayOff: any;
  AppVersion: any;
  IsPerday: any;
  GrossSalary: any;
  CTC:any;
  HRA: any;
  Allowances: any;
  ESI: any;
  PF: any;
  GaurdianName: any;
  DNS: any;
  AccountName: any;
  AccountNumber: any;
  Bank: any;
  IFSC: any;
  Branch: any;
  UPIID: any;
  DesignationID: any;
  RoleID: any;
  ProofID1: any;
  ProofID2: any;
  SettingID: any;
  FinancialTypeID: any;
  Proof2: any;
  Proof1: any;
  OrgID: any;
  FixedIncentive: any;
  IsYearlyLeaves: any;
  EmployeeId: any;
  SecurityDeposit: any;
  SDmonthlydeduction: any;
  IsWFH: any;
    IsESIStopped: Boolean = false;
    IsPTStopped: Boolean = false;
    IsPFStopped: Boolean = false;
    IsSDStopped: Boolean = false;

    BasicAndDA: any;
    WashingAllowance: any;
    FuelAllowance: any;
    SpecialAllowance: any;
}
export class dateclass {
  StartDate: any;
}
export class Proof {
  ProofTypeID: any;
  FrontImage: any;
  BackImage: any;
  ProofNumber: any;
}
export class Dropdown {
  Text: any;
  Value: any;
}
@Component({
  selector: 'app-employee-muster',
  templateUrl: './employee-muster.component.html',
  styleUrls: ['./employee-muster.component.css']
})
export class EmployeeMusterComponent implements OnInit {
  formInput: FormInput | any;
  formInputNew: dateclass | any;
  ProofClass: Array<Proof> = [];
  ListTypes: Array<Dropdown> = [];
  BloodGroups: Array<Dropdown> = [];
  ProofInput: Proof | any;
  EmployeeList: any;
  all_selected_values: any;
  ShowEdit = false;
  ShowAdd = false;
  originalProofList: any
  multiselectcolumns: IDropdownSettings = {};
  BranchSettings: IDropdownSettings = {};
  branchSettings: IDropdownSettings = {};
  departmentSettings: IDropdownSettings = {};
  ShowWeekOff: boolean | any;
  public isSubmit: boolean | any;
  ShowList = true;
  LoginUserData: any; IsEditable: any;
  AdminID: any;
  ApiURL: any; NoBranchFound: any;
  file: File | any;
  IsPercentageselected:any=false;
  EmployeeId: any;
  ProofList: any;
  proofName1: any
  proofName2: any
  selectedListId: string[] | any;
  selectedCityId: string[] | any;
  selectedBranchId: any;
  selectedDepartmentId: string[] | any;
  tempcredarray: any[] = [];
  OrgID: any;
  CurrentDate: any;
  EmployeeDetails: any;
  StateList: any;
  CityList: any; EditBranchValue: any; DesignationList: any; RoleList: any;
  GenderList: any; ProofNumberI: any; ProofNumberII: any;
  ProofIImageURl1: any; ProofIImageURl2: any; ProofIIImageURl1: any; ProofIIImageURl2: any;
  P1choose1 = false; P1choose2 = false; P2choose1 = false; P2choose2 = false;
  ProofImage1: any; ProofImage2: any; ProofImage3: any; ProofImage4: any;
  ShowProfile = true; ProfileClass = "nav-link active";
  ShowLoan = false;
  ShowProof = false;
  ShowSalary = false;
  ShowBank = false;
  ShowProfession = false;
  PrfClass = "nav-link";
  DisableSecuity:any;
  BankClass = "nav-link";
  LoanClass = "nav-link";
  SalaryClass = "nav-link";
  ProfessionClass = "nav-link";
  LoginType: any;
  dtExportButtonOptions: any = {};
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  dtExportButtonOptions1: any = {};
  dtOptions1: DataTables.Settings = {};
  dtTrigger1: Subject<any> = new Subject();
  NewAPIUrl: any; passwordinput: any; confirmpasswordinput: any;
  DOB: any;
  MonthlySalary: any;
  SettingList: any; Showshift: any = false;
  SettingID: any;
  AddPermission: any = true; EditPermission: any = true; ViewPermission: any = true; DeletePermission: any = true; UserID: any;
  ProofIPlaceHolder: any; ProofIIPlaceHolder: any;
  mail: any;
  OriginalBranchList: any; OriginalDepartmentList: any;
  chips: any[] = [];
  selectedDepartments: any = [];
  DeptColumns: any[] = [];
  index: any;
  ApplicationList: any = ["All", "Active", "InActive"];
  Columns: any[] = []; ShowShareButton: any;
  selectedBranches: any = []; isScrolled: boolean = false;
  searchText: string = '';
  SingleSelectionSettings: any;
  //Shift management code
  ShiftList: any[] = []
  isMonths: boolean = false
  IsJan: boolean = false
  IsFeb: boolean = false
  IsMarch: boolean = false
  IsApril: boolean = false
  IsMay: boolean = false
  IsJune: boolean = false
  IsJuly: boolean = false
  IsAug: boolean = false
  IsSep: boolean = false
  IsOct: boolean = false
  IsNov: boolean = false
  IsDec: boolean = false
  IsWholeYear: any;
  branch: any
  department: any
  Shift: any
  EmployeeName: any
  shiftID: any;
  AllotID: any = 0;
  shiftSettings: IDropdownSettings = {};
  esiUpdating: boolean = false
  pfUpdating: boolean = false
  DynamicArray: any[] = [
    {
      ShiftID: 0,
      ID: 1,
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
      ShiftID: 0,
      ID: 2,
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
      ShiftID: 0,
      ID: 2,
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
      ShiftID: 0,
      ID: 2,
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
      ShiftID: 0,
      ID: 2,
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
  ]; FilterType: any;
  ShowKYCTab: boolean = false; ShowSalaryTab: boolean = false;
  selectedbranchid: any; selecteddepartmentid: any;
  RegDepartmentList: any; selectedListType: any;
  selectedDepartmentid: any; selectedlisttype: any
  selectedBranch: any[] = []
  selectedDepartment: any[] = []
  temparray: any = []; tempdeparray: any = [];
  BranchList: any[] = []; selectall: any;
  DepartmentList: any;
  SelectedBranches: any[] = [];
  SelectedDepartments: any[] = [];
  FormattedDate: any;
  //common table
  actionOptions: any
  displayColumns: any
  displayedColumns: any
  employeeLoading: any;
  editableColumns: any = []
  topHeaders: any = []
  headerColors: any = []
  smallHeaders: any = []
  ReportTitles: any = {}
  selectedRows: any = []
  commonTableOptions: any = {}
  ShowBtn: boolean = false

  SalarySettingList: any;
  SalaryFormulae: any;
  SalaryFormulaeStatements: any = {}
  salaryTemp: any = {}
  selectedOrganization: any[] = []
  OrgList: any[] = []
  orgSettings: IDropdownSettings = {}


  selectedlistOraganization: any[] = []
  subOrgList: any[] = []
  orglistSettings: IDropdownSettings = {}
  @ViewChild(CommonTableComponent) commonTableChild: CommonTableComponent | any;
  //ends here

  salaryConfigLoading:any
  
  constructor(public dialog: MatDialog, private _router: Router, private spinnerService: NgxSpinnerService,
    private _commonservice: HttpCommonService, private globalToastService: ToastrService,
    private pdfExportService: PdfExportService, private cdr: ChangeDetectorRef) {
    this.isSubmit = false;
    this.shiftSettings = {
      singleSelection: true,
      idField: 'ID',
      textField: 'Name',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.SingleSelectionSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
      closeDropDownOnSelection: true
    };
    this.BranchSettings = {
      singleSelection: true,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
      closeDropDownOnSelection: true
    };
    this.multiselectcolumns = {
      singleSelection: true,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
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
        name: "Share Credentials",
        icon: "fa fa-share-alt",
        class: "",
        filter: [
          { field: 'IsActive', value: true }
        ],
      },
      {
        name: "View Edit",
        icon: "fa fa-edit",
        class: "",
        filter: [
          { field: 'IsActive', value: true }
        ],
      },
      // {
      //   name: "Deactivate",
      //   icon: "fa fa-times",
      //   filter: [
      //     { field:'IsActive',value : true}
      //   ],
      //     class:"danger-button"
      // },
      // {
      //   name: "Activate",
      //   icon: "fa fa-plus",
      //   filter: [
      //     { field:'IsActive',value : false}
      //   ],
      //   class:"success-button"
      // },
      {
        name: "Delete",
        icon: "fa fa-trash",
        filter: [
          { field: 'IsActive', value: true }
        ],
        class: "danger-button"
      }
      // {
      //   name: "Shift Details",
      //   icon: "fa fa-info",
      //   filter: [
      //     { field:'IsActive',value : true}
      //   ],
      //   class:""
      // },
      // {
      //   name: "Delete",
      //   icon: "fa fa-trash",
      //   filter: [
      //     { field:'IsActive',value : true}
      //   ],
      //   color:"red"
      // }
    ];

    this.displayColumns = {
      "SelectAll": "SelectAll",
      "SLno": "SL No",
      "MappedEmpId": "Employee ID",
      "Name": "NAME",
      "Branch": "BRANCH",
      "Department": "DEPARTMENT",
      // "Role": "ROLE",
      "Mobile": "MOBILE",
      "Email": "EMAIL",
      "SourceOfWork": "WORKMODE",
      "DeletedDate": "EXIT DATE",
      "Status": "STATUS",
      "Actions": "ACTIONS"
    },


      this.displayedColumns = [
        "SelectAll",
        "SLno",
        "MappedEmpId",
        "Name",
        "Branch",
        "Department",
        // "Role",
        "Mobile",
        "Email",
        "SourceOfWork",
        "DeletedDate",
        "Status",
        "Actions"
      ]

    this.editableColumns = {
      // "HRA":{
      //   filters:{}
      // },
    }

    this.topHeaders = [
      // {
      //   id:"blank1",
      //   name:"",
      //   colspan:5
      // },
    ]

    this.headerColors = {
      // Deductions : {text:"#ff2d2d",bg:"#fff1f1"},
    }
    //ends here

    this.salaryConfigLoading = {
      branch:false,
      dept:false
    }
    }


    GetSalaryFieldBasicAndBasicDaStatus()
    {
        if (!this.SalarySettingList) return true;
        let fieldStatus = this.SalarySettingList["isBasicAndDA"];
        return !(fieldStatus || this.SalarySettingList["isBasic"]);
    }


  ngOnInit(): void {
    this.DisableSecuity=false;
    this.ShowShareButton = false;
    this.NoBranchFound = "No Branches Found";
    this.selecteddepartmentid = 0;
    this.FilterType = ['All'];
    this.AdminID = localStorage.getItem("AdminID");
    this.UserID = localStorage.getItem("UserID");
    this.OrgID = localStorage.getItem("OrgID");
    if (this.AdminID == null || this.AdminID == "" || this.OrgID == undefined || this.OrgID == null || this.OrgID == "" || this.AdminID == undefined) {
      this._router.navigate(["auth/signin-v2"]);
    }
    this.formInput = {
      SecurityDeposit: 0,
      SDmonthlydeduction: 0,
      Key: "en",
      EmpID: '',
      EmergencyNumber: '',
      GaurdianName: '',
      OT: '0',
      BloodGroup: '',
      OfficeStartTime: '',
      OfficeEndTime: '',
      Gender: '',
      Education: '',
      FatherName: '',
      DOB: '',
      Age: 0,
      Organization: '',
      OldPassword: '',
      BranchID: '',
      DepartmentID: '',
      Designation: '',
      DateOfJoining: '',
      LoanAdvanceBalance: 0,
      Deduction: 0,
      OldSalaryBalance: 0,
      OldSalaryAdvance: 0,
      AdminBalance: 0,
      EmployeeBalance: 0,
      NoOfSickLeave: 0,
      NoOfPaidLeave: 0,
      BasicSalary: 0,
      Logo: '',
      AdminID: this.AdminID,
      ProfileImageURl: '',
      Password: '',
      ConfirmPassword: '',
      Email: '',
      FirstName: '',
      LastName: '',
      MobileNumber: '',
      StateID: '',
      CityID: '',
      Address: '',
      IsGeofenced: true,
      Proofs: [],
      IsMondayOff: false,
      IsTuesdayOff: false,
      IsWednesdayOff: false,
      IsFridayOff: false,
      IsSaturdayOff: false,
      IsThursdayOff: false,
      IsSundayOff: false,
      AppVersion: '1.0.0',
      IsPerday: false,
      Relationship: '',
      GrossSalary: 0,
      CTC:0,
      HRA: 0,
      DA: 0,
      TA: 0,
      MA: 0,
      Allowances: 0,
      LTA:0,
      Conveyance: 0,
      BasicAndDA: 0,
      WashingAllowance: 0,
      FuelAllowance: 0,
      SpecialAllowance:0,
      ESI: 0,
      PF: 0,
      DNS: 0,
      RoleID: 2,
      DesignationID: 0,
      ProofID1: '',
      ProofID2: '',
      SettingID: 0,
      FinancialTypeID: 1,
      Proof2: '',
      Proof1: '',
      OrgID: 0,
      AlternateMobileNumber: '',
      AccountName: '',
      AccountNumber: 0,
      Bank: '',
      IFSC: '',
      BankBranch: '',
      UPIID: '',
      FixedIncentive: 0,
      IsYearlyLeaves: false,
      EmployeeId: 0,
      IsWFH:false,
        IsPercentage: false,
        IsESIStopped :false,
        IsPTStopped : false,
        IsPFStopped :false,
        IsSDStopped: false,
    }
    this.formInputNew = {
      StartDate: ''
    }
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const day = today.getDate().toString().padStart(2, '0');
    this.FormattedDate = `${year}-${month}-${day}`;
    this.CurrentDate = this.FormattedDate;
    this.formInputNew.StartDate = this.CurrentDate
    this.MonthlySalary = true;
    this.selectedListType = 0;
    this.selectall = true;
    this.LoginType = localStorage.getItem("LoginStatus"); if (this.LoginType == "true") { this.LoginType = "Email"; } else { this.LoginType = "Mobile"; }
    this.ProfileClass = "nav-link active";
    this.ShowKYCTab = false;
    this.formInput.OrgID = this.OrgID;
    this.passwordinput = "password"; this.confirmpasswordinput = "password";
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
    this.GetListTypes();
    this.GetBloodGroupTypes();
    this.formInput.AdminID = this.AdminID;
    this._commonservice.ApiUsingGetWithOneParam("Admin/GetProofList").subscribe((data) => { this.originalProofList = data.List; this.ProofList = data.List; }, (error) => {
      // this.globalToastService.error(error.message);
      this.ShowAlert(error.message, "error");
      console.log(error);
    });

    
    this._commonservice.ApiUsingGetWithOneParam("Admin/GetGenderList").subscribe((data) => this.GenderList = data.List, (error) => {
      // this.globalToastService.error(error);
      this.ShowAlert(error.message, "error");
      console.log(error);
    });

    // this.NewAPIUrl="Portal/GetOrgRoles?OrgID="+this.OrgID;
    // this._commonservice.ApiUsingGetWithOneParam(this.NewAPIUrl).subscribe((data) => this.RoleList = data.List, (error) => {
    //   this.globalToastService.error(error); console.log(error);
    // });


    // this.selectedbranchid=0;
    this.selecteddepartmentid = 0; this.selectedlisttype = 0;
    // debugger;this.GetBranches();
    this.GetDesignations();
    this.GetDepartments();
    // this.GetRegDepartments(0);
    // this.Getsettings();
    this.GetOrganizationList()
    this.GetBranchesList()
    // this.AddPermission=localStorage.getItem("AddPermission"); if(this.AddPermission=="true"){this.AddPermission=true;} else{this.AddPermission=false;}
    //     this.EditPermission=localStorage.getItem("EditPermission");  if(this.EditPermission=="true"){this.EditPermission=true;}else{this.EditPermission=false;}
    //     this.ViewPermission=localStorage.getItem("ViewPermission");  if(this.ViewPermission=="true"){this.ViewPermission=true;}else{this.ViewPermission=false;}
    //     this.DeletePermission=localStorage.getItem("DeletePermission");  if(this.DeletePermission=="true"){this.DeletePermission=true;}else{this.DeletePermission=false;}
    this.AddPermission = true; this.EditPermission = true; this.ViewPermission = true; this.DeletePermission = true;
    this.ProofIPlaceHolder = "Proof Number/ID";
    this.ProofIIPlaceHolder = "Proof Number/ID";

  }

  CheckSDDeduction(val: any) {
    if (
     ( this.formInput.SecurityDeposit == null ||
      this.formInput.SecurityDeposit == undefined ||
      this.formInput.SecurityDeposit == "" || this.formInput.sec==0) && this.formInput.SDmonthlydeduction>0
    ) {
  this.ShowAlert("Please Enter Security Deposit First","warning");
  this.formInput.SDmonthlydeduction=0;
    } else {
      if (val > this.formInput.SecurityDeposit) {
        this.ShowAlert(
          "Deduction Cannot be greater than security deposit amount"
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
  back() {
    this.Showshift = false;
    this.ShowList = true
    this.GetEmployeeList()
    this.GetOrganization()
    this.GetOrganizationList()
    this.GetBranches()
    this.GetBranchesList()
    this.GetDepartmentsList()
  }

  onselectedOrglist(item: any) {
    this.SelectedBranches = []
    this.selectedDepartments = []
    this.GetBranchesList()
  }
  onDeselectedOrglist(item: any) {
    this.SelectedBranches = []
    this.selectedDepartments = []
    this.GetBranchesList()
  }

  GetOrganizationList() {
    this.ApiURL = "Admin/GetSuborgList?OrgID=" + this.OrgID + "&AdminId=" + this.AdminID
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => {
      this.subOrgList = data.List
    }, (error) => {
      this.ShowAlert(error, "error")
      console.log(error);
    });
  }
  GetBranchesList() {
    let suborgid = this.selectedlistOraganization.map(res => res.Value)[0] || 0
    this.ApiURL = "Admin/GetBranchListupdated?OrgID=" + this.OrgID + "&SubOrgID=" + suborgid + "&AdminId=" + this.UserID
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => {
      this.BranchList = data.List;
      // this.SelectedBranches = [this.BranchList[0]]
      // this.onBranchtextSelect({Value: 2359, Text: 'Aditya Birla India Private'})
      // this.GetEmployeeList()
      // console.log(this.BranchList, "branchlist");
    }, (error) => {
      // this.globalToastService.error(error);
      this.ShowAlert(error, "error");
      console.log(error);
    });

  }

  GetDepartmentsList() {
    const json = {
      AdminID:this.UserID,
      OrgID: this.OrgID,
      Branches: this.temparray.map((br: any) => {
        return {
          "id": br.id
        }
      })
    }
    this._commonservice.ApiUsingPost("Portal/GetEmployeeDepartments", json).subscribe((data) => {
      // console.log(data);
      if (data.DepartmentList.length > 0) {
        this.DepartmentList = data.List;
        // console.log(this.DepartmentList,"department list");
      }
    }, (error) => {
      // this.globalToastService.error(error);
      this.ShowAlert(error, "error");
      console.log(error);
    });
  }
  onDeptSelect(item: any) {
    // console.log(item,"item");
    this.tempdeparray = []
    this.tempdeparray.push({ id: item.Value, text: item.Text });
  }
  onDeptSelectAll(item: any) {
    // console.log(item,"item");
    this.tempdeparray = item;
  }
  onDeptDeSelectAll() {
    this.tempdeparray = [];
  }
  onDeptDeSelect(item: any) {
    // console.log(item,"item");
    this.tempdeparray.splice(this.tempdeparray.indexOf(item), 1);
  }
  onBranchtextSelect(item: any) {
    //  console.log(item,"item");
    this.temparray = []
    this.temparray.push({ id: item.Value, text: item.Text });
    this.GetDepartmentsList();
    this.GetSalaryConfigs()
  }
  onBranchDeSelect(item: any) {
    //  console.log(item,"item");
    this.temparray.splice(this.temparray.indexOf(item), 1);
    this.GetDepartmentsList();
    this.GetSalaryConfigs()
  }
  ShowKYCDetails() {
    if (this.ShowKYCTab == true) { this.ShowKYCTab = false; } else { this.ShowKYCTab = true; }
  }
  ShowSalaryDetails() {
    if (this.ShowSalaryTab == true) { this.ShowSalaryTab = false; } else { this.ShowSalaryTab = true; }
  }
  checkbox() {

  }
  onShiftSelect(item: any) {
    this.shiftID = item.ID
  }
  // Getsettings()
  // {
  //   this.NewAPIUrl="Admin/GetSalaryDropdown?OrgID="+this.OrgID;
  //   this._commonservice.ApiUsingGetWithOneParam(this.NewAPIUrl).subscribe((data) => this.SettingList = data.List, (error) => {
  //     this.globalToastService.error(error); console.log(error);
  //   });
  // }
  GetDesignations() {
    this.NewAPIUrl = "Portal/GetOrgDesignations?OrgID=" + this.OrgID;
    this._commonservice.ApiUsingGetWithOneParam(this.NewAPIUrl).subscribe((data) => this.DesignationList = data.List, (error) => {
      // this.globalToastService.error(error);
      this.ShowAlert(error, "error");
      console.log(error);
    });
  }

  GetEmployeeList() {

    if (this.selectedlisttype == undefined || this.selectedlisttype == null || this.selectedlisttype == 0 || this.selectedlisttype == '') {
      this.selectedlisttype = "All";
    }
    this.spinnerService.show();
    this.employeeLoading = true
    let Branch = this.temparray.map((y: any) => y.id)[0] || 0
    let Dept = this.tempdeparray.map((y: any) => y.id)[0] || 0
    this.ApiURL = "Admin/GetMyEmployees?AdminID=" + this.AdminID + "&BranchId=" + Branch + "&DeptId=" + Dept + "&ListType=" + this.selectedlisttype;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((res: any) => {
      this.spinnerService.hide();
      var table = $('#DataTables_Table_0').DataTable();
      table.destroy();
      this.EmployeeList = res.List.map((l: any, i: any) => { return { SLno: i + 1, Status: l.IsActive, ...l } });
      this.dtTrigger.next(null);
      this.ShowShareButton=this.EmployeeList.length > 0;
      this.spinnerService.hide();
      this.employeeLoading = false
    }, (error) => {
      this.spinnerService.hide();
      this.employeeLoading = false
      // this.globalToastService.error(error.message);
      this.ShowAlert(error.message, "error");
    });


  }
  GetListTypes() {
    let arr = new Dropdown();
    arr.Text = "All";
    arr.Value = "All";
    this.ListTypes.push(arr);

    arr = new Dropdown();
    arr.Text = "Active";
    arr.Value = "Active";
    this.ListTypes.push(arr);

    arr = new Dropdown();
    arr.Text = "InActive";
    arr.Value = "InActive";
    this.ListTypes.push(arr);
  }
  GetBloodGroupTypes() {
    let arr = new Dropdown();
    arr.Text = "A+";
    arr.Value = "A+";
    this.BloodGroups.push(arr);

    arr = new Dropdown();
    arr.Text = "A-";
    arr.Value = "A-";
    this.BloodGroups.push(arr);

    arr = new Dropdown();
    arr.Text = "B+";
    arr.Value = "B+";
    this.BloodGroups.push(arr);

    arr = new Dropdown();
    arr.Text = "B-";
    arr.Value = "B-";
    this.BloodGroups.push(arr);

    arr = new Dropdown();
    arr.Text = "O+";
    arr.Value = "O+";
    this.BloodGroups.push(arr);

    arr = new Dropdown();
    arr.Text = "O-";
    arr.Value = "O-";
    this.BloodGroups.push(arr);

    arr = new Dropdown();
    arr.Text = "AB+";
    arr.Value = "AB+";
    this.BloodGroups.push(arr);

    arr = new Dropdown();
    arr.Text = "AB-";
    arr.Value = "AB-";
    this.BloodGroups.push(arr);
  }
  OnBranchSelect(event: any) {
    if (event != null && event != undefined) {
      this.selectedBranchId = event.Value;
    }
  }
  allCheck(event: any) {
    if (this.selectall == true) { this.selectall = false; } else { this.selectall = true; }
    this.ShowShareButton = false;
    for (this.index = 0; this.index < this.EmployeeList.length; this.index++) {
      // if(this.EmployeeList[this.index].Email!="" && this.EmployeeList[this.index].Email!=null && this.EmployeeList[this.index].Email!=undefined)
      // {
      if (this.selectall == true) {
        // Assuming 'this.index' is the index of the item you want to update
        this.EmployeeList[this.index].checked = false; // or any other value you want to set

      }
      else {
        this.EmployeeList[this.index].checked = true;
        this.ShowShareButton = true;

      }

      // }     
    }

  }

  DeleteEmpPermanent(row: any) {
    this.dialog.open(ConfirmpasswordComponent, {
      data: { row }
    })
  }
  OnChange(event: any) {
    for (this.index = 0; this.EmployeeList.length; this.index++) {
      if (this.EmployeeList[this.index].checked) {
        this.EmployeeList[this.index].checked = true;
        this.ShowShareButton = true;
        break;
      }
      else {
        this.ShowShareButton = false;
      }
    }
  }

  // GetEmployees()
  // {
  //   if(this.selectedBranchId==undefined||this.selectedBranchId==null||this.selectedBranchId=="")
  //   {
  //     this.globalToastService.warning("Please Select Branch");
  //   }
  //   else if(this.selectedListId==undefined||this.selectedListId==null||this.selectedListId=="")
  //   {
  //     this.globalToastService.warning("Please Select ListType");
  //   }
  //   else
  //   {
  //     if(this.formInput.DepartmentID==undefined||this.formInput.DepartmentID==null||this.formInput.DepartmentID=="")
  //   {
  //    this.formInput.DepartmentID='';
  //   }
  //     this.spinnerService.show();
  //     this.ApiURL="Admin/GetMyEmployees?AdminID="+this.AdminID+"&&BranchId="+this.formInput.BranchID+"&&DeptId="+this.formInput.DepartmentID+"&&ListType="+this.selectedListId;
  //       this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((res:any) => {
  //         var table = $('#DataTables_Table_0').DataTable();
  //         table.destroy();
  //         this.EmployeeList = res.List;
  //           this.ShowEdit = false;
  //           this.ShowAdd = false;
  //           this.ShowList = true;
  //           this.spinnerService.hide();
  //       }, (error) => {
  //         this.spinnerService.hide();
  //         this.globalToastService.error(error.message);
  //       });
  //      this.spinnerService.hide();
  //   }


  // }
  showAdd() {
    this.ApiURL = "Admin/GetAccessStatusRole?UserID=" + this.UserID + "&feature=employee&editType=create";
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(data => {
      if (data.Status == true) {
        // debugger
        // this.GetBranches();this.GetDepartments();
        this.ShowList = false;
        this.ShowEdit = false;
        this.ShowAdd = true;
      }
      else {
        // this.globalToastService.warning(data.Message);
        this.ShowAlert(data.Message, "warning");
      }
    }, (error: any) => {
      this.spinnerService.hide();
      // this.globalToastService.error("Failed to Validate the Access. Please Refresh page and try again");
      this.ShowAlert("Failed to Validate the Access. Please Refresh page and try again", "error");

    });
  }
  WeekOff() {
    if (this.formInput.IsPerday == true) {
      this.ShowWeekOff = false;

      this.salaryTemp = {
        GrossSalary: this.formInput.GrossSalary,
        BasicSalary: this.formInput.BasicSalary,
        HRA: this.formInput.HRA,
        DA: this.formInput.DA,
        TA: this.formInput.TA,
        MA: this.formInput.MA,
        PF: this.formInput.PF,
        ESI: this.formInput.ESI,
        LTA: this.formInput.LTA,
        Conveyance:this.formInput.Conveyance,
        Allowances: this.formInput.Allowances
      }

      this.formInput.GrossSalary = Math.floor(this.formatNumber((this.formInput.GrossSalary > 0 ? this.formatNumber(this.formInput.GrossSalary) : this.formatNumber(this.formInput.BasicSalary)) / 30))
      this.formInput.BasicSalary = this.formatNumber(this.formInput.GrossSalary)
      this.formInput.HRA = 0;
      this.formInput.DA = 0;
      this.formInput.TA = 0;
      this.formInput.MA = 0;
      this.formInput.PF = 0;
      this.formInput.ESI = 0;
      this.formInput.LTA = 0;
      this.formInput.Conveyance =0;
      this.formInput.Allowances = 0;
    }
    else {
      this.ShowWeekOff = true;
      // this.formInput.GrossSalary = Math.floor((this.formatNumber(this.formInput.GrossSalary)) * 30)
      // this.validateGross(this.formatNumber(this.formInput.GrossSalary))
      if (this.salaryTemp.GrossSalary != 0) {
        this.formInput.GrossSalary = this.salaryTemp.GrossSalary
        this.formInput.BasicSalary = this.salaryTemp.BasicSalary
        this.formInput.HRA = this.salaryTemp.HRA
        this.formInput.DA = this.salaryTemp.DA
        this.formInput.TA = this.salaryTemp.TA
        this.formInput.MA = this.salaryTemp.MA
        this.formInput.PF = this.salaryTemp.PF
        this.formInput.ESI = this.salaryTemp.ESI
        this.formInput.LTA = this.salaryTemp.LTA
        this.formInput.Conveyance=this.salaryTemp.Conveyance
        this.formInput.Allowances = this.salaryTemp.Allowances
      }
    }
    // this.formInput.GrossSalary= this.formatNumber(this.formInput.BasicSalary);
    // this.formInput.HRA=0;
    // this.formInput.DA=0;
    // this.formInput.PF=0;
    // this.formInput.ESI=0;
    // this.formInput.LTA=0;
    // this.formInput.TA=0;
    // this.formInput.MA=0;
    // this.formInput.Allowances=0;
    // this.formInput.BasicSalary=0;
  }

  CalculateAge(date: Date): void {
    if (date) {
      this.CurrentDate = new Date();
      const dateString = date + 'T10:30:00'; // Assuming the string is in ISO 8601 format

      const dateObj = new Date(dateString);
      this.DOB = dateObj;
      var timeDiff = Math.abs(this.CurrentDate - this.DOB);
      this.formInput.Age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
    }
  }

  OnStateChange(event: any) {
    if (event != undefined && event != null) {
      this.formInput.CityID = '';
      this.spinnerService.show();
      this.ApiURL = "Admin/GetCityList?StateID=" + event.value + "&Keyword=";
      this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => this.CityList = data.List, (error) => {
        console.log(error); this.spinnerService.hide();
      });
      this.spinnerService.hide();
    }
    else {
      this.formInput.StateID = '';
      this.formInput.CityID = '';
    }
  }

  OnCityChange(event: any) {
    if (event != undefined && event != null) {
      this.formInput.CityID = event.Value;
      this.spinnerService.hide();
    }
    else {
      this.formInput.CityID = '';
    }
  }
  showEdit(IL: any) {
    this.ApiURL = "Admin/GetAccessStatusRole?UserID=" + this.UserID + "&feature=employee&editType=edit";
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(data => {
      if (data.Status == true) {
        // this.selectedbranchid=IL.Branch;
        localStorage.setItem("EditEmployeeBranch", IL.Branch)
        localStorage.setItem("EditEmployeeDepartment", IL.Department)
        this.selectedDepartmentid = 0;
        this.ShowList = false;
        this.ShowEdit = true;
        this.ProfileClass = "nav-link active";
        this.BankClass = "nav-link";
        this.SalaryClass = "nav-link";
        this.ShowAdd = false;
        this.ShowProfile = true
        this.ShowBank = false
        this.ShowSalary = false
        this.EmployeeId
        this.GetOrganization()
        this.GetBranches();
        this.GetDepartments();
        this.GetEmployeeDetails(IL.ID);
      }
      else {
        // this.globalToastService.warning(data.Message);
        this.ShowAlert(data.Message, "warning");
      }
    }, (error: any) => {
      this.spinnerService.hide();
      // this.globalToastService.error("Failed to Validate the Access. Please Refresh page and try again");
      this.ShowAlert("Failed to Validate the Access. Please Refresh page and try again", "error");

    });
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



  validateIFSC(ifscCode: string): boolean {
    const ifscPattern = /^[A-Z]{4}[0-9]{7}$/;
    if (!ifscPattern.test(ifscCode)) {
      // this.globalToastService.warning("Pleasse Enter Valid IFSC Code")
      this.ShowAlert("Pleasse Enter Valid IFSC Code", "warning");
      return false
    } else {
      return true
    }
  }


  validateUPIID(UpiID: string) {
    const upiPattern = /^(?!.*\s)(?:[a-zA-Z0-9._-]+|\d{10})@[a-zA-Z0-9.-]+$/;
    if (!upiPattern.test(UpiID)) {
      // this.globalToastService.warning("Pleasse Enter Valid UPI ID")
      this.ShowAlert("Pleasse Enter Valid UPI ID", "warning");
    } else {
    }
  }
  showList() {
    this.ShowList = true;
    this.ShowEdit = false;
    this.ShowAdd = false;
    this.ShowProfile = true
    this.ShowBank = false
    this.ShowSalary = false
    // this.GetEmployeeList()
    // debugger
    // this.GetBranches()
    this.GetOrganizationList()
    this.GetBranchesList()
    this.GetDepartmentsList()
    this.GetEmployeeList()
    localStorage.removeItem("EditEmployeeBranch");
    localStorage.removeItem("EditEmployeeDepartment");
  }
  GetEmployeeDetails(ID: number) {
    // this.spinnerService.show();
    this.EmployeeId = ID;
    this.ApiURL = "Employee/GetUserProfile?ID=" + ID + "&IsEmail=true";
    if (this.LoginType != "Email") {
      this.ApiURL = "Employee/GetUserProfile?ID=" + ID + "&IsEmail=false";
    }
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(data => {
      if (data.Status == true) {
        this.EmployeeDetails = data.List[0];
        if (this.EmployeeDetails != null) {
          this.formInput.IsWFH=this.EmployeeDetails.IsWFH;
          this.formInput.Address = this.EmployeeDetails.Address;
          this.formInput.FirstName = this.EmployeeDetails.FirstName;
          this.formInput.LastName = this.EmployeeDetails.LastName;
          this.formInput.Email = this.EmployeeDetails.Email;
          this.formInput.MobileNumber = this.EmployeeDetails.MobileNumber;
          this.formInput.OldSalaryAdvance = this.EmployeeDetails.AdminBalance;
          this.formInput.OldSalaryBalance = this.EmployeeDetails.OldSalaryBalance;
          this.formInput.LoanAdvanceBalance = this.EmployeeDetails.LoanAdvanceBalance;
          this.formInput.Basic_Salary = this.EmployeeDetails.BasicSalary;
          this.formInput.Department = this.EmployeeDetails.Department;
          this.formInput.DepartmentID = this.EmployeeDetails.DepartmentID;
          this.formInput.State = this.EmployeeDetails.State;
          this.formInput.City = this.EmployeeDetails.City;
          this.formInput.DOB = this.EmployeeDetails.DOB;
              this.formInput.PSA = this.EmployeeDetails.PSA;
           this.formInput.DateOfJoining = this.EmployeeDetails.DateOfJoining;
          this.formInput.IsGeofenced = this.EmployeeDetails.IsGeofenced;
          this.formInput.EmployeeId = this.EmployeeDetails.EmployeeId;
          localStorage.setItem('OrgName', data.List[0].Organization)
          localStorage.setItem("EditEmployeeDepartment",this.EmployeeDetails.Department);
          if (this.EmployeeDetails.DateOfJoining != null && this.EmployeeDetails.DateOfJoining != '' && this.EmployeeDetails.DateOfJoining != undefined) {
            var dta = this.parseDateStringSlash(this.EmployeeDetails.DateOfJoining);
            const year = dta.getFullYear();
            const month = (dta.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
            const day = dta.getDate().toString().padStart(2, '0');
            this.formInput.DateOfJoining = `${year}-${month}-${day}`;
          }
             if (this.EmployeeDetails.DOB != null && this.EmployeeDetails.DOB != '' && this.EmployeeDetails.DOB != undefined) {
            var dta = this.parseDateStringSlash(this.EmployeeDetails.DOB);
            const year = dta.getFullYear();
            const month = (dta.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
            const day = dta.getDate().toString().padStart(2, '0');
            this.formInput.DOB = `${year}-${month}-${day}`;
          }
          this.formInput.BloodGroup = this.EmployeeDetails.BloodGroup;
          this.formInput.Designation = this.EmployeeDetails.Designation;
          this.formInput.Password = this.EmployeeDetails.Password;
          this.formInput.ConfirmPassword = this.EmployeeDetails.ConfirmPassword;
          this.formInput.IsWednesdayOff = this.EmployeeDetails.IsWednesdayOff;
          this.formInput.IsFridayOff = this.EmployeeDetails.IsFridayOff;
          this.formInput.IsTuesdayOff = this.EmployeeDetails.IsTuesdayOff;
          this.formInput.IsMondayOff = this.EmployeeDetails.IsMondayOff;
          this.formInput.IsThursdayOff = this.EmployeeDetails.IsThursdayOff;
          this.formInput.IsSundayOff = this.EmployeeDetails.IsSundayOff; this.formInput.IsSaturdayOff = this.EmployeeDetails.IsSaturdayOff;
          this.formInput.Gender = this.EmployeeDetails.Gender;
          this.formInput.Age = this.EmployeeDetails.Age;
          this.formInput.GrossSalary = this.EmployeeDetails.GrossSalary;
          if(this.EmployeeDetails.CTC !=undefined){
              this.formInput.CTC=this.EmployeeDetails.CTC;
          }
         
          this.formInput.BasicSalary = this.EmployeeDetails.BasicSalary;
          this.formInput.HRA = this.EmployeeDetails.HRA;
           this.formInput.LTA = this.EmployeeDetails.LTA;
            this.formInput.Conveyance = this.EmployeeDetails.Conveyance;
          this.formInput.DA = this.EmployeeDetails.DA;
          this.formInput.TA = this.EmployeeDetails.TA;
          this.formInput.MA = this.EmployeeDetails.MA;
          this.formInput.DNS = this.EmployeeDetails.DNS;
          this.formInput.Allowances = this.EmployeeDetails.Allowances;
          this.formInput.ESI = this.EmployeeDetails.ESI;
          this.formInput.PF = this.EmployeeDetails.PF;
          this.formInput.Relationship = this.EmployeeDetails.Relationship;
          this.formInput.BranchID = this.EmployeeDetails.BranchID;
          // this.selectedBranchId = this.EmployeeDetails.Branch;
          // this.selectedDepartmentid=this.formInput.DepartmentID;
          // this.EditBranchValue=this.EmployeeDetails.Branch;
          this.formInput.DepartmentID = this.EmployeeDetails.DepartmentID;
          this.formInput.DesignationID = this.EmployeeDetails.DesignationID;
          this.formInput.RoleID = this.EmployeeDetails.RoleID;
          this.formInput.StateID = this.EmployeeDetails.StateID;
          this.formInput.CityID = this.EmployeeDetails.CityID;
          this.formInput.Designation = this.EmployeeDetails.Designation;
          this.formInput.GaurdianName = this.EmployeeDetails.GaurdianName;
          this.formInput.Relationship = this.EmployeeDetails.Relationship;
          this.formInput.EmergencyNumber = this.EmployeeDetails.EmergencyNumber;
          this.formInput.OfficeStartTime = this.EmployeeDetails.OfficeStartTime;
          this.formInput.OfficeEndTime = this.EmployeeDetails.OfficeEndTime;
          this.formInput.Education = this.EmployeeDetails.Education;
          this.formInput.NoOfPaidLeave = this.EmployeeDetails.NoOfPaidLeave;
          this.formInput.NoOfSickLeave = this.EmployeeDetails.NoOfSickLeave;
          this.formInput.AccountName = this.EmployeeDetails.AccountName;
          this.formInput.AccountNumber = this.EmployeeDetails.AccountNumber;
          this.formInput.IFSC = this.EmployeeDetails.IFSC;
          this.formInput.Bank = this.EmployeeDetails.Bank;
          this.formInput.BankBranch = this.EmployeeDetails.BankBranch;
          this.formInput.UPIID = this.EmployeeDetails.UPIID;
          this.formInput.Deduction = this.EmployeeDetails.Deduction;
          this.formInput.IsPerday = this.EmployeeDetails.IsPerday;
          this.formInput.SecurityDeposit = this.EmployeeDetails.SecurityDeposit;
          this.formInput.SDmonthlydeduction = this.EmployeeDetails.SDmonthlydeduction;
          if(this.EmployeeDetails.IsDeducted==true || this.EmployeeDetails.IsDeducted=='true')
          {
            this.DisableSecuity=true;
          }
          if(this.EmployeeDetails.IsPercentage==true || this.EmployeeDetails.IsDeducted=='true')
            {
              this.IsPercentageselected=true;this.formInput.IsPercentage=true;
            }
          this.formInput.SDbalance = this.EmployeeDetails.SDbalance;
          this.formInput.ProofID1 = this.EmployeeDetails.Proofs[0]?.ProofNumber
          this.formInput.ProofID2 = this.EmployeeDetails.Proofs[1]?.ProofNumber
          this.formInput.Proof1 = this.EmployeeDetails.Proofs[0]?.ProofTypeID || ''
          this.formInput.Proof2 = this.EmployeeDetails.Proofs[1]?.ProofTypeID || ''
          this.ProofImage1 = this.EmployeeDetails.Proofs[0]?.FrontImageUrl
          this.ProofImage2 = this.EmployeeDetails.Proofs[0]?.BackImageUrl
          this.ProofImage3 = this.EmployeeDetails.Proofs[1]?.FrontImageUrl
          this.ProofImage4 = this.EmployeeDetails.Proofs[1]?.BackImageUrl
          this.formInput.FixedIncentive = this.EmployeeDetails.FixedIncentive;
          this.formInput.IsYearlyLeaves = this.EmployeeDetails.IsYearlyLeaves;
            this.formInput.IsWFH = this.EmployeeDetails.IsWFH;

            this.formInput.IsPTStopped = this.EmployeeDetails.IsPTStopped;
            this.formInput.IsESIStopped = this.EmployeeDetails.IsESIStopped;
            this.formInput.IsPFStopped = this.EmployeeDetails.IsPFStopped;
            this.formInput.IsSDStopped = this.EmployeeDetails.IsSDStopped;

            this.formInput.IsSDStopped = this.EmployeeDetails.IsSDStopped;

            this.formInput.BasicAndDA = this.EmployeeDetails.BasicAndDA;
            this.formInput.WashingAllowance = this.EmployeeDetails.WashingAllowance;
            this.formInput.FuelAllowance = this.EmployeeDetails.FuelAllowance;
            this.formInput.SpecialAllowance = this.EmployeeDetails.SpecialAllowance;


          if (this.formInput.IsPerday == true) {
            this.ShowWeekOff = false;
          }
          else
          {
            this.ShowWeekOff = true;
          }


          this.ShowAdd = false;
          this.ShowList = false;
          this.ShowEdit = true;
          this.GetDepartments()
          // this.spinnerService.hide();
        }
        //  this.spinnerService.hide();
      }
      //  this.spinnerService.hide();

    }, (error: any) => {
      // this.spinnerService.hide();
      // this.globalToastService.error("Error while Updating the Record");
      this.ShowAlert("Error while Updating the Record", "error");
    }
    );
  }

  GetEmpShiftStatus(row: any) {
    this.ApiURL = "Admin/GetAccessStatusRole?UserID=" + this.UserID + "&feature=employee&editType=edit";
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(data => {
      if (data.Status == true) 
        {
        this.EmployeeId = row.ID;
        this.EmployeeName = row.name;
        this.branch = row.branch;
        this.department = row.dep;
        this.ApiURL = "ShiftMaster/GetEmpShiftDetails?EmployeeID=" + this.EmployeeId;
        this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(data => {
          if (data.Status == true) {
            this.GetShiftList(row.BranchID);
            this.Showshift = true;
            this.ShowList = false;
            this.DynamicArray = data.List.WeekConfig;
            this.IsWholeYear = data.List.IsWholeYear;
            this.IsJan = data.List.IsJanSelected;
            this.IsFeb = data.List.IsFebSelected;
            this.IsMarch = data.List.IsMarchSelected;
            this.IsApril = data.List.IsAprilSelected;
            this.IsMay = data.List.IsMaySelected;
            this.IsJuly = data.List.IsJulySelected;
            this.IsJune = data.List.IsJuneSelected;
            this.IsAug = data.List.IsAugSelected;
            this.IsSep = data.List.IsSepSelected;
            this.IsOct = data.List.IsOctSelected;
            this.IsNov = data.List.IsNovSelected;
            this.IsDec = data.List.IsDecSelected;
            this.IsEditable = data.List.IsEditable;
            // this.spinnerService.hide();
            var today = this.parseDateString(data.List.StartDate);
            const year = today.getFullYear();
            const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
            const day = today.getDate().toString().padStart(2, '0');
            this.formInputNew.StartDate = `${year}-${month}-${day}`;
          }
          else {
            // this.globalToastService.error("No Shift Data found")
            this.ShowAlert("No Shift Data found", "error");
          }
          //  this.spinnerService.hide();

        }, (error: any) => {
          // this.spinnerService.hide();

        }
        );
      }
      else {
        // this.globalToastService.warning(data.Message);
        this.ShowAlert(data.Message, "warning");
      }
    }, (error: any) => {
      // this.spinnerService.hide();
      // this.globalToastService.error("Failed to Validate the Access. Please Refresh page and try again");
      this.ShowAlert("Failed to Validate the Access. Please Refresh page and try again", "error");

    });
  }
  parseDateString(dateString: string): Date {
    // Split the date and time parts
    const [datePart, timePart] = dateString.split(' ');

    // Split the date part into day, month, and year
    const [year, month, day] = datePart.split('-').map(part => parseInt(part, 10));


    // Create a new Date object using the parsed components
    const parsedDate = new Date(year, month - 1, day);
    return parsedDate;
  }

  parseDateStringSlash(dateString: string): Date {
    // Split the date and time parts
    const [datePart, timePart] = dateString.split(' ');

    // Split the date part into day, month, and year
    const [day, month, year] = datePart.split('/').map(part => parseInt(part, 10));


    // Create a new Date object using the parsed components
    const parsedDate = new Date(year, month - 1, day);
    return parsedDate;
  }

  Active(ID: number) {

    this.ApiURL = "Admin/GetAccessStatusRole?UserID=" + this.UserID + "&feature=employee&editType=delete";
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(data => {
      if (data.Status == true) {
        this.spinnerService.show();
        this.EmployeeId = ID;
        this.ApiURL = "Admin/ActiveEmployee?EmpID=" + this.EmployeeId + "&key=en";;
        this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(data => {
          if (data.Status == true) {
            // this.globalToastService.success(data.Message);
            this.ShowAlert(data.Message, "success");
            this.spinnerService.hide();
            this.GetEmployeeList();

          }
          else {
            // this.globalToastService.warning(data.Message);
            this.ShowAlert(data.Message, "warning");
            this.spinnerService.hide();
          }

        }, (error: any) => {
          // this.globalToastService.error(error.message);
          this.ShowAlert(error.message, "error");
          this.spinnerService.hide();

        }
        );
      }
      else {
        // this.globalToastService.warning(data.Message);
        this.ShowAlert(data.Message, "warning");
      }
    }, (error: any) => {
      this.spinnerService.hide();
      // this.globalToastService.error("Failed to Validate the Access. Please Refresh page and try again");
      this.ShowAlert("Failed to Validate the Access. Please Refresh page and try again", "error");
    });

  }

  validateAllowances() {

  }
  // validate(name:any,data:any,salary:any){
  //   if(data > salary){
  //     this.globalToastService.error(name + "Cannot Be Greater Than Basic Salary");
  //     // this.formInput.HRA = this.EmployeeDetails.HRA
  //     // this.formInput.DA = this.EmployeeDetails.DA
  //     // this.formInput.TA = this.EmployeeDetails.TA
  //     // this.formInput.MA = this.EmployeeDetails.MA
  //   }
  //   else{

  //   }
  // }


  removeLeadingZero(event: Event, paramText: string): void {
    const inputElement = event.target as HTMLInputElement;
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

  validateHRA(value: any) {
    if (!/^[1-9][0-9]*|0?\.[0-9]+|[0-9]+\.[0-9]+$/.test(value)) {
      // this.globalToastService.warning("Please Enter Valid HRA");
      this.ShowAlert("Please Enter Valid HRA", "warning");
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
  validateDA(value: any) {
    if (!/^[1-9][0-9]*|0?\.[0-9]+|[0-9]+\.[0-9]+$/.test(value)) {
      // this.globalToastService.warning("Please Enter Valid DA");
      this.ShowAlert("Please Enter Valid DA", "warning");
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

  validateTA(value: any) {
    if (!/^[1-9][0-9]*|0?\.[0-9]+|[0-9]+\.[0-9]+$/.test(value)) {
      // this.globalToastService.warning("Please Enter Valid TA");
      this.ShowAlert("Please Enter Valid TA", "warning");
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
  validateMA(value: any) {
    if (!/^[1-9][0-9]*|0?\.[0-9]+|[0-9]+\.[0-9]+$/.test(value)) {
      // this.globalToastService.warning("Please Enter Valid MA");
      this.ShowAlert("Please Enter Valid MA", "warning");
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

    validateLTA(value: any) {
    if (!/^[1-9][0-9]*|0?\.[0-9]+|[0-9]+\.[0-9]+$/.test(value)) {
      // this.globalToastService.warning("Please Enter Valid MA");
      this.ShowAlert("Please Enter Valid LTA", "warning");
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
    validateConveyance(value: any) {
    if (!/^[1-9][0-9]*|0?\.[0-9]+|[0-9]+\.[0-9]+$/.test(value)) {
      // this.globalToastService.warning("Please Enter Valid MA");
      this.ShowAlert("Please Enter Valid Conveyance", "warning");
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



  changeStatus(row: any) {
    if (row.IsActive == true) {
      this.DeleteEmployee(row.ID);
    }
    if (row.IsActive == false) {
      this.Active(row.ID);
    }
  }

  DeleteEmployee(ID: number) {
    this.ApiURL = "Admin/GetAccessStatusRole?UserID=" + this.UserID + "&feature=employee&editType=delete";
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(data => {
      if (data.Status == true) {
        this.spinnerService.show();
        this.EmployeeId = ID;
        this.ApiURL = "Admin/DeleteEmployee?EmpID=" + this.EmployeeId + "&ExistReason=" + "Testing" + "&DateOfExist=" + this.FormattedDate + "&key=en";
        this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(data => {
          if (data.Status == true) {
            // this.globalToastService.success(data.Message);
            this.ShowAlert(data.Message, "success");
            this.spinnerService.hide();
            this.GetEmployeeList();
          }
          else {
            // this.globalToastService.warning(data.Message);
            this.ShowAlert(data.Message, "warning");
            this.spinnerService.hide();
          }

        }, (error: any) => {
          // this.globalToastService.error(error.message);
          this.ShowAlert(error.message, "error");
          this.spinnerService.hide();

        }
        );
      }
      else {
        // this.globalToastService.warning(data.Message);
        this.ShowAlert(data.Message, "warning");
      }
    }, (error: any) => {
      this.spinnerService.hide();
      // this.globalToastService.error("Failed to Validate the Access. Please Refresh page and try again");
      this.ShowAlert("Failed to Validate the Access. Please Refresh page and try again", "error");
    });
    this.spinnerService.show();
  }

  SendEmail(ID: number) {
    this.spinnerService.show();
    this.EmployeeId = ID;
    this.CurrentDate = new Date();
    this.ApiURL = "Admin/ShareCredentials?EmployeeID=" + this.EmployeeId;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(data => {
      if (data.Status == true) {
        // this.globalToastService.success(data.Message);
        this.ShowAlert(data.Message, "success");
        this.spinnerService.hide();
        window.location.reload();
      }
      else {
        // this.globalToastService.warning(data.Message);
        this.ShowAlert(data.Message, "warning");
        this.spinnerService.hide();
      }

    }, (error: any) => {
      // this.globalToastService.error(error.message);
      this.ShowAlert(error.message, "error");
      this.spinnerService.hide();

    }
    );
  }

  SendSMS(ID: number) {
    this.spinnerService.show();
    this.EmployeeId = ID;
    this.CurrentDate = new Date();
    this.ApiURL = "Account/SendCredentials?EmployeeID=" + this.EmployeeId;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(data => {
      // this.globalToastService.success("Credentials Shared Successfully");
      this.ShowAlert("Credentials Shared Successfully", "success");
      this.spinnerService.hide();
      window.location.reload();
    }, (error: any) => {
      // this.globalToastService.error(error.message);
      this.ShowAlert(error.message, "error");
      this.spinnerService.hide();

    }
    );
  }


  validateEmail(inputval: any): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(inputval)) {
      // this.globalToastService.warning("Pleasse Enter Valid Email")
      this.ShowAlert("Pleasse Enter Valid Email", "warning");
      return false
    } else {
      return true
    }
  }
  validateblood(inputval: any) {
    const input = inputval;
    const isValidEmail = /^(A|B|AB|O)[+-]$/.test(input);

    if (!isValidEmail) {
      return "Fail";
    }

    return "Ok";;
  }
  close() {
    this.Showshift = false;
    this.ShowList = true;
    this.GetEmployeeList()
    this.GetOrganization()
    this.GetOrganizationList()
    this.GetBranches()
    this.GetBranchesList()
    this.GetDepartmentsList()
  }
    UpdateEmployee() {
     this.spinnerService.show();
    if (!this.validateProofID1()) {
      return;
    }
    if (!this.validateProofID2()) {
      return;
    }
    if (this.formInput.IFSC && this.formInput.IFSC.trim() !== '') {
      // If the input is not blank, call the validateIFSC function
      if (!this.validateIFSC(this.formInput.IFSC)) {
        return; // Exit if validation fails
      }
    }
    if (this.formInput.Email && this.formInput.Email.trim() !== '') {
      // If the input is not blank, call the validateIFSC function
      if (!this.validateEmail(this.formInput.Email)) {
        return; // Exit if validation fails
      }
    }
    // this.spinnerService.show();
    this.formInput.EmpID = this.EmployeeId;
    this.formInput.Proofs = this.ProofClass;
    this.formInput.BranchID = this.selectedBranch.map((b: any) => b.Value)[0]
    this.formInput.DepartmentID = this.selectedDepartment.map((b: any) => b.Value)[0]
   if (this.formInput.DepartmentID == "" || this.formInput.DepartmentID == null || this.formInput.DepartmentID == undefined) {
      // this.globalToastService.warning("Please Select Branch");
       this.ShowAlert("Please Select Department", "warning")
       this.spinnerService.hide();
      return 
    }
    if (this.formInput.SecurityDeposit>0 &&this.formInput.SDmonthlydeduction==0) 
      {
        this.ShowAlert("Please enter security deposit deduction", "warning");
        this.spinnerService.hide();
      return;
} 
if (this.IsPercentageselected==true &&this.formInput.SDmonthlydeduction>100) 
  {
    this.ShowAlert("SD Deduction should be less than 100", "warning");
    this.spinnerService.hide();
  return;
} 
if (this.formInput.SecurityDeposit>0 &&this.formInput.SDmonthlydeduction>this.formInput.SecurityDeposit) {
    this.ShowAlert("Security deposit deduction should be lesser than actual amount", "warning");
    this.spinnerService.hide();
return;
} 
    this.formInput.Proofs = [
      {
        ProofTypeID: this.formInput.Proof1,
        FrontImageUrl: this.ProofImage1,
        BackImageUrl: this.ProofImage2,
        ProofNumber: this.formInput.ProofID1
      },
      {
        ProofTypeID: this.formInput.Proof2,
        FrontImageUrl: this.ProofImage3,
        BackImageUrl: this.ProofImage4,
        ProofNumber: this.formInput.ProofID2
    }
    
],
          console.log(this.formInput);
      console.log("Employee Update Details");
   
        this._commonservice.ApiUsingPost("Account/UpdateEmployee", this.formInput).subscribe(data => {
            this.spinnerService.hide();
       if(data.Status==true){
        // this.updateAllocation();
     
        // this.globalToastService.success("Employee Updated Successfully");
        this.ShowAlert("Employee Updated Successfully","success");
        // window.location.reload();
        this.formInput = {   
         EmpID:'',  
        EmergencyNumber:'',
        GaurdianName:'',
        OT:'0',
        BloodGroup:'',
        OfficeStartTime:'',
        OfficeEndTime:'',
        Gender:'',
        Education:'',
        FatherName:'',
        DOB:'',
        Age:0,
        Organization:'',
        OldPassword:'',
        BranchID:'',
        DepartmentID:'',
        Designation:'',
        DateOfJoining:'',
        LoanAdvanceBalance:0,
        Deduction:0,
        OldSalaryBalance:0,
        OldSalaryAdvance:0,
        AdminBalance:0,
        EmployeeBalance:0,
        NoOfSickLeave:0,
        NoOfPaidLeave:0,
        BasicSalary:0,
        Logo:'',
        AdminID:this.AdminID,
        ProfileImageURl:'',
        Password:'',
        ConfirmPassword:'',
        Email:'',
        FirstName:'',
        LastName:'',
        MobileNumber:'',
        StateID:'',
        CityID:'',
        Address:'',
        Proofs:'',
        IsMondayOff:false,
        IsTuesdayOff:false,
        IsWednesdayOff:false,
        IsFridayOff:false,
        IsSaturdayOff:false,
        IsThursdayOff:false,
        IsSundayOff:false,
        AppVersion:'1.0.0',
        IsPerday:false,
        Relationship:'',
        GrossSalary:0,
        Conveyance:0,
        LTA:0,
        HRA:0,
        Allowances:0,
        ESI:0,
        PF:0,
        DNS:0,
        RoleID:2,
        DesignationID:0,
        ProofID1:'',
        ProofID2:'',
        SettingID:0,
        DA:0,
        FinancialTypeID:1,
        Proof2:0,
        Proof1:0,
        OrgID:0,
        AlternateMobileNumber: '',
        IsESIStopped: false,
        IsPTStopped :false,
        IsPFStopped: false,
        IsSDStopped: false
        
      }
      this.showList()
           return true;
        }
        else{
          this.spinnerService.hide();
          // this.globalToastService.warning("Failed.Sorry something went wrong");
          this.ShowAlert(data.Message,"warning");
          this.ShowEdit = false
          this.ShowList = true
           return false;
        }
     
     }, (error: any) => {
      this.spinnerService.hide();
      // this.globalToastService.warning(error.message);
       this.ShowAlert(error.message,"warning")
      this.ShowEdit = false
      this.ShowList = true
      return false;

      
     }
     );
 }
 validateSickLeaveRange() {
  const value = this.formInput.NoOfSickLeave;
  if (value > 365 && this.formInput.IsYearlyLeaves==true) {
    // this.globalToastService.warning("Sick leaves should be between 1 to 365");
    this.ShowAlert("Sick leaves should be between 1 to 365","warning")
    this.formInput.NoOfSickLeave = 365;
  }
  if (value > 12 && this.formInput.IsYearlyLeaves==false) {
    // this.globalToastService.warning("Sick leaves should be between 1 to 12");
    this.ShowAlert("Sick leaves should be between 1 to 12","warning")
    this.formInput.NoOfSickLeave = 12;
  }
}
 validatePaidLeaveRange() {
  const value = this.formInput.NoOfPaidLeave;
  if (value > 365 && this.formInput.IsYearlyLeaves==true) {
    // this.globalToastService.warning("Paid leaves should be between 1 to 365");
    this.ShowAlert("Paid leaves should be between 1 to 365","warning")
    this.formInput.NoOfPaidLeave = 365;
  }
  if (value > 12 && this.formInput.IsYearlyLeaves==false) {
    // this.globalToastService.warning("Paid leaves should be between 1 to 12");
    this.ShowAlert("Paid leaves should be between 1 to 12","warning")
    this.formInput.NoOfPaidLeave = 12;
  }
}

  updateAllocation() {
    if (this.IsJan == true && this.IsFeb == true && this.IsMarch && this.IsApril == true && this.IsMay == true && this.IsJune == true && this.IsJuly == true && this.IsAug == true && this.IsSep == true && this.IsOct == true && this.IsNov == true && this.IsDec == true) {
      this.IsWholeYear = true;
    }

    const json = {
      "IsWholeYear": this.IsWholeYear,
      "AllotID": this.AllotID,
      "EmployeeID": this.EmployeeId,
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
      "WeekConfig": this.DynamicArray,
      "StartDate": this.formInputNew.StartDate,
    }
    console.log(json, "check Values going this is edit");

    this._commonservice.ApiUsingPost("ShiftMaster/UpdateAllotShift", json).subscribe(data => {
      if (data.Status == true) {
        // this.globalToastService.success(data.Message);
        this.ShowAlert(data.Message, "success")
        this.spinnerService.hide();
        window.location.reload();
      }
      else {
        // this.globalToastService.success("Failed to update shift details");
        this.ShowAlert("Failed to update shift details", "error")
        this.spinnerService.hide();
      }

    })
  }
  CheckDate(date: any) {
    this.ApiURL = "Admin/CheckDate?UserDate=" + date;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(data => {
      if (data.Status == true) {
        this.spinnerService.hide();
        return true;
      }
      else {
        this.spinnerService.hide();
        //  this.globalToastService.warning("Date should be greater than Current Date");
        this.ShowAlert("Date should be greater than Current Date", "warning")
        this.formInput.DateOfJoining = '';

        return false;
      }

    }, (error: any) => {
      this.spinnerService.hide();
      //  this.globalToastService.warning(error.message);
      this.ShowAlert(error.message, "warning")
      return false;
    }
    );
  }


  CheckDOB(date: any) {
    this.ApiURL = "Admin/CheckDate?UserDate=" + date;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(data => {
      if (data.Status == true) {
        this.spinnerService.hide();
        return true;
      }
      else {
        this.spinnerService.hide();
        //  this.globalToastService.warning("Date should be greater than Current Date");
        this.ShowAlert("Date should be greater than Current Date", "warning")
        this.formInput.DOB = '';

        return false;
      }

    }, (error: any) => {
      this.spinnerService.hide();
      //  this.globalToastService.warning(error.message);
      this.ShowAlert(error.message, "warning")
      return false;
    }
    );
  }

  getImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    if (imagePath.startsWith('http') || imagePath.startsWith('https')) {
      return imagePath;
    } else {
      return environment.Url + imagePath;
    }
  }

  UploadProof1Image1(event: any, form: NgForm) {
    if (this.formInput.Proof1 == "") {
      // this.globalToastService.warning("Please select Proof Type");
      this.ShowAlert("Please select Proof Type", "warning")
    }
    else {
      const target = event.target as HTMLInputElement;
      var img = (target.files as FileList)[0];
      if (img && img.type.startsWith('image/')) {
        this.file = (target.files as FileList)[0];

        var reader = new FileReader();
        reader.onload = (event: any) => {
          this, this.ProofIImageURl1 = event.target.result;
        }
        reader.readAsDataURL(this.file);
        this.P1choose1 = true;
        const fData: FormData = new FormData();
        fData.append('formdata', JSON.stringify(form.value));
        fData.append('FileType', "IDProof");
        if (this.file != undefined) {
          fData.append('File', this.file, this.file.name);
          this._commonservice.ApiUsingPost("Admin/FileUpload", fData).subscribe(data => { this.ProofImage1 = data.NewUrl; });
        }
      }
      else {
        // this.globalToastService.warning("Please Select valid image File");
        // this.ProofImage1 = ''
        // this.ShowAlert("Please Select valid image File","warning")
      }
    }

  }
  UploadProof1Image2(event: any, form: NgForm) {
    if (this.formInput.Proof1 == "") {
      // this.globalToastService.warning("Please select Proof Type");
      this.ShowAlert("Please select Proof Type", "warning")
    }
    else {
      const target = event.target as HTMLInputElement;
      this.file = (target.files as FileList)[0];
      if (this.file && this.file.type.startsWith('image/')) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this, this.ProofIImageURl2 = event.target.result;
        }
        reader.readAsDataURL(this.file);
        this.P1choose2 = true;
        const fData: FormData = new FormData();
        fData.append('formdata', JSON.stringify(form.value));
        fData.append('FileType', "IDProof");
        if (this.file != undefined) {
          fData.append('File', this.file, this.file.name);
          this._commonservice.ApiUsingPost("Admin/FileUpload", fData).subscribe(data => { this.ProofImage2 = data.NewUrl; });
        }
      } else {
        // this.globalToastService.warning("Please Select valid image File");
        // this.ProofImage2 = ''
        // this.ShowAlert("Please Select valid image File","warning")
      }
    }
  }
  UploadProof2Image1(event: any, form: NgForm) {
    if (this.formInput.Proof2 == "") {
      // this.globalToastService.warning("Please select Proof Type");
      this.ShowAlert("Please select Proof Type", "warning")
    }
    else {
      const target = event.target as HTMLInputElement;
      this.file = (target.files as FileList)[0];
      if (this.file && this.file.type.startsWith('image/')) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this, this.ProofIImageURl1 = event.target.result;
        }
        reader.readAsDataURL(this.file);
        this.P2choose1 = true;
        const fData: FormData = new FormData();
        fData.append('formdata', JSON.stringify(form.value));
        fData.append('FileType', "IDProof");
        if (this.file != undefined) {
          fData.append('File', this.file, this.file.name);
          this._commonservice.ApiUsingPost("Admin/FileUpload", fData).subscribe(data => { this.ProofImage3 = data.NewUrl; });
        }
      } else {
        // this.globalToastService.warning("Please Select valid image File");
        // this.ProofImage3 = ''
        // this.ShowAlert("Please Select valid image File","warning")
      }
    }
  }
  UploadProof2Image2(event: any, form: NgForm) {
    if (this.formInput.Proof2 == "") {
      // this.globalToastService.warning("Please select Proof Type");
      this.ShowAlert("Please select Proof Type", "warning")
    }
    else {
      const target = event.target as HTMLInputElement;
      this.file = (target.files as FileList)[0];
      if (this.file && this.file.type.startsWith('image/')) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this, this.ProofIImageURl2 = event.target.result;
        }
        reader.readAsDataURL(this.file);
        this.P2choose2 = true;
        const fData: FormData = new FormData();
        fData.append('formdata', JSON.stringify(form.value));
        fData.append('FileType', "IDProof");
        if (this.file != undefined) {
          fData.append('File', this.file, this.file.name);
          this._commonservice.ApiUsingPost("Admin/FileUpload", fData).subscribe(data => { this.ProofImage4 = data.NewUrl; });
        }
      } else {
        // // this.globalToastService.warning("Please Select valid image File");
        // this.ProofImage4 = 
        // this.ShowAlert("Please Select valid image File","warning")
      }
    }
  }
  clearProof1() {
    this.formInput.Proof1 = ''
    this.formInput.ProofID1 = ''
    this.ProofImage1 = ''
    this.ProofImage2 = ''
  }
  clearProof2() {
    this.formInput.Proof2 = ''
    this.formInput.ProofID2 = ''
    this.ProofImage3 = ''
    this.ProofImage4 = ''
  }
  checkProof(event: any) {
    if (this.formInput.Proof1 == null || this.formInput.Proof1 == undefined || this.formInput.Proof1 == "") {
      // this.globalToastService.warning("Please select Proof I");
      this.ShowAlert("Please select Proof I", "warning")
      this.formInput.Proof2 = "";
    }
    else {
      if (this.formInput.Proof1 == event.Value) {
        // this.globalToastService.warning("Proof Types should be unique");
        this.ShowAlert("Proof Types should be unique", "warning")
        this.formInput.Proof1 = "";
        this.formInput.Proof2 = "";
      }
    }
  }

  showprofession() {
    this.ShowProfile = true;
    this.ShowLoan = false;
    this.ShowProof = false;
    this.ShowSalary = false;
    this.ShowBank = false;
    this.ShowProfession = true;
    this.ProfessionClass = "nav-link active";
    this.ProfileClass = "nav-link";
    this.PrfClass = "nav-link";
    this.BankClass = "nav-link";
    this.LoanClass = "nav-link";
    this.SalaryClass = "nav-link";
  }

  showprofile() {
    this.ShowProfile = true;
    this.ShowLoan = false;
    this.ShowProof = false;
    this.ShowSalary = false;
    this.ShowBank = false;
    this.ShowProfession = false;
    this.ProfessionClass = "nav-link";
    this.ProfileClass = "nav-link active";
    this.PrfClass = "nav-link";
    this.BankClass = "nav-link";
    this.LoanClass = "nav-link";
    this.SalaryClass = "nav-link";
  }
  showloan() {
    this.ShowProfile = false;
    this.ShowLoan = true;
    this.ShowProof = false;
    this.ShowSalary = false;
    this.ShowProfession = false;
    this.ProfessionClass = "nav-link";
    this.ShowBank = false; this.ProfileClass = "nav-link";
    this.PrfClass = "nav-link";
    this.BankClass = "nav-link";
    this.LoanClass = "nav-link active";
    this.SalaryClass = "nav-link";
  }
  showproof() {
    this.ShowProfile = false;
    this.ShowLoan = false;
    this.ShowProof = true;
    this.ShowSalary = false;
    this.ShowBank = false;
    this.ShowProfession = false;
    this.ProfessionClass = "nav-link";
    this.ProfileClass = "nav-link";
    this.PrfClass = "nav-link active";
    this.BankClass = "nav-link";
    this.LoanClass = "nav-link";
    this.SalaryClass = "nav-link";
  }
  showsalary() {
    this.ShowProfile = false;
    this.ShowLoan = false;
    this.ShowProof = false;
    this.ShowSalary = true;
    this.ShowBank = false;
    this.ShowProfession = false;
    this.ProfessionClass = "nav-link";
    this.ProfileClass = "nav-link";
    this.PrfClass = "nav-link";
    this.BankClass = "nav-link";
    this.LoanClass = "nav-link";
    this.SalaryClass = "nav-link active";
  }
  showbank() {
    this.ShowProfile = false;
    this.ShowLoan = false;
    this.ShowProof = false;
    this.ShowSalary = false;
    this.ShowBank = true;
    this.ShowProfession = false;
    this.ProfessionClass = "nav-link";
    this.ProfileClass = "nav-link";
    this.PrfClass = "nav-link";
    this.BankClass = "nav-link active";
    this.LoanClass = "nav-link";
    this.SalaryClass = "nav-link";
  }
  OnMonthlySalaryChange(val: any, text: any) {
    if (text == 'Month') {
      var amount = val / 30;
      this.formInput.BasicSalary = amount;
    }
    if (text == 'Day') {
      var amount = val * 30;
      this.formInput.GrossSalary = amount;
    }
  }

  SetSalaryID(ID: any) {
    this.SettingID = ID;
    if (this.formInput.GrossSalary != null && this.formInput.GrossSalary != "" && this.formInput.GrossSalary != 0 && this.formInput.GrossSalary != undefined && this.formInput.GrossSalary != '') {
      this.OnSalaryChange(this.formInput.GrossSalary);
    }
  }

  OnSalaryChange(val: any) {
    if (this.SettingID != null && this.SettingID != "" && this.SettingID != 0 && this.SettingID != undefined && this.SettingID != '') {
      this.spinnerService.show();
      this.ApiURL = "Admin/GetSalaryCalculation?SettingID=" + this.SettingID + "&GrossSalary=" + val;
      this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(data => {
        if (data.Status == true) {
          this.formInput.HRA = data.List.HRA;
          this.formInput.DA = data.List.DA;
          this.formInput.PF = data.List.PF;
          this.formInput.ESI = data.List.ESI;
          this.formInput.LTA = data.List.LTA;
             this.formInput.TA = data.List.TA;
                this.formInput.Conveyance = data.List.Conveyance;
          this.formInput.Allowances = 0;
          this.formInput.BasicSalary = data.List.BasicSalary;
        }
      });
      this.spinnerService.hide();
    }

  }

  OnConfirmClick() {
    if (this.confirmpasswordinput == "text") {
      this.confirmpasswordinput = "password";
    }
    else {
      this.confirmpasswordinput = "text";
    }
  }
  OnPassClick() {
    if (this.passwordinput == "text") {
      this.passwordinput = "password";
    }
    else {
      this.passwordinput = "text";
    }

  }



  validatealternatemobile(event: any, val: any) {
    const inputChar = String.fromCharCode(event.keyCode || event.charCode);
    if (!/^\d+$/.test(inputChar)) {
      // this.globalToastService.warning("Please Enter Valid Input")
      this.ShowAlert("Please Enter Valid Input", "warning")
      this.formInput.AlternateMobileNumber.clear();
    }
    else {
      if ((val == "" || val == undefined || val == null) && (event.key != "6"
        && event.key != "7" && event.key != "8" && event.key != "9")) {
        // this.globalToastService.warning("First digit should contain numbers between 6 to 9");
        this.ShowAlert("First digit should contain numbers between 6 to 9", "warning")
        this.formInput.AlternateMobileNumber.clear();
      }
    }
  }
  validatemobilenumber(event: any, val: any) {
    const inputChar = String.fromCharCode(event.keyCode || event.charCode);
    if (!/^\d+$/.test(inputChar)) {
      // this.globalToastService.warning("Please Enter Valid Input")
      this.ShowAlert("Please Enter Valid Input", "warning")
      this.formInput.MobileNumber.clear();
    }
    else {
      if ((val == "" || val == undefined || val == null) && (event.key != "6"
        && event.key != "7" && event.key != "8" && event.key != "9")) {
        // this.globalToastService.warning("First digit should contain numbers between 6 to 9");
        this.ShowAlert("First digit should contain numbers between 6 to 9", "warning")
        this.formInput.MobileNumber.clear();
      }
    }
  }
  validategardiannumber(event: any) {
    const inputChar = String.fromCharCode(event.keyCode || event.charCode);
    if (!/^\d+$/.test(inputChar)) {
      // this.globalToastService.warning("Please Enter Valid Input")
      this.ShowAlert("Please Enter Valid Input", "warning")
      {
        this.formInput.EmergencyNumber.clear();
      }
    }
    else {
      if ((this.formInput.EmergencyNumber == "" || this.formInput.EmergencyNumber == undefined || this.formInput.EmergencyNumber == null) && (event.key != "6"
        && event.key != "7" && event.key != "8" && event.key != "9")) {
        // this.globalToastService.warning("First digit should contain numbers between 6 to 9");
        this.ShowAlert("First digit should contain numbers between 6 to 9", "warning")
        this.formInput.EmergencyNumber.clear();
      }
    }
  }
  validategross(event: any) {
    if (!/^\d+$/.test(event)) {
      console.log(event);

      // this.globalToastService.warning("Please Enter Valid Input")
      this.ShowAlert("Please Enter Valid Input", "warning")
      {
        this.formInput.GrossSalary = '';
      }
    }
  }
  validateESI(salary: any) {
    if (salary > 21000) {
      // this.globalToastService.warning("The Existing Wage Limit for Coverage Under the Act Effective from 01.01.2017 is Rs.21,000/- per month (Rs.25,000/- per month in the Case of Persons with Disability)")
      this.ShowAlert("The Existing Wage Limit for Coverage Under the Act Effective from 01.01.2017 is Rs.21,000/- per month (Rs.25,000/- per month in the Case of Persons with Disability)", "warning")

      this.formInput.ESI = '';
    }
    else if (this.formInput.ESI > salary) {
      // this.globalToastService.warning("Dear User Your ESI Amount Must Be Lesser Than Above Mentioned Salary")
      this.ShowAlert("Dear User Your ESI Amount Must Be Lesser Than Above Mentioned Salary", "warning")
      this.formInput.ESI = '';
    }
  }

  formatNumber(num: number) {
    return num % 1 === 0 ? num : parseFloat(num.toFixed(2));
  }

  calculate(type: string) {
    for (let i = 0; i < this.SalaryFormulae.length; i++) {
      const sf = this.SalaryFormulae[i];
      if (sf.SalaryType == type) {
        let value = 0
        if (sf.isBasic) value += this.formInput.BasicSalary
        if (sf.isHRA) value += this.formInput.HRA
        if (sf.isDA) value += this.formInput.DA
        if (sf.isTA) value += this.formInput.TA
        if (sf.isMA) value += this.formInput.MA
         if (sf.isLTA) value += this.formInput.LTA
          if (sf.isConveyance) value += this.formInput.Conveyance

        value = this.formatNumber(Number(value))


        if ((sf.Min == null || value >= sf.Min) && (sf.Max == null || value <= sf.Max)) {

          console.log("--------------------------");
          console.log("--------------------------");
          console.log(sf);
          console.log("value : ", value);
          console.log("formInput : ", this.formInput);
          console.log(sf.Min, " - ", sf.Max);
          console.log(sf.Min == null, value >= sf.Mi, sf.Max == null, value <= sf.Max);

          console.log("--------------------------");
          console.log("--------------------------");
          if (sf.isAmount == true) {
            return this.formatNumber(Number(sf.Value))
          } else {
            return this.formatNumber(Number(value * (sf.Value / 100)))
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

    if (Number(this.formInput.PF) !== Number(oldPFValue)) {
      this.pfUpdating = true;
      setTimeout(() => {
        this.pfUpdating = false;
      }, 3000);
    }
  }

  calculateESI() {
    if (this.SalarySettingList["isESI"] == false || this.formInput.IsPerday == true) return;
    let oldESIValue = Number(this.formInput.ESI);

    this.formInput.ESI = this.calculate('ESI')

    if (Number(this.formInput.ESI) !== Number(oldESIValue)) {
      this.esiUpdating = true;
      setTimeout(() => {
        this.esiUpdating = false;
      }, 3000);
    }
  }

  calculateGross() {
    // if (this.SalarySettingList["isBasic"] == true) return;
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
      (Number(this.formInput.Conveyance) || 0));

      if(this.formInput.GrossSalary > 0){
        this.formInput.CTC=this.formInput.GrossSalary * 12;
      }
  }

  validatebasic(basic: any) {
    if (!/^[1-9][0-9]*|0?\.[0-9]+|[0-9]+\.[0-9]+$/.test(basic)) {
      //  this.globalToastService.warning("Please Enter Valid Basic Salary")
      this.ShowAlert("Please Enter Valid Basic Salary", "warning")
      this.formInput.BasicSalary = 0;
      this.calculateGross()
      this.calculatePF()
      this.calculateESI()
    } else {
      this.formInput.BasicSalary = this.formatNumber(basic)
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

            } else {
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
            this.ShowAlert("Please Enter Valid Gross", "warning");
            setTimeout(() => {
                this.formInput.GrossSalary = 0;
                setGrossParameters()
            });
        } else {
            setGrossParameters()
        }
    }


  //validateGross(event: any) {
  //  this.cdr.detectChanges()
  //  console.log(event);

  //  let setGrossParameters = () => {
  //    if (this.SalarySettingList) {
  //      this.formInput.BasicSalary = this.formatNumber(event * (this.SalarySettingList["Basic"] / 100))
  //      this.formInput.HRA = this.formatNumber(event * (this.SalarySettingList["HRA"] / 100))
  //      this.formInput.DA = this.formatNumber(event * (this.SalarySettingList["DA"] / 100))
  //      this.formInput.TA = this.formatNumber(event * (this.SalarySettingList["TA"] / 100))
  //      this.formInput.MA = this.formatNumber(event * (this.SalarySettingList["MA"] / 100))
  //      this.formInput.LTA = this.formatNumber(event * (this.SalarySettingList["LTA"] / 100))
  //      this.formInput.Conveyance = this.formatNumber(event * (this.SalarySettingList["Conveyance"] / 100))
  //    } else {
  //      this.formInput.BasicSalary = 0
  //      this.formInput.HRA = 0
  //      this.formInput.DA = 0
  //      this.formInput.TA = 0
  //      this.formInput.MA = 0
  //      this.formInput.LTA = 0
  //      this.formInput.Conveyance = 0
  //    }
  //    this.validatebasic(this.formInput.BasicSalary);
  //  }

  //  if (!/^\d+$/.test(event)) {
  //    // this.globalToastService.warning("Please Enter Valid Gross");
  //    this.ShowAlert("Please Enter Valid Gross", "warning")
  //    this.formInput.GrossSalary = 0;
  //    setGrossParameters()
  //  } else {
  //    setGrossParameters()
  //    // this.SalaryFormulaeStatements['BasicSalary'] = `${event}(Gross)`
  //  }
  //}

  // validateHRA(value:any){
  //   this.formInput.HRA = value
  //   this.calculateESI()
  //   this.calculatePF
  // }
  // validateDA(value:any){
  //   this.formInput.DA = value
  //   this.calculateESI()
  //   this.calculatePF
  // }
  // validateTA(value:any){
  //   this.formInput.TA = value
  //   this.calculateESI()
  //   this.calculatePF
  // }
  // validateMA(value:any){
  //   this.formInput.MA = value
  //   this.calculateESI()
  //   this.calculatePF
  // }


  // validatebasic(event:any)
  // {
  //   const inputChar = String.fromCharCode(event.keyCode || event.charCode);
  //   if (!/^\d+$/.test(inputChar)) {
  //   this.globalToastService.warning("Please Enter Valid Input")
  //   {
  //    this.formInput.Basic='';
  //   }
  //   }
  // }
  validateESIRange(event: any) {
    const firstvalue = this.formInput.BasicSalary;
    const secondvalue = this.formInput.ESI;
    if (secondvalue > firstvalue) {
      // this.globalToastService.warning("E.S.I Cannot Be Greater Than Salary");
      this.ShowAlert("E.S.I Cannot Be Greater Than Salary", "warning")
      this.formInput.ESI = null;
    }
  }
  validatePFRange(event: any) {
    const firstvalue = this.formInput.BasicSalary;
    const secondvalue = this.formInput.PF;
    if (secondvalue > firstvalue) {
      // this.globalToastService.warning("EPF Cannot Be Greater Than Salary");
      this.ShowAlert("EPF Cannot Be Greater Than Salary", "warning")
      this.formInput.PF = null;
    }
  }

  validatefixedincentive(event: any) {
    const inputChar = String.fromCharCode(event.keyCode || event.charCode);
    if (!/^\d+$/.test(inputChar)) {
      // this.globalToastService.warning("Please Enter Valid Input")
      this.ShowAlert("Please Enter Valid Input", "warning")
      this.formInput.FixedIncentive.clear();
    }
  }

  validateother(event: any) {
    const inputChar = String.fromCharCode(event.keyCode || event.charCode);
    if (!/^\d+$/.test(inputChar)) {
      // this.globalToastService.warning("Please Enter Valid Input")
      this.ShowAlert("Please Enter Valid Input", "warning")
      {
        this.formInput.Allowances = '';
      }
    }
  }
  validateesi(event: any) {
    const inputChar = String.fromCharCode(event.keyCode || event.charCode);
    if (!/^\d+$/.test(inputChar)) {
      // this.globalToastService.warning("Please Enter Valid Input")
      this.ShowAlert("Please Enter Valid Input", "warning")
      {
        this.formInput.ESI = '';
      }
    }
  }
  validatepf(event: any) {
    const inputChar = String.fromCharCode(event.keyCode || event.charCode);
    if (!/^\d+$/.test(inputChar)) {
      // this.globalToastService.warning("Please Enter Valid Input")
      this.ShowAlert("Please Enter Valid Input", "warning")
      {
        this.formInput.PF = '';
      }
    }
  }
  validateda(event: any) {
    const inputChar = String.fromCharCode(event.keyCode || event.charCode);
    if (!/^\d+$/.test(inputChar)) {
      // this.globalToastService.warning("Please Enter Valid Input")
      this.ShowAlert("Please Enter Valid Input", "warning")
      {
        this.formInput.DA = '';
      }
    }
  }
  validatehra(event: any) {
    const inputChar = String.fromCharCode(event.keyCode || event.charCode);
    if (!/^\d+$/.test(inputChar)) {
      // this.globalToastService.warning("Please Enter Valid Input")
      this.ShowAlert("Please Enter Valid Input", "warning")
      {
        this.formInput.HRA = '';
      }
    }
  }


  validateaccountnumber(event: any) {
    const inputChar = String.fromCharCode(event.keyCode || event.charCode);
    if (!/^\d+$/.test(inputChar)) {
      // this.globalToastService.warning("Please Enter Valid Input")
      this.ShowAlert("Please Enter Valid Input", "warning")
      this.formInput.AccountNumber.clear();
    }
  }

  validateoldsalary(event: any) {
    const inputChar = String.fromCharCode(event.keyCode || event.charCode);
    if (!/^\d+$/.test(inputChar)) {
      // this.globalToastService.warning("Please Enter Valid Input")
      this.ShowAlert("Please Enter Valid Input", "warning")
      this.formInput.OldSalaryBalance.clear();
    }
  }

  validatepaidleave(event: any) {
    const inputChar = String.fromCharCode(event.keyCode || event.charCode);
    if (!/^\d+$/.test(inputChar)) {
      // this.globalToastService.warning("Please Enter Valid Input")
      this.ShowAlert("Please Enter Valid Input", "warning")
      this.formInput.NoOfPaidLeave.clear();
    }
  }
  validatesickleave(event: any) {
    const inputChar = String.fromCharCode(event.keyCode || event.charCode);
    if (!/^\d+$/.test(inputChar)) {
      // this.globalToastService.warning("Please Enter Valid Input")
      this.ShowAlert("Please Enter Valid Input", "warning")
      this.formInput.NoOfSickLeave.clear();
    }
  }
  validatesalaryadvance(event: any) {
    const inputChar = String.fromCharCode(event.keyCode || event.charCode);
    if (!/^\d+$/.test(inputChar)) {
      // this.globalToastService.warning("Please Enter Valid Input")
      this.ShowAlert("Please Enter Valid Input", "warning")
      this.formInput.OldSalaryAdvance.clear();
    }
  }

  validateloandue(event: any) {
    const inputChar = String.fromCharCode(event.keyCode || event.charCode);
    if (!/^\d+$/.test(inputChar)) {
      // this.globalToastService.warning("Please Enter Valid Input")
      this.ShowAlert("Please Enter Valid Input", "warning")
      this.formInput.LoanAdvanceBalance.clear();
    }
  }
  validatesddue(event: any) {
    const inputChar = String.fromCharCode(event.keyCode || event.charCode);
    if (!/^\d+$/.test(inputChar)) {
      // this.globalToastService.warning("Please Enter Valid Input")
      this.ShowAlert("Please Enter Valid Input", "warning")
      this.formInput.SecurityDeposit.clear();
    }
    else{
      this.formInput.SDbalance=this.formInput.SecurityDeposit;
    }
  }
  validatededuction(event: any) {
    const inputChar = String.fromCharCode(event.keyCode || event.charCode);
    if (!/^\d+$/.test(inputChar)) {
      // this.globalToastService.warning("Please Enter Valid Input")
      this.ShowAlert("Please Enter Valid Input", "warning")
      this.formInput.Deduction.clear();
    }
   
  }
  
  validatesddeduction(event: any,val:any) {
    const inputChar = String.fromCharCode(event.keyCode || event.charCode);
    if (!/^\d+$/.test(inputChar)) {
      // this.globalToastService.warning("Please Enter Valid Input")
      this.ShowAlert("Please Enter Valid Input", "warning")
      this.formInput.SDmonthlydeduction.clear();
    }
    else
    {
      if (val > 100 && this.IsPercentageselected==true) {
        this.ShowAlert(
          "Deduction % Cannot be greater than 100"
        ,"warning");
      this.formInput.SDmonthlydeduction=0;
      }
    }
  }

  CheckDeduction(val: any) {
    if (this.formInput.LoanAdvanceBalance == null || this.formInput.LoanAdvanceBalance == undefined || this.formInput.LoanAdvanceBalance == '') {
      // this.globalToastService.warning("Please Enter Loan Due First");
      this.ShowAlert("Please Enter Loan Due First", "warning")
      this.formInput.Deduction = 0;
    }
    else {
      if (val > this.formInput.LoanAdvanceBalance) {
        // this.globalToastService.warning("Deduction Cannot be greater than Loan Due");
        this.ShowAlert("Deduction Cannot be greater than Loan Due", "warning")
        this.formInput.Deduction = 0;
      }
    }
  }
  OnProofISelection(event: any) {
    this.ApiURL = "Admin/GetPattern?ProofID=" + event.target.value;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(data => {
      this.ProofIPlaceHolder = data;
    });
    this.formInput.ProofID1 = ''
    const selectedValue = parseInt(event.target.value);
    const selectedState = this.ProofList.find((state: any) => state.Value === selectedValue);
    if (selectedState) {
      this.getProofName1(selectedState);
    }
    this.updateProofList()
  }
  OnProofIISelection(event: any) {
    this.ApiURL = "Admin/GetPattern?ProofID=" + event.target.value;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(data => {
      this.ProofIIPlaceHolder = data;
    });
    this.formInput.ProofID2 = ''
    const selectedValue = parseInt(event.target.value);
    const selectedState = this.ProofList.find((state: any) => state.Value === selectedValue);
    if (selectedState) {
      this.getProofName2(selectedState);
    }
  }
  updateProofList() {
    this.ProofList = []
    for (let i = 0; i < this.originalProofList.length; i++) {
      const proof = this.originalProofList[i]
      proof['disabled'] = true
      console.log(this.formInput.Proof1, proof.Value, this.formInput.Proof2, proof.Value, this.formInput.Proof1 != proof.Value && this.formInput.Proof2 != proof.Value);
      if (this.formInput.Proof1 != proof.Value && this.formInput.Proof2 != proof.Value) {
        proof['disabled'] = false
      }
      this.ProofList.push(proof)
    }
    console.log(this.ProofList.map((a: any) => a.disabled));

  }

  getProofName1(name: any) {
    this.proofName1 = name.Text
  }
  getProofName2(name: any) {
    this.proofName2 = name.Text
  }
  validateProofID1(): boolean {
    const proofType = this.proofName1;
    const proofID = this.formInput.ProofID1;
    if (proofType === 'Aadhar Card' && !/^\d{12}$/.test(proofID)) {
      //  this.globalToastService.warning('Aadhar number must be 12 digits.')
      this.ShowAlert("Aadhar number must be 12 digits.", "warning")
      return false
    } else if (proofType === 'PAN Card' && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(proofID)) {
      // this.globalToastService.warning('PAN number must be 10 characters in the correct format.')
      this.ShowAlert("PAN number must be 10 characters in the correct format.", "warning")
      return false
    } else if (proofType === 'Driving License' && !/^[A-Z]{2}\d{2}\d{4}\s?\d{7}$/.test(proofID)) {
      //  this.globalToastService.warning('Driving License number must be 10 to 15 alphanumeric characters.')
      this.ShowAlert("Driving License number must be 10 to 15 alphanumeric characters.", "warning")
      return false
    } else {
      return true
    }
  }

  validateProofID2(): boolean {
    const proofType = this.proofName2;
    const proofID = this.formInput.ProofID2;
    if (proofType === 'Aadhar Card' && !/^\d{12}$/.test(proofID)) {
      //  this.globalToastService.warning('Aadhar number must be 12 digits.')
      this.ShowAlert("Aadhar number must be 12 digits.", "warning")
      return false
    } else if (proofType === 'PAN Card' && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(proofID)) {
      // this.globalToastService.warning('PAN number must be 10 characters in the correct format.')
      this.ShowAlert("PAN number must be 10 characters in the correct format.", "warning")
      return false
    } else if (proofType === 'Driving License' && !/^[A-Z]{2}\d{2}\d{4}\s?\d{7}$/.test(proofID)) {
      //  this.globalToastService.warning('Driving License number must be 10 to 15 alphanumeric characters.')
      this.ShowAlert("Driving License number must be 10 to 15 alphanumeric characters.", "warning")
      return false
    } else {
      return true
    }
  }

  ValidatePersonal() {

    this.ShowProfile = true;
    this.ShowLoan = false;
    this.ShowProof = false;
    this.ShowSalary = false;
    this.ShowBank = false;
    this.ShowProfession = false;
    this.ProfessionClass = "nav-link";
    this.ProfileClass = "nav-link active";
    this.PrfClass = "nav-link";
    this.BankClass = "nav-link ";
    this.LoanClass = "nav-link";
    this.SalaryClass = "nav-link";
    return true;

  }

  OnDesignationSelection(event: any) {
    var ID = event.target.Value;
  }

  onDateChange(event: any) {
    const dateValue = event.target.value;
    if (dateValue) {
      const year = new Date(dateValue).getFullYear().toString();
      if (year.length > 4) {
        // this.globalToastService.warning('The year cannot exceed four digits', 'Invalid Year');
        this.ShowAlert("The year cannot exceed four digits", "warning")
        this.formInput.DateOfJoining = ''
      } else {
        return
      }
    }
  }

    onBirthDateChange(event: any) {
    const dateValue = event.target.value;
    if (dateValue) {
      const year = new Date(dateValue).getFullYear().toString();
      if (year.length > 4) {
        this.ShowAlert("The year cannot exceed four digits", "warning")
        this.formInput.DOB = '';
      } else {
         if ( this.formInput.DOB) {
      this.CurrentDate = new Date();
      const dateString =  this.formInput.DOB + 'T10:30:00'; 
      const dateObj = new Date(dateString);
      this.DOB = dateObj;
      var timeDiff = Math.abs(this.CurrentDate - this.DOB);
      this.formInput.Age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
      if(this.formInput.Age<18)
      {
         this.ShowAlert("Employee age should be 18 or 18+", "warning");
         this.formInput.DOB = '';
      }
    }
      }
    }
  }
  ValidateUpdate() {
    const accountNumberStr = this.formInput.AccountNumber?.toString();
    if (this.formInput.FirstName == "" || this.formInput.FirstName == null || this.formInput.FirstName == undefined) {
      // this.globalToastService.warning("Please Enter FirstName");
      this.ShowAlert("Please Enter FirstName", "warning")
      this.spinnerService.hide();
      return false;
    }
    else if (this.formInput.MobileNumber == "" || this.formInput.MobileNumber == null || this.formInput.MobileNumber == undefined) {
      // this.globalToastService.warning("Please Enter 10 digit Mobile Number...!");
      this.ShowAlert("Please Enter 10 digit Mobile Number...!", "warning")
      this.spinnerService.hide();
      return false;
    }
    else if (this.formInput.BranchID == "" || this.formInput.BranchID == null || this.formInput.BranchID == undefined) {
      // this.globalToastService.warning("Please Select Branch");
      this.ShowAlert("Please Select Branch", "warning")
      return false;
    }
    else if (this.formInput.DateOfJoining == "" || this.formInput.DateOfJoining == null || this.formInput.DateOfJoining == undefined) {
      // this.globalToastService.warning("Please Enter DateOfJoining");
      this.ShowAlert("Please Enter DateOfJoining", "warning")
      return false;
    }
    else if (this.formInput.Password == "" || this.formInput.Password == null || this.formInput.Password == undefined) {
      // this.globalToastService.warning("Please Enter Password");
      this.ShowAlert("Please Enter Password", "warning")
      this.spinnerService.hide();
      return false;
    }
    else if (this.formInput.ConfirmPassword == "" || this.formInput.ConfirmPassword == null || this.formInput.ConfirmPassword == undefined) {
      // this.globalToastService.warning("Please Enter Confirm Password");
      this.ShowAlert("Please Enter Confirm Password", "warning")
      this.spinnerService.hide();
      return false;
    }
    else if (this.formInput.Password.length < 6) {
      // this.globalToastService.warning("Password must be at least 6 characters")
      this.ShowAlert("Password must be at least 6 characters", "warning")
      this.spinnerService.hide();
      return false;
    }
    else if (this.formInput.Password != this.formInput.ConfirmPassword) {
      // this.globalToastService.warning("Password and Confirm Password doesn't match");
      this.ShowAlert("Password and Confirm Password doesn't match", "warning")
      this.spinnerService.hide();
      return false;
    }
    else if (this.formInput.IsPerday != true && this.formInput.IsPerday != false) {
      // this.globalToastService.warning("Please Select Salary Type");
      this.ShowAlert("Please Select Salary Type", "warning")
      this.spinnerService.hide();
      return false;
    }
    else if (this.formInput.BasicSalary == "" || this.formInput.BasicSalary == null || this.formInput.BasicSalary == undefined) {
      // this.globalToastService.warning("Please Enter Basic Salary");
      this.ShowAlert("Please Enter Basic Salary", "warning")
      this.spinnerService.hide();
      return false;
    }
    else if (accountNumberStr && accountNumberStr.length < 9) {
      // this.globalToastService.warning("Account Number Should Be Valid");
      this.ShowAlert("Account Number Should Be Valid", "warning")
      this.spinnerService.hide();
      return false;
    }
    // else if (this.formInput.Email != ""&&this.formInput.Email!=null &&this.formInput.Email!=undefined){
    //     this.mail=this.validateEmail(this.formInput.Email);
    //   }
    //    if(this.mail!="Ok") 
    //  {
    //   this.globalToastService.warning("Please Enter Valid Email ID"); 
    //  return false;
    //  }
    else {
      if (this.formInput.IsPerday == true) {
        this.formInput.IsSundayOff = false;
        this.formInput.IsMondayOff = false;
        this.formInput.IsTuesdayOff = false;
        this.formInput.IsWednesdayOff = false;
        this.formInput.IsThursdayOff = false;
        this.formInput.IsFridayOff = false;
        this.formInput.IsSaturdayOff = false;
      }
      this.UpdateEmployee();
      return true;
    }
  }

  ValidateProfession() {
    // if (this.formInput.BranchID == "" ||this.formInput.BranchID ==null||this.formInput.BranchID ==undefined) {
    //     this.globalToastService.warning("Please Select Branch");
    //     return false;
    //    }
    //     else if (this.formInput.Password == ""||this.formInput.Password==null ||this.formInput.Password==undefined) {
    //   this.globalToastService.warning("Please Enter Password");
    //   this.spinnerService.hide();
    //   return false;
    // }
    // else if (this.formInput.ConfirmPassword == ""||this.formInput.ConfirmPassword==null ||this.formInput.ConfirmPassword==undefined) {
    //   this.globalToastService.warning("Please Enter Confirm Password");
    //   this.spinnerService.hide();
    //   return false;
    // }
    // else if (this.formInput.Password != this.formInput.ConfirmPassword) {
    //   this.globalToastService.warning("Password and Confirm Password doesn't match");
    //   this.spinnerService.hide();
    //   return false;
    // }
    //    else{
    this.ShowProfile = false;
    this.ShowLoan = false;
    this.ShowProof = false;
    this.ShowSalary = false;
    this.ShowBank = true;
    this.ShowProfession = false;
    this.ProfessionClass = "nav-link";
    this.ProfileClass = "nav-link";
    this.PrfClass = "nav-link";
    this.BankClass = "nav-link active";
    this.LoanClass = "nav-link";
    this.SalaryClass = "nav-link";
    return true;
    //  }

  }

  ValidateProfile() {
    // if (this.formInput.FirstName == "" ||this.formInput.FirstName==null ||this.formInput.FirstName==undefined) {
    //   this.globalToastService.warning("Please Enter FirstName");
    //   this.spinnerService.hide();
    //   return false;
    // }  
    // else if (this.formInput.MobileNumber == ""||this.formInput.MobileNumber==null ||this.formInput.MobileNumber==undefined) {
    //   this.globalToastService.warning("Please Enter 10 digit Mobile Number...!");
    //   this.spinnerService.hide();
    //   return false;
    // }
    // else if (this.formInput.DateOfJoining == ""||this.formInput.DateOfJoining==null ||this.formInput.DateOfJoining==undefined) {
    //   this.globalToastService.warning("Please Select DateOfJoining...!");
    //   this.spinnerService.hide();
    //   return false;
    // }
    // else if (this.formInput.BranchID == "" ||this.formInput.BranchID ==null||this.formInput.BranchID ==undefined) {
    //   this.globalToastService.warning("Please Select Branch");
    //   return false;
    // }
    // else if (this.formInput.DepartmentID == "" ||this.formInput.DepartmentID ==null||this.formInput.DepartmentID ==undefined) {
    //   this.globalToastService.warning("Please Select Department");
    //   return false;
    // }
    // else if (this.formInput.RoleID == "" ||this.formInput.RoleID ==null||this.formInput.RoleID ==undefined) {
    //   this.globalToastService.warning("Please Select Role");
    //   return false;
    // }
    // else if (this.formInput.DesignationID == "" ||this.formInput.DesignationID ==null||this.formInput.DesignationID ==undefined) {
    //   this.globalToastService.warning("Please Select Designation");
    //   return false;
    // }

    // else if (this.formInput.Email == ""||this.formInput.Email==null ||this.formInput.Email==undefined) {
    //   this.globalToastService.warning("Please Enter EmailID");
    //   this.spinnerService.hide();
    //   return false;
    // }
    // else if (this.formInput.EmergencyNumber == ""||this.formInput.EmergencyNumber==null ||this.formInput.EmergencyNumber==undefined) {
    //   this.globalToastService.warning("Please Enter Emergency Number");
    //   this.spinnerService.hide();
    //   return false;
    // }
    // else if (this.formInput.Gender == ""||this.formInput.Gender==null ||this.formInput.Gender==undefined) {
    //   this.globalToastService.warning("Please Select Gender");
    //   this.spinnerService.hide();
    //   return false;
    // }
    // else if (this.formInput.Password == ""||this.formInput.Password==null ||this.formInput.Password==undefined) {
    //   this.globalToastService.warning("Please Enter Password");
    //   this.spinnerService.hide();
    //   return false;
    // }
    // else if (this.formInput.ConfirmPassword == ""||this.formInput.ConfirmPassword==null ||this.formInput.ConfirmPassword==undefined) {
    //   this.globalToastService.warning("Please Enter Confirm Password");
    //   this.spinnerService.hide();
    //   return false;
    // }
    // else if (this.formInput.Password != this.formInput.ConfirmPassword) {
    //   this.globalToastService.warning("Password and Confirm Password doesn't match");
    //   this.spinnerService.hide();
    //   return false;
    // }
    // else if (this.formInput.StateID == ""||this.formInput.StateID ==null||this.formInput.StateID ==undefined) {
    //   this.globalToastService.warning("Please Select State");
    //   return false;
    // }
    // else if (this.formInput.CityID == ""||this.formInput.CityID ==null || this.formInput.CityID==undefined) {
    //   this.globalToastService.warning("Please Select City");
    //   return false;
    // }
    //   else
    //   {
    //     const digitCount: number = this.formInput.MobileNumber.toString().length;
    //     if(digitCount<10)    {
    //       this.globalToastService.warning("Mobile number must have at least 10 digits");
    //       return false;
    //     }else{
    //       this.formInput.AlternateMobileNumber=this.formInput.MobileNumber;
    //       this.mail="Ok";
    //       if (this.formInput.Email != ""&&this.formInput.Email!=null &&this.formInput.Email!=undefined)
    //        {
    //          this.mail=this.validateEmail(this.formInput.Email);
    //        }
    //       if(this.mail!="Ok") 
    //       {this.globalToastService.warning("Please Enter Valid Email ID"); 
    //       return false; }
    //       else
    //      // {
    //   //       const emdigit: number = this.formInput.EmergencyNumber.toString().length;
    //   //       if(emdigit<10) 
    //   //          {
    //   //         this.globalToastService.warning("Gaurdian number must have at least 10 digits");
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
    this.ShowProfile = false;
    this.ShowLoan = false;
    this.ShowProof = false;
    this.ShowSalary = false;
    this.ShowBank = true;
    this.ShowProfession = false;
    this.ProfessionClass = "nav-link";
    this.ProfileClass = "nav-link";
    this.PrfClass = "nav-link";
    this.BankClass = "nav-link active";
    this.LoanClass = "nav-link";
    this.SalaryClass = "nav-link";
    //       return true;
    //     }
    //     else{
    //       this.globalToastService.warning(res.Message);
    //       return false;
    //     }
    //     }
    //     else{
    //       this.globalToastService.warning("Failed to validate Duplicate Email");
    //       return false;
    //     }
    //       }, (error) => {
    //         this.spinnerService.hide();
    //         this.globalToastService.error(error.message);
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
    //     this.globalToastService.warning(res.Message);
    //     return false;
    //   }
    //   return false;
    // }
    // else{
    //   this.globalToastService.warning("Failed to validate Duplicate MobileNumber");
    //   return false;
    // }
    //   }, (error) => {
    //     this.spinnerService.hide();
    //     this.globalToastService.error(error.message);
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
    //     this.globalToastService.warning("Please Enter Account Name");
    //     this.spinnerService.hide();
    //     return false;
    //   } 
    //  else if (this.formInput.AccountNumber == ""||this.formInput.AccountNumber==null ||this.formInput.AccountNumber==undefined) {
    //     this.globalToastService.warning("Please Enter Account Number");
    //     this.spinnerService.hide();
    //     return false;
    //   } 
    //   else if (this.formInput.Bank == ""||this.formInput.Bank==null ||this.formInput.Bank==undefined) {
    //     this.globalToastService.warning("Please Enter Bank Name");
    //     this.spinnerService.hide();
    //     return false;
    //   } 
    //   else if (this.formInput.IFSC == ""||this.formInput.IFSC==null ||this.formInput.IFSC==undefined) {
    //     this.globalToastService.warning("Please Enter Proof-I ID");
    //     this.spinnerService.hide();
    //     return false;
    //   } 
    //   else if (this.formInput.Branch == ""||this.formInput.Branch==null ||this.formInput.Branch==undefined) {
    //     this.globalToastService.warning("Please Enter Proof-I ID");
    //     this.spinnerService.hide();
    //     return false;
    //   } 
    //   else if (this.formInput.UPIID == ""||this.formInput.UPIID==null ||this.formInput.UPIID==undefined) {
    //     this.globalToastService.warning("Please Enter Proof-I ID");
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
    //   this.globalToastService.warning("InValid IFSC Code");
    //   return false;
    // }else
    // {

    //   var ValidateupiID=this.validateUPIID(this.formInput.UPIID)
    //   if(this.formInput.UPIID==null||this.formInput.UPIID==" "||this.formInput.UPIID==undefined)
    //   {
    //     ValidateupiID="Ok";
    //   }
    //   if(ValidateupiID!="Ok")    {
    //     this.globalToastService.warning("InValid Upi ID");
    //     return false;
    //   }else{
    this.ShowProfile = false;
    this.ShowLoan = false;
    this.ShowProof = true;
    this.ShowSalary = false;
    this.ShowBank = false; this.ProfileClass = "nav-link";
    this.PrfClass = "nav-link active";
    this.BankClass = "nav-link";
    this.LoanClass = "nav-link";
    this.SalaryClass = "nav-link";
    return true;
    //     }
    //   }
    // }
  }
  ValidateSalary() {

    //   if (this.formInput.IsPerday !=true &&this.formInput.IsPerday!=false) {
    //     this.globalToastService.warning("Please Select Salary Type");
    //     this.spinnerService.hide();
    //     return false;
    //   } 
    //  else if (this.formInput.GrossSalary == ""||this.formInput.GrossSalary==null ||this.formInput.GrossSalary==undefined) {
    //     this.globalToastService.warning("Please Enter Gross Salary");
    //     this.spinnerService.hide();
    //     return false;
    //   } 
    //  else if (this.formInput.BasicSalary == ""||this.formInput.BasicSalary==null ||this.formInput.BasicSalary==undefined) {
    //     this.globalToastService.warning("Please Enter Basic Salary");
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
    this.ShowProfile = false;
    this.ShowLoan = true;
    this.ShowProof = false;
    this.ShowSalary = false;
    this.ShowBank = false; this.ProfileClass = "nav-link";
    this.PrfClass = "nav-link";
    this.BankClass = "nav-link";
    this.LoanClass = "nav-link active";
    this.SalaryClass = "nav-link";
    return true;
    //  }
  }

  ValidateProof() {
    //   if (this.formInput.Proof1 == ""||this.formInput.Proof1==null ||this.formInput.Proof1==undefined) {
    //     this.globalToastService.warning("Please Select Proof-I");
    //     this.spinnerService.hide();
    //     return false;
    //   } 
    //  else if (this.formInput.ProofID1 == ""||this.formInput.ProofID1==null ||this.formInput.ProofID1==undefined) {
    //     this.globalToastService.warning("Please Enter Proof-I ID");
    //     this.spinnerService.hide();
    //     return false;
    //   } 
    //   else if (this.formInput.Proof1 == this.formInput.Proof2) {
    //     this.globalToastService.warning("Proof-I and Proof-II cannot be same");
    //     this.spinnerService.hide();
    //     return false;
    //   }
    //   else if (this.formInput.Proof2 == ""||this.formInput.Proof2==null ||this.formInput.Proof2==undefined) {
    //     this.globalToastService.warning("Please Select Proof-II");
    //     this.spinnerService.hide();
    //     return false;
    //   } ProofImage1
    //  else if (this.formInput.ProofID2 == ""||this.formInput.ProofID2==null ||this.formInput.ProofID2==undefined) {
    //     this.globalToastService.warning("Please Enter Proof-II ID");
    //     this.spinnerService.hide();
    //     return false;
    //   } 
    //   else if (this.formInput.ProofID2 == this.formInput.ProofID1) {
    //     this.globalToastService.warning("Proof-I and Proof-II Number cannot be same");
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
    this.ShowProfile = false;
    this.ShowLoan = false;
    this.ShowProof = false;
    this.ShowSalary = true;
    this.ShowBank = false; this.ProfileClass = "nav-link";
    this.PrfClass = "nav-link";
    this.BankClass = "nav-link";
    this.LoanClass = "nav-link";
    this.SalaryClass = "nav-link active";
    return true;
    //  }
  }

  LoanBack() {
    this.ShowProfile = false;
    this.ShowLoan = false;
    this.ShowProof = false;
    this.ShowSalary = true;
    this.ShowBank = false; this.ProfileClass = "nav-link";
    this.PrfClass = "nav-link";
    this.BankClass = "nav-link";
    this.LoanClass = "nav-link";
    this.SalaryClass = "nav-link active";
  }

  ProofBack() {
    this.ShowProfile = false;
    this.ShowLoan = false;
    this.ShowProof = false;
    this.ShowSalary = false;
    this.ShowBank = true; this.ProfileClass = "nav-link";
    this.PrfClass = "nav-link";
    this.BankClass = "nav-link active";
    this.LoanClass = "nav-link";
    this.SalaryClass = "nav-link ";
  }

  ProfessionBack() {
    this.ShowProfile = true;
    this.ShowLoan = false;
    this.ShowProof = false;
    this.ShowSalary = false;
    this.ShowBank = false; this.ProfileClass = "nav-link active";
    this.ShowProfession = false; this.ProfessionClass = "nav-link";
    this.PrfClass = "nav-link";
    this.BankClass = "nav-link ";
    this.LoanClass = "nav-link";
    this.SalaryClass = "nav-link ";
  }

  BankBack() {
    this.ShowProfile = false;
    this.ShowLoan = false;
    this.ShowProof = false;
    this.ShowSalary = false;
    this.ShowBank = false; this.ProfileClass = "nav-link";
    this.ShowProfession = true; this.ProfessionClass = "nav-link active";
    this.PrfClass = "nav-link";
    this.BankClass = "nav-link ";
    this.LoanClass = "nav-link";
    this.SalaryClass = "nav-link ";
  }

  SalaryBack() {
    this.ShowProfile = false;
    this.ShowLoan = false;
    this.ShowProof = true;
    this.ShowSalary = false;
    this.ShowBank = false; this.ProfileClass = "nav-link";
    this.PrfClass = "nav-link active";
    this.BankClass = "nav-link ";
    this.LoanClass = "nav-link";
    this.SalaryClass = "nav-link ";
  }

  CheckDateNew(date: any) {
    this.ApiURL = "Admin/CheckDate?UserDate=" + date;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(data => {
      if (data.Status != true) {
        this.spinnerService.hide();
        return true;
      }
      else {
        this.spinnerService.hide();
        // this.globalToastService.warning("Date should be greater than Current Date");
        this.ShowAlert("Date should be greater than Current Date", "warning")
        this.formInput.StartDate = '';
        return false;
      }

    }, (error: any) => {
      this.spinnerService.hide();
      return false;
    }
    );
  }

  getData1(List: any): void {
    let tmp = [];
    for (let i = 0; i < List.length; i++) {
      tmp.push({ id: List[i].id, text: List[i].text });
    }
    this.OriginalDepartmentList = tmp;
    this.DeptColumns = tmp;
  }
  ShareCred() {
    var tmp = [];
    for (this.index = 0; this.index < this.EmployeeList.length; this.index++) {
      if (this.EmployeeList[this.index].checked) {
        tmp.push({ "id": this.EmployeeList[this.index].ID })
      }

    }
    const json = {
      Employees: tmp,
      Type: 'Email'
    }
    this.spinnerService.show();
    this._commonservice.ApiUsingPost("Portal/ShareCredentials", json).subscribe((res: any) => {
      // this.globalToastService.success(res.message); 
      this.ShowAlert(res.message, "success")
      console.log(res.message);
      this.spinnerService.hide();
    }, (error) => {
      // this.globalToastService.error(error); 
      this.ShowAlert(error, "error")
      console.log(error);
      this.spinnerService.hide();
    });
  }
  onselectedBranchesDeSelectAll() {
    this.selectedBranches = [];
    this.chips = [];
    this.addChip(`From Date: ${moment(this.formInput.FromDate).format('MMMM Do YYYY')}`);
    this.addChip(`To Date: ${moment(this.formInput.ToDate).format('MMMM Do YYYY')}`);
    this.GetDepartments();
  }




  addChip(value: string) {
    const existingIndex = this.chips.findIndex(chip => chip.startsWith(value.split(':')[0]));
    if (existingIndex >= 0) {
      this.chips[existingIndex] = value;
    } else {
      this.chips.push(value);
    }
  }
  sendwhatsapp(ID:any){
    this._commonservice.ApiUsingGetWithOneParam("Account/ShareEmpCred?EmpID="+ID).subscribe(res=>{
  if(res.Status==true)
  {
this.ShowAlert(res.Message,"success");
  }
  else{
    this.ShowAlert(res.Message,"warning");
  }
    })
    }

  GetDepartments() {
    this.salaryConfigLoading.dept = true;
    this.DepartmentList=[];
    this.DeptColumns=[];
    let storedEmpdept = localStorage.getItem("EditEmployeeDepartment");
    let branchid = this.selectedBranch.map(res => res.Value)[0] || 0
    this.selectedDepartments = [];
    const json = {
      OrgID: this.OrgID,
    AdminId:this.UserID,
      Branches: [{ "id":branchid }]
    }
    this._commonservice.ApiUsingPost("Portal/GetEmployeeDepartments", json).subscribe((data) => {
      // console.log(data);
      this.DeptColumns = data.List;
      this.DepartmentList=data.List;
      if (storedEmpdept) {
        const selectedDept = this.DeptColumns.find(de => de.Text === storedEmpdept);
        if (selectedDept) {
          this.selectedDepartment = [selectedDept];
          // console.log('Selected dept Array:', this.selectedDepartment); // Debug log
          this.cdr.detectChanges();
          this.salaryConfigLoading.dept = false
          this.GetSalaryConfigs()
        }
        else {
          this.selectedDepartment = []
        }
      }
      this.salaryConfigLoading.dept = false
    }, (error) => {
      // this.globalToastService.error(error); 
      this.ShowAlert(error, "error")
      console.log(error);
      this.salaryConfigLoading.dept = false
    });
  }

  GetRegDepartments(BranchID: any) {
    if (BranchID == null || BranchID == 'undefined') { BranchID = 0; }
    this.ApiURL = "Portal/GetBranchWiseDepartments?BranchID=" + BranchID + "&OrgID=" + this.OrgID;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => {
      // console.log(data);
      if (data.DepartmentList.length > 0) {
        this.DepartmentList = data.List;
        this.getData1(data.DepartmentList);
      }
    }, (error) => {
      // this.globalToastService.error(error);
      this.ShowAlert(error, "error")
      console.log(error);
    });
  }
  onselectedOrg(item: any) {
    this.selectedBranchId = []
    this.selectedDepartmentId = []
    this.GetBranches()
  }
  onDeselectedOrg(item: any) {
    this.selectedBranchId = []
    this.selectedDepartmentId = []
    this.GetBranches()
  }

  GetOrganization() {
    this.ApiURL = "Admin/GetSuborgList?OrgID=" + this.OrgID + "&AdminId=" + this.AdminID
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => {
      this.OrgList = data.List
      if(data.List.length == 1){
        this.selectedOrganization = [{Value:this.OrgList[0].Value,Text:this.OrgList[0].Text}]
        this.onselectedOrg({Value:this.OrgList[0].Value,Text:this.OrgList[0].Text})
      }
    }, (error) => {
      this.ShowAlert(error, "error")
      console.log(error);
    });
  }
  GetBranches() {
    this.salaryConfigLoading.branch = true
    let storedEmpBranch = localStorage.getItem("EditEmployeeBranch")
    let suborgid = this.selectedOrganization.map(res => res.Value)[0] || 0
    this.ApiURL = "Admin/GetBranchListupdated?OrgID=" + this.OrgID + "&SubOrgID=" + suborgid + "&AdminId=" + this.AdminID
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => {
      // console.log(data);
      this.Columns = data.List
      // console.log(this.Columns,"colums data");
      if (storedEmpBranch) {
        const selectedBranch = this.Columns.find(emp => emp.Text === storedEmpBranch);
        // console.log('Selected Branch:', selectedBranch); // Debug log
        if (selectedBranch) {
          this.selectedBranch = [selectedBranch];
          // console.log('Selected Branch Array:', this.selectedBranch); // Debug log
          this.cdr.detectChanges();
          this.salaryConfigLoading.branch = false
          this.GetSalaryConfigs()
        }
        else {
          this.selectedBranch = []
        }
      }
    }, (error) => {
      // this.globalToastService.error(error); 
      this.ShowAlert(error, "error")
      console.log(error);
      this.salaryConfigLoading.branch = false
    });
  }
  onselectedTypeChangenew(event: any) {
    this.selectedListType = event; this.FilterType = [event]; this.selectedlisttype = event;
  }
  onDeselectedTypeChange(event: any) {
    this.selectedListType = 0; this.FilterType = ['All']; this.selectedlisttype = "All";
  }

  getData(List: any): void {
    let tmp = [];
    for (let i = 0; i < List.length; i++) {
      tmp.push({ id: List[i].Value, text: List[i].Text });
    }
    this.OriginalBranchList = tmp;
    this.Columns = tmp;
    this.GetDepartments();
  }

  @ViewChild('drawer') drawer: any;
  drawertoggle() {
    this.drawer.toggle();
    // console.log("opened");
  }
  closeDrawer() {
    this.drawer.close();

  }
  SendCredentails() {
    this.spinnerService.show();
    if (this.EmployeeDetails)
      this.ApiURL = "Admin/ShareCredentials?EmployeeID=" + this.EmployeeId;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(data => {
      if (data.Status == true) {
        // this.globalToastService.success(data.Message);
        this.ShowAlert(data.Message, "success")
        this.spinnerService.hide();
        window.location.reload();
      }
      else {
        // this.globalToastService.warning(data.Message);
        this.ShowAlert(data.Message, "warning")
        this.spinnerService.hide();
      }

    }, (error: any) => {
      // this.globalToastService.error(error.message);
      this.ShowAlert(error.message, "warning")
      this.spinnerService.hide();

    }
    );
  }
  onChange(): void {
    this.all_selected_values = this.EmployeeList.filter((item: any) => item !== true);

    if (this.all_selected_values.length > 0) {
      this.ShowShareButton = true;
    }
    else {
      this.ShowShareButton = false;
    }
  }

  //shift code
  OnCheckSelect(j: any, i: any, type: any) {
    if (type == "week") {
      if (this.DynamicArray[i].WeekOffDays[j].Value == true) { this.DynamicArray[i].WorkingDays[j].Value = false; } else { this.DynamicArray[i].WorkingDays[j].Value = true; }
    }
    else {
      if (this.DynamicArray[i].WorkingDays[j].Value == true) { this.DynamicArray[i].WeekOffDays[j].Value = false; } else { this.DynamicArray[i].WeekOffDays[j].Value = true; }
    }

  }
  changeyearselection() {
    if (this.IsWholeYear == true) {
      this.IsJan = true;
      this.IsFeb = true;
      this.IsMarch = true;
      this.IsApril = true;
      this.IsMay = true;
      this.IsJuly = true;
      this.IsJune = true;
      this.IsAug = true;
      this.IsSep = true;
      this.IsOct = true;
      this.IsNov = true;
      this.IsDec = true;
    }
    else {
      this.IsJan = false;
      this.IsFeb = false;
      this.IsMarch = false;
      this.IsApril = false;
      this.IsMay = false;
      this.IsJuly = false;
      this.IsJune = false;
      this.IsAug = false;
      this.IsSep = false;
      this.IsOct = false;
      this.IsNov = false;
      this.IsDec = false;
    }
  }

  exportexcel() {
    let columns = ['Name', 'Branch', 'Department', 'Role', 'Mobile', 'Email', 'DateOfJoining', 'CreatedDate']
    let fileName = 'EmployeeList.xlsx'
    let data = this.EmployeeList.map((item: any) => {
      const rowData: any[] = [];
      for (let column of columns) {
        if (column.toLowerCase().split('date').length > 1) {
          rowData.push(moment(item[column]).format('MMMM Do YYYY'));
        }
        else rowData.push(item[column]);
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
    let columns = ['Name', 'Branch', 'Department', 'Role', 'Mobile', 'Email', 'DateOfJoining', 'CreatedDate']
    const header = ''
    const title = 'Employee Muster'
    let data = this.EmployeeList.map((item: any) => {
      const rowData: any[] = [];
      for (let column of columns) {
        if (column.toLowerCase().split('date').length > 1) {
          rowData.push(moment(item[column]).format('MMMM Do YYYY'));
        }
        else rowData.push(item[column]);
      }
      return rowData;
    });
    console.log(data, "data");

    this.pdfExportService.generatePDF(header, title, columns, data);
  }
  //

  newonselectedBranchesDeSelectAll() {
    this.selectedbranchid = 0; this.GetRegDepartments(0);
    this.SalarySettingList = undefined
    this.SalaryFormulae = undefined
  }
  newonselectedBranchesSelectAll(event: any) {
    this.selectedbranchid = 0; this.GetRegDepartments(0);
    this.GetSalaryConfigs(true);
  }

  newonDeselectedBranchesChange(event: any) {
    // this.selectedbranchid=0;this.GetRegDepartments(0);
    this.formInput.BranchID = event.Value
    this.GetDepartments()
    this.SalarySettingList = undefined
    this.SalaryFormulae = undefined
  }
  newonselectedBranchesChange(event: any) {
    this.formInput.BranchID = event.Value
    this.GetDepartments()
    this.GetSalaryConfigs(true);
    // this.selectedbranchid=event.Value;
    // this.formInput.BranchId=event.Value;
    // this.GetRegDepartments(this.selectedbranchid);
  }
  newonselectedDepartmentDeSelectAll() {

    this.GetDepartments()

    this.SalarySettingList = undefined
    this.SalaryFormulae = undefined
    // this.selectedDepartmentid=0;
    // this.formInput.BranchId=0;
  }
  newonselectedDepartmentSelectAll(event: any) {
    this.selectedDepartmentid = 0;
    this.GetSalaryConfigs(true);
  }

  newonDeselectedDepartmentChange(event: any) {
    // this.selectedDepartmentid=0;
    this.SalarySettingList = undefined
    this.SalaryFormulae = undefined
  }
  newonselectedDepartmentChange(event: any) {
    // this.selectedDepartmentid=event.id;
    this.GetSalaryConfigs(true);
  }

  onDeselectedDepartmentsChange(event: any) {
    this.selectedDepartmentId = 0;
  }
  onselectedDepartmentsChange(event: any) {
    this.selectedDepartmentId = event.id;
  }
  onDeselectedBranchesChange(event: any) { this.selectedBranchId = 0; this.GetRegDepartments(0); }
  onselectedBranchesChange(event: any) {
    this.selectedBranchId = event.id;
    this.GetRegDepartments(this.selectedBranchId);
  }
  onselectedDepartmentsDeSelectAll() { this.selectedDepartmentId = 0; }
  onselectedBranchesSelectAll() { this.selectedBranchId = 0; this.GetRegDepartments(0); }

  openDialog(Array: any): void {

    this.dialog.open(ShowcredComponent, {
      data: { Array: Array }
      , panelClass: 'custom-dialog',
      disableClose: true
    }).afterClosed().subscribe((res: any) => {
      // if (res) {
        this.GetEmployeeList()
        this.spinnerService.hide();
        if(res !=null)
        {
          this.ShowAlert(res.alert,res.type);
        }

      // }
    })
  }

  isPropertyVisible(property_name: string): Boolean {
    if (this.SalarySettingList == null || this.SalarySettingList == undefined) return true;
    let result = false;
    let salary_config_field = this.SalarySettingList[property_name];
    if (salary_config_field == null || salary_config_field == undefined) {
      result = false;
    } else {
      result = salary_config_field;


    }


    return result;

  }

  ShareWhatsapp() {
    this.tempcredarray = [];
 
    for (this.index = 0; this.index < this.EmployeeList.length; this.index++) {
      if (this.EmployeeList[this.index].isSelected==true) {
        this.tempcredarray.push({ "FirstName": this.EmployeeList[this.index].Name, "LastName": "", "Mobile": this.EmployeeList[this.index].Mobile, "EmployeeID": this.EmployeeList[this.index].ID, "Password": this.EmployeeList[this.index].Password, "Role": this.EmployeeList[this.index].Role })
      }

    }
    debugger;
    if(this.tempcredarray.length==0){
      this.ShowAlert('No Employee Selected,Select Atleast One Employee to Proceed','warning');
    }else{
        this.openDialog(this.tempcredarray);
    }
   
  }

  GetShiftList(BranchID: any) {
    const json: any = {
      "DepartmentID": [],
      "AdminId": this.AdminID,
      "BranchID": []
    }
    this._commonservice.ApiUsingPost("Portal/GetShiftbyBranch", json).subscribe((data) => {
      if (data.Status == true) {
        this.ShiftList = data.List;
      }

    },
      (error) => {
        // this.globalToastService.error(error);
        this.ShowAlert(error, "error")
        console.log(error);

      });
  }

  EmployeeSalaryConfig() {

  }

  //common table
  actionEmitter(data: any) {
    if (data.action.name == "View Edit") {
      this.showEdit(data.row);
    }
    if (data.action.name == "Share Credentials") {
    this.sendwhatsapp(data.row.ID);
    }
    if (data.action.name == "Deactivate") {
      this.DeleteEmployee(data.row.ID);
    }
    if (data.action.name == "Activate") {
      this.Active(data.row.ID);
    }
    if (data.action.name == "Shift Details") {
      this.GetEmpShiftStatus(data.row);
    }
    if (data.action.name == "Delete") {
      this.DeleteEmpPermanent(data.row);
    }
    if (data.action.name == "updatedSelectedRows") {
      // this.updatedSelectedRows(data)
    }

  }

  downloadReport() {
    let selectedColumns = this.displayedColumns
    this.commonTableChild.downloadReport(selectedColumns)
  }
  //ends here


  GetSalaryFieldStatus(field: string) {
    if (!this.SalarySettingList) {
      // console.log(field,true);
      return true;
    }
    let fieldStatus = this.SalarySettingList[field];
    // console.log(field,!fieldStatus);
    return !fieldStatus;
  }

  updateGrossSetting() {
    if (this.formInput.GrossSalary) {
      this.validateGross(this.formInput.GrossSalary)
      // this.globalToastService.info("Salary has been successfully calculated based on defined salary setting.")
      this.ShowAlert("Salary has been successfully calculated based on defined salary setting.", "success")
    }
  }

     validateCTC(event: any) {
    this.cdr.detectChanges()
    if(this.formInput.GrossSalary > 0){
    this.formInput.CTC= this.formInput.GrossSalary * 12;
    }
     }

    GetSalaryConfigs(dialog: boolean = false) {
        debugger;
    let Branch = this.selectedBranch.map((b: any) => b.Value)[0] || 0;
        let Dept = this.selectedDepartment.map((b: any) => b.Value)[0] || 0;
    if ((Branch == 0 && Dept == 0) || (this.salaryConfigLoading.branch == true || this.salaryConfigLoading.dept == true)) return;
    let json = {
      Employeelist: this.EmployeeId ? [this.EmployeeId] : [],
      BranchList: Branch != 0 ? [Branch] : [],
      DepartmentList: Dept != 0 ? [Dept] : [],
    };

    if (
      json.Employeelist.length == 0 &&
      json.BranchList.length == 0 &&
      json.DepartmentList.length == 0
    ) {
      // this.globalToastService.warning(
      //   "Please select a Branch or a Department or an Employee"
      // )
      this.ShowAlert("Please select a Branch or a Department or an Employee", "warning")

      return
    }
    // this.spinnerService.show();
    this._commonservice
      .ApiUsingPost("SalaryCalculation/getSalaryConfiguration/single", json)
      .subscribe(
        (data) => {
          this.SalarySettingList = data?.List[0]?.Configfields[0];
          console.log({ SalarySettingList: this.SalarySettingList });

          this._commonservice
            .ApiUsingPost("SalaryCalculation/GetSalaryCalculationConfig/single", json)
            .subscribe(
              (calData) => {
                console.log({ calData });
                this.SalaryFormulae = calData.List[0]?.ConfigFields
                // this.spinnerService.hide();
                if (dialog == true && ((this.SalaryFormulae && this.SalaryFormulae.length > 0) || (this.SalarySettingList && this.SalarySettingList.ID))) {
                  this.SalarySettingDialog()
                }
              },
              (error) => {
                // this.spinnerService.hide();
                // this.globalToastService.error(error.message);
                this.ShowAlert(error.message, "error")
              }
            );
        },
        (error) => {
          // this.spinnerService.hide();
          // this.globalToastService.error(error.message);
          this.ShowAlert(error.message, "error")
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
      // this.globalToastService.warning('You can only select up to 2 weekdays');
      this.ShowAlert("You can only select up to 2 weekdays", "warning")
    }
  }
  preventPlusMinus(event: KeyboardEvent): void {
    if (event.key === '+' || event.key === '-') {
      event.preventDefault();
    }
  }


  SalarySettingDialog() {
    // this.updateGrossSetting()
    console.log(this.SalarySettingList)
    this.spinnerService.hide();
    this.spinnerService.show();
    // setTimeout(() => {
    this.spinnerService.hide();
    this.dialog
      .open(CommonDialogComponent, {
        disableClose: true,
        data: {
          type: "option",
          title: "Salary setting found",
          subTitle:
            "Do you wish to calculate salary automatically based the found salary setting?",
          options: [
            {
              text: "Yes",
            },
            {
              text: "No",
            },
          ],
        },
      })
      .afterClosed()
      .subscribe((res: any) => {
        // if(res){
        this.spinnerService.show();
        console.log(res);
        if (res?.optionSelected?.text == "Yes") {
          this.updateGrossSetting();
        }

        // }
        this.spinnerService.hide();
      });
    // }, 1000);

  }

  ShowAlert(message: string, type: 'success' | 'warning' | 'error'): void {
    this.dialog.open(ShowalertComponent, {
      data: { message, type },
      panelClass: 'custom-dialog',
      disableClose: true
    }).afterClosed().subscribe((res) => {
      if (res) 
        {
        console.log("Dialog closed");
      }
    });
  }

  // closeDropdown(event: MouseEvent): void {
  //   const target = event.target as HTMLElement;
  //   const dropdown = target.closest('.dropdown-btn')?.nextElementSibling;

  //   if (dropdown && dropdown.classList.contains('dropdown-list')) {
  //     dropdown.classList.add('ng-hide');
  //   }

  //   // Prevent any additional actions or clicks
  //   event.stopPropagation();
  //   event.preventDefault();
  // }
  LeaveSetting(){
        this.dialog.open(LeavesettingsComponent, {
          data: { empid:this.EmployeeId , empname:this.formInput.FirstName }
        }).afterClosed().subscribe(res=>{
        })
  }

  validatePSA(event:any)
{
  const inputChar = String.fromCharCode(event.keyCode || event.charCode);
  if (!/^\d+$/.test(inputChar)) {
  this.ShowAlert("Please Enter Valid Input","warning")
  this.formInput.PSA.clear();
  }
}

  allowOnlyAlphanumeric(event: KeyboardEvent) {
    const key = event.key;
    if (/^[a-zA-Z0-9]$/.test(key) ||['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(key)) {
      return;
    }
    event.preventDefault();
  }
}
