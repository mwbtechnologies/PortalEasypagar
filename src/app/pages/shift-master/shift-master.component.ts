import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { Subject } from 'rxjs';
import { AddeditshiftComponent } from './addeditshift/addeditshift.component';
import { MatDialog } from '@angular/material/dialog';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import * as moment from 'moment';
import { PdfExportService } from 'src/app/services/pdf-export.service';
import * as XLSX from 'xlsx';
import { CommonTableComponent } from '../common-table/common-table.component';
import { ShowalertComponent } from '../create-employee/showalert/showalert.component';
export class FormInput {
  OrgID:any;
  ShiftName:any;
  FromTime:any;
  ToTime:any;
}


@Component({
  selector: 'app-shift-master',
  templateUrl: './shift-master.component.html',
  styleUrls: ['./shift-master.component.css']
})
export class ShiftMasterComponent implements OnInit{
  formInput: FormInput|any;
  public isSubmit: boolean;
  Editdetails: any;
  editid: any;
  Add = false;
  Edit = false;
  View = true;AdminID:any;OrgID:any;
  BranchList:any; DepartmentList:any;ApiURL:any;
  selectedBranchId:string[]|any;
   selectedDepartmentId:string[]|any;
   institutionsList:any;
   dtExportButtonOptions: any = {};
   dtOptions: DataTables.Settings = {};
   dtTrigger: Subject<any> = new Subject();
   file:File | any;ImageUrl:any;ShowImage=false;
   ViewPermission:any;AddPermission:any;EditPermission:any;DeletePermission:any;
   branchSettings:IDropdownSettings = {};UserID:any;
     //common table
  actionOptions:any
  displayColumns:any
  displayedColumns:any
  employeeLoading:any;
  editableColumns:any =[]
  topHeaders:any = []
  headerColors:any = []
  smallHeaders:any = []
  ReportTitles:any = {}
  selectedRows:any = []
  commonTableOptions :any = {}
  ShowBtn:boolean = false
  @ViewChild(CommonTableComponent) commonTableChild: CommonTableComponent|any;
  //ends here

