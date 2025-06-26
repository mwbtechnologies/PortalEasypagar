import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { AddlunchtimingsComponent } from '../addlunchtimings/addlunchtimings.component';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { CommonTableComponent } from '../common-table/common-table.component';
import { NavigationExtras, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { PdfExportService } from 'src/app/services/pdf-export.service';
import { ViewdetailsComponent } from './files/viewdetails/viewdetails.component';
import { FilesComponent } from './files/files.component';
import { UploadedhistoryComponent } from './uploadedhistory/uploadedhistory.component';
import { ShowalertComponent } from '../create-employee/showalert/showalert.component';


@Component({
  selector: 'app-filesmaster',
  templateUrl: './filesmaster.component.html',
  styleUrls: ['./filesmaster.component.css']
})
export class FilesmasterComponent {
  ORGId: any
  AllLunchList: any[] = []
  EmployeeList: any;
  BranchList: any[] = []; UserID: any
  DepartmentList: any;
  branchSettings: IDropdownSettings = {}
  departmentSettings: IDropdownSettings = {}
  employeeSettings: IDropdownSettings = {}
  TypeSettings: IDropdownSettings = {}
  temparray: any = []; tempdeparray: any = [];
  TypeList:any[]=['Date Wise','Month Wise']
  selectedType:any
  selectedDepartment: any[] = [];
  selectedEmployees: any[] = []
  selectdate: any
  selectedBranch: any[] = []
  ApiURL: any;selectedFileType:any;
  AdminID: any
  YearList:any;MonthList:any;
  selectedyear:any[]=[]
  selectedMonth:any[]=[]
  detailedList:any[]=[]
  dtExportButtonOptions: any = {};
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  maxBreaks:number = 0;
  ShowDownload=false;
  breakHeaders: number[] = [];
//common table
actionOptions: any
displayColumns: any
displayedColumns: any
originalDisplayColumns: any
originalDisplayedColumns: any
employeeLoading: any;
editdata: any
editableColumns: any = []
topHeaders: any = []
headerColors: any = []
smallHeaders: any = []
ReportTitles: any = {}
selectedRows: any = []
commonTableOptions: any = {}
tableDataColors: any = {}
showReportWise: boolean = false;
UserSelection:any[]=[];
filetypeid:any;
  tmpselectedFileType:any ; FileSettings:IDropdownSettings = {}

  @ViewChild(CommonTableComponent) commonTableChild: CommonTableComponent | any;
  DisplayList :any=[]
  FileTypeList: any;
  Files: any;
  EmployeeID: any;
  EmployeeWiseFile:any[]=[]
  //ends here
  selectedOrganization:any[]=[]
  OrgList:any[]=[]
  orgSettings:IDropdownSettings = {}
  constructor(private pdfExportService:PdfExportService,private spinnerService: NgxSpinnerService,
    private _route: Router, private _commonservice: HttpCommonService, private globalToastService: ToastrService, private _httpClient: HttpClient, private dialog: MatDialog)
     {
    this.branchSettings = {
      singleSelection: true,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.employeeSettings = {
      singleSelection: false,
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
    this.FileSettings = {
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
    
    //ends here
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

   //common table
   this.actionOptions = [
    {
      name: "View",
      icon: "fa fa-edit",
      // rowClick: true,
    },
    {
      name: "Upload History",
      icon: "fa fa-eye",
      // rowClick: true,
    },

  ];

  this.originalDisplayColumns = {
    "SLno":"SL No",
    "Actions":"ACTIONS",
    "MappedEmpId":"EMPLOYEE ID",
    "EmployeeName":"EMPLOYEE",
    "Branch":"BRANCH",
    "Department":"DEPARTMENT",
  },


  this.originalDisplayedColumns= [
    // "SelectAll",
    "SLno",
    "Actions",
    "MappedEmpId",
    "EmployeeName",
    "Branch",
    "Department",
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
    //   colspan:2
    // }
  ]

  this.headerColors = {
    // Deductions : {text:"#ff2d2d",bg:"#ffd5d5"},
  }
  this.tableDataColors = {
    // "BreaksStrings": [
    //   { styleClass: "breakLine", filter: [{}] }
    // ]
  }
  //ends here
  }


  ngOnInit(){
this.ORGId = localStorage.getItem('OrgID')
this.AdminID = localStorage.getItem("AdminID");
this.UserID=localStorage.getItem("UserID");
this.GetOrganization();
this.GetBranches()
this.getEmployeeList()
this.GetFileTypes();
this.filetypeid=localStorage.getItem("FileType");
try{
  this.filetypeid=parseInt(this.filetypeid);
}catch(e){}
  }
 
  GetFileTypes() {
    this._commonservice.ApiUsingGetWithOneParam("Directory/GetFileTypes?AdminID="+this.AdminID).subscribe((data) => {
      this.FileTypeList = data.List;
        // Check if filetypeid is valid and FileTypeList exists
if (this.filetypeid > 0 && Array.isArray(this.FileTypeList)) {
  // Find the file type that matches the filetypeid
  const matchingFileType = this.FileTypeList.find(
      (fileType) => fileType.Value === this.filetypeid
  );

  // If a matching file type is found, set it as the selected value
  if (matchingFileType) {
      this.selectedFileType = [{
          "Value": matchingFileType.Value,
          "CreatedByID": null,
          "Text": matchingFileType.Text, 
          "createdbyname": null,
          "Key": null
      }];
      this.tmpselectedFileType=matchingFileType.Value
  } 
}
      console.log(this.FileTypeList, "FileTypeList");
    }, (error) => {
      // this.globalToastService.error(error);
      this.ShowAlert(error,"error")
       console.log(error);
    });

  }
  GetReport(){
    this.FileList()
  }
  FileList(){
 if(this.selectedEmployees.length==0){
        //  this.globalToastService.warning("Please select Employee");
        this.ShowAlert("Please select Employee","warning")
          
         this.spinnerService.hide();
       }
     else{
      if(this.tmpselectedFileType==" "||this.tmpselectedFileType==null||this.tmpselectedFileType==undefined||this.tmpselectedFileType==""){
       this.tmpselectedFileType=0;
      }

     var selectedEmployee =  this.selectedEmployees.map((br: any) => {
        return {
         "EmployeeID": br.Value, 
         };
        })
      const json = {
        "Employee":selectedEmployee,
           "FileTypeID":this.tmpselectedFileType
    }
   this._commonservice.ApiUsingPost("Directory/GetAllFiles",json).subscribe((res:any) => {
     if(res.Status==true)
     {
       this.spinnerService.hide();
     this.DisplayList=res.List;
     this.Files=res.filestypes;
     this.DisplayList = res.List.map((l: any, i: any) => { return { SLno: i + 1, ...l } })
         this.employeeLoading = false
         this.ShowDownload=true;
         this.updateDisplayColumns(res.filestypes)
     this.dtTrigger.next(null);
     }
     else{
       this.spinnerService.hide();
      //  this.globalToastService.warning(res.Message);
      this.ShowAlert(res.Message,"warning")
     }
     this.spinnerService.hide();
   }, (error) => {
     this.spinnerService.hide();
   });
     }

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
  this.ApiURL = "Admin/GetSuborgList?OrgID="+this.ORGId+"&AdminId="+this.UserID
  this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => {
    this.OrgList = data.List
    if(data.List.length == 1){
      this.selectedOrganization = [{Value:this.OrgList[0].Value,Text:this.OrgList[0].Text}]
    }
  }, (error) => {
     console.log(error);
  });
}
  GetBranches() {
    let suborgid = this.selectedOrganization.map(res => res.Value)[0] || 0
    this.ApiURL = "Admin/GetBranchListupdated?OrgID="+this.ORGId+"&SubOrgID="+suborgid+"&AdminId="+this.AdminID
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => {
      this.BranchList = data.List;
      console.log(this.BranchList, "branchlist");
    }, (error) => {
      // this.globalToastService.error(error); 
      this.ShowAlert(error,"error")
      console.log(error);
    });

  }

  GetDepartments() {
    this.selectedDepartment=[];
    var loggedinuserid=localStorage.getItem("UserID");
    const json = {
      OrgID:this.ORGId,
      AdminID:loggedinuserid,
      Branches: this.selectedBranch.map((br: any) => {
        return {
          "id": br.Value
        }
      })
    }
    this._commonservice.ApiUsingPost("Portal/GetEmployeeDepartments", json).subscribe((data) => {
      console.log(data);
      if (data.DepartmentList.length > 0) {
        this.DepartmentList = data.List;
        console.log(this.DepartmentList, "department list");
      }
    }, (error) => {
      // this.globalToastService.error(error); 
      this.ShowAlert(error,"error")
      console.log(error);
    });
  }

  getEmployeeList() {
    let BranchID = this.selectedBranch?.map((y: any) => y.Value)[0] || 0
    let deptID = this.selectedDepartment?.map((y: any) => y.Value)[0] || 0
    this.ApiURL = "Admin/GetEmployees?AdminID=" + this.AdminID + "&BranchID=" + BranchID + "&DeptId=" + deptID + "&Year=" + 0 + "&Month=" + 0 + "&Key=en";
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => this.EmployeeList = data.data, (error) => {
      console.log(error); this.spinnerService.hide();
    });
  }

  onDeptSelect(item: any) {
    console.log(item, "item");
    this.tempdeparray.push({ id: item.Value, text: item.Text });
    this.selectedEmployees = []
    this.getEmployeeList()
  }
  onDeptSelectAll(item: any) {
    console.log(item, "item");
    this.tempdeparray = item;
  }
  onDeptDeSelectAll() {
    this.tempdeparray = [];
  }
  onDeptDeSelect(item: any) {
    console.log(item, "item");
    this.tempdeparray.splice(this.tempdeparray.indexOf(item), 1);
    this.selectedEmployees = []
    this.getEmployeeList()
  }
  onBranchSelect(item: any) {
    console.log(item, "item");
    this.temparray.push({ id: item.Value, text: item.Text });
    this.selectedDepartment = []
    this.GetDepartments();
    this.selectedEmployees = []
    this.getEmployeeList()
  }
  onBranchDeSelect(item: any) {
    console.log(item, "item");
    this.temparray.splice(this.temparray.indexOf(item), 1);
    this.selectedDepartment = []
    this.GetDepartments();
    this.selectedEmployees = []
    this.getEmployeeList()
  }

  onFiletypeSelect(item:any){
    this.tmpselectedFileType=item.Value;
    console.log(this.tmpselectedFileType,"selected");
    localStorage.setItem("FileType", this.tmpselectedFileType);
    this.filetypeid=localStorage.getItem("FileType");
    try{
      this.filetypeid=parseInt(this.filetypeid);
    }catch(e){
      
    }
   }
   onFiletypeDeSelect(item:any){
    this.tmpselectedFileType="";
    console.log(this.tmpselectedFileType,"not selected");
   }
  OnEmployeesChange(_event: any) {
  }
  OnEmployeesChangeDeSelect(event: any) {
  }

  DeleteFile(ID: number): any {
      this.spinnerService.show();
      this._commonservice.ApiUsingGetWithOneParam("Directory/DeleteFile?RecordID="+ID+"&AdminID="+this.AdminID).subscribe(data => {
       if(data.Status==true)
       {
         this.spinnerService.hide();
        //  this.globalToastService.success(data.Message);
        this.ShowAlert(data.Message,"success")
         this.GetReport()
       }
       else{
        //  this.globalToastService.warning(data.Message);
        this.ShowAlert(data.Message,"warning")
         this.spinnerService.hide(); 
       }        
       }, (error) => {
        //  this.globalToastService.error(error);
        this.ShowAlert(error,"error")
        this.spinnerService.hide();
      }) 

  }  



  backToDashboard()
  {
    this._route.navigate(['/FileDirectory'])
  }


  updateDisplayColumns(headers:any){
    
    this.displayColumns = JSON.parse(JSON.stringify(this.originalDisplayColumns))
    this.displayedColumns = JSON.parse(JSON.stringify(this.originalDisplayedColumns))
    for (let i = 0; i < headers?.length; i++) {
      const header = headers[i];
      if(!this.displayColumns.hasOwnProperty(`${header.FileTypeID}`)) 
        this.displayColumns[`${header.FileTypeID}`] = header.Name
    }
    for(let i=0;i<this.DisplayList.length;i++){
      let tempBreaks : any = this.DisplayList[i]['FilesList']
      for(let j=0;j<tempBreaks.length;j++){
        this.DisplayList[i][`${tempBreaks[j].FileType}`] = tempBreaks[j].FilesCount
      }
    }

    this.displayedColumns.splice(this.displayedColumns.length - 1, 0,...headers.map((h:any)=>`${h.Name}`))

  }

  ViewDetailed(row:any){
    this.UserSelection = []
    this.showReportWise = true
    this.EmployeeID = row.EmployeeID;
    let sft = this.selectedFileType.map((sf:any) => sf.Value)[0]
    this.UserSelection.push({"EmployeeID":this.EmployeeID, "SelectedFileType":this.tmpselectedFileType})
    console.log(this.UserSelection,"whats coming here");
  }

  opendailog(EmployeeID:any, FileTypeID:any){
    this.dialog.open(FilesComponent,{
      data: { "EmployeeID":EmployeeID, "FileType":FileTypeID}
       ,panelClass: 'custom-dialog',
        disableClose: true }).afterClosed().subscribe((res:any)=>{
    })
  }
   //common table
   actionEmitter(data: any) {
    if(data.action.name == "View"){
        this.ViewDetailed(data.row)
    }
    if(data.action.name == "Upload History"){
        this.uploadHistory(data.row)
    }
  }
  downloadReport(){
    let selectedColumns = this.displayedColumns
    this.commonTableChild.downloadReport(selectedColumns)
   }
  //ends here

  uploadHistory(row:any){
      this.dialog.open(UploadedhistoryComponent,{
        data: { row ,filename:this.selectedFileType.map((res:any)=>res.Text)[0], filetypeid:this.tmpselectedFileType}
         ,panelClass: 'custom-dialog',
        disableClose: true }).afterClosed().subscribe((res:any)=>{
      })
  }

  backToList() {
    this.showReportWise = false
    this.GetBranches()
    this.GetDepartments()
    this.getEmployeeList()
    this.GetFileTypes()
    this.GetReport()
  }
              ShowAlert(message: string, type: 'success' | 'warning' | 'error'): void {
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