  selectedOrganization:any[]=[]
  OrgList:any[]=[]
  orgSettings:IDropdownSettings = {}
  constructor(private _router: Router, private globalToastService: ToastrService, 
    private spinnerService: NgxSpinnerService,private _commonservice: HttpCommonService,
    public dialog: MatDialog,private toastr:ToastrService, private pdfExportService: PdfExportService) {
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
        name: "View Edit",
        icon: "fa fa-edit",
            filter: [
          { field:'IsActive',value : true}, { field:'IsDelete',value : true},
        ],
      },
    ];

    this.displayColumns= {
      // SelectAll: "SelectAll",
      "SLno":"SL No",
      "ShiftName":"SHIFT NAME",
      "BranchName":"BRANCH NAME",
      "DepartmentName":"DEPARTMENT NAME",
      "Ratio":"RATIO",
      "Amount":"AMOUNT",
      "GraceInTime":"GRACE-IN",
      "GraceOutTime":"GRACE-OUT",
      "Status":"STATUS",
      "ShiftStartTime":"START TIME",
      "ShiftEndTime":"END TIME",
      "CreatedDate":"CREATED DATE",
      "Actions":"ACTIONS"
    },


    this.displayedColumns= [
      "SLno",
      "ShiftName",
      "BranchName",
      "DepartmentName",
      "Ratio",
      "Amount",
      "GraceInTime",
      "GraceOutTime",
      "Status",
      "ShiftStartTime",
      "ShiftEndTime",
      "CreatedDate",
      "Actions"
    ]

    this.editableColumns = {
      // "HRA":{
      //   filters:{}
      // },
    }

    // this.topHeaders = [
      // {
      //   id:"blank1",
      //   name:"",
      //   colspan:5
      // },
    // ]

    this.headerColors ={
      // Deductions : {text:"#ff2d2d",bg:"#ffd5d5"},
    }
    //ends here
  }
  ngOnInit(): void {
    this.AdminID = localStorage.getItem("AdminID");
    this.UserID = localStorage.getItem("UserID");
    this.OrgID = localStorage.getItem("OrgID");
    if (this.AdminID==null||this.AdminID==""||this.OrgID==undefined||this.OrgID==null||this.OrgID==""||this.AdminID==undefined) {
      this._router.navigate(["auth/signin-v2"]);
    }
    this.formInput = {     
      OrgID:'',
      ShiftName:'',
      FromTime:'',
      ToTime:''
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
    this.GetShiftListNew(0);
    this.GetOrganization()
    this.GetBranches()
    
    this._commonservice.ApiUsingGetWithOneParam("Admin/GetDepartmentList").subscribe((data) => this.DepartmentList = data.List, (error) => {
      // this.globalToastService.error(error);
      this.ShowAlert(error,"error")
       console.log(error);
    });

    this.ViewPermission=localStorage.getItem("ViewPermission");  if(this.ViewPermission=="true"){this.ViewPermission=true;}else{this.ViewPermission=false;}
    this.AddPermission=localStorage.getItem("AddPermission"); if(this.AddPermission=="true"){this.AddPermission=true;} else{this.AddPermission=false;}
    this.EditPermission=localStorage.getItem("EditPermission");  if(this.EditPermission=="true"){this.EditPermission=true;}else{this.EditPermission=false;}
   this.DeletePermission=localStorage.getItem("DeletePermission");  if(this.DeletePermission=="true"){this.DeletePermission=true;}else{this.DeletePermission=false;}
   
  }
  
  Viewlist()
  {
  window.location.reload();
  }
  onselectedOrg(item:any){
    this.selectedBranchId = []
    this.GetBranches()
  }
  onDeselectedOrg(item:any){
    this.selectedBranchId = []
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
       console.log(error);
    });
  }
  GetBranches(){
    let suborgid = this.selectedOrganization.map(res => res.Value)[0] || 0
    this.ApiURL = "Admin/GetBranchListupdated?OrgID="+this.OrgID+"&SubOrgID="+suborgid+"&AdminId="+this.AdminID
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => this.BranchList = data.List, (error) => {
     //  this.globalToastService.error(error); 
     this.ShowAlert(error,"error")
      console.log(error);
    });
  }
 

  GetShiftList(BranchID:any) {
    this.spinnerService.show();
    this.employeeLoading = true
    this.ApiURL="ShiftMaster/GetAllShiftList?AdminID="+this.AdminID+"&BranchID="+BranchID
    console.log(this.ApiURL,"Apiurl");
    
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((sec) => {
      if(sec.Status==true){
        var table = $('#DataTables_Table_0').DataTable();
        table.destroy();
        this.institutionsList = sec.List.map((data:any,i:any)=>{
          const toggledItem = {...data,
            "Status":data.IsActive,
            "SLno": i + 1, ...data,
          "Ratio":data.Ratio+"X",
          "RatioValue":data.Ratio
      };  
      return toggledItem;
    })
    this.ShowBtn = true
        console.log(this.institutionsList,"listing");
        
        this.dtTrigger.next(null);
        this.Edit = false;this.Add = false;
      }
      this.spinnerService.hide();
       this.employeeLoading = false
    }, (error) => {
      this.spinnerService.hide();
       this.employeeLoading = false
      
    });
    this.employeeLoading = false
    this.spinnerService.hide();
  }
  GetShiftListNew(BranchID:any) {
    this.spinnerService.show();
    this.employeeLoading = true
    this.ApiURL="ShiftMaster/GetAllShiftList?AdminID="+this.AdminID+"&BranchID="+BranchID;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((sec) => {
      if(sec.Status==true)
      {
        this.institutionsList = sec.List.map((data:any,i:any)=>{
          const toggledItem = {...data,
          "Status":data.IsActive,
          "SLno": i + 1, ...data,
          "Ratio":data.Ratio+"X",
          "RatioValue":data.Ratio+"X"
      };  
      return toggledItem;
    })
    this.ShowBtn = true
        this.dtTrigger.next(null);
        this.Edit = false;this.Add = false;
      }
      this.spinnerService.hide();
      this.employeeLoading = false
    }, (error) => {
      this.spinnerService.hide();
      this.employeeLoading = false
      
    });
    this.spinnerService.hide();
    this.employeeLoading = false
  }

  OnBranchSelect(event:any){
    this.GetShiftList(event.Value);
  }
  onBranchDeSelect(event:any){
    this.GetShiftList(0);
  }
    
    OnDeptChange(event:any)
    {
      if(event!=undefined&&event!=null)
      {
        this.selectedDepartmentId=event.Value;
      }
    }
    OnBranchChange(event:any)
    {
      if(event!=undefined&&event!=null)
      {
        this.selectedBranchId=event.Value;
      }
    }
    
    AddNewModule(isEdit:boolean,row?:any){
      this.dialog.open(AddeditshiftComponent,{
        data: { isEdit, row, fulldata: this.institutionsList }
         ,panelClass: 'custom-dialog',
        disableClose: true }).afterClosed().subscribe((res:any)=>{
        // if(res){
          this.GetShiftList(0)
        // }
      })
    }

     activateDeactivateStatus(row:any){
      this._commonservice.ApiUsingGetWithOneParam("ShiftMaster/UpdateShiftStatus?Id="+row.ShiftID).subscribe((data:any)=> {
       this.toastr.success(data.Message);
       this.GetShiftList(0)
     },(error)=>{
       // this.toastr.error(error.message);
     })
   }


   exportexcel() {
    let columns = ['ShiftName', 'BranchName', 'DepartmentName','Ratio','Amount','GraceInTime','GraceOutTime','StartTime', 'EndTime', 'CreatedDate']
    let fileName = 'ShiftMaster.xlsx'
  let data = this.institutionsList.map((item: any) => {
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
    let columns = ['ShiftName', 'BranchName', 'DepartmentName','Ratio','Amount','GraceInTime','GraceOutTime', 'StartTime', 'EndTime', 'CreatedDate']
    const header = ''
    const title = 'ShiftMaster'
    let data = this.institutionsList.map((item: any) => {
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
       //common table
 actionEmitter(data:any){
  if(data.action.name == "View Edit"){
    this.AddNewModule(true,data.row);
  }
  
}
downloadReport(){
  let selectedColumns = this.displayedColumns
  this.commonTableChild.downloadReport(selectedColumns)
}

//ends here
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
