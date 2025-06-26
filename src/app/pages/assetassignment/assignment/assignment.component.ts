import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AssetService } from 'src/app/services/assets.service';
import { DirectoryService } from 'src/app/services/directory.service';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { PdfExportService } from 'src/app/services/pdf-export.service';

@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.css']
})
export class AssignmentComponent {
 step_number : number;
  EmployeeList: any[]=[];
  BranchList: any[] = []; UserID: any
  DepartmentList: any;
  branchSettings: IDropdownSettings = {}
  departmentSettings: IDropdownSettings = {}
  employeeSettings: IDropdownSettings = {}
  documentSettings: IDropdownSettings = {}
  temparray: any = []; tempdeparray: any = [];
  selectedDepartment: any[] = [];
  selectedEmployees: any[] = []
  selectedBranch: any[] = []
  selectedDocuments: any[] = []
  AdminID:any
  ApiURL:any
  ORGId:any
AssetsDetails:any[]=[]
AssetList:any[]=[]
AssetSettings:IDropdownSettings = {}

  constructor(private pdfExportService: PdfExportService, private spinnerService: NgxSpinnerService,
      private _route: Router, private assetService: AssetService, private _commonservice: HttpCommonService,
      private globalToastService: ToastrService, private _httpClient: HttpClient){
    this.step_number =1
    this.branchSettings = {
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
      enableCheckAll: false
    };
    this.departmentSettings = {
      singleSelection: true,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };

    this.addDetails()
  }
   ngOnInit() {
      this.ORGId = localStorage.getItem('OrgID')
      this.AdminID = localStorage.getItem("AdminID");
      this.UserID = localStorage.getItem("UserID");
      this.GetBranches()
      this.getEmployeeList()
      this.getAssets()
  
    }

    backToList(){
      this._route.navigate(['/AssAsset/Assignment'])
    }
    getAssets() {
      this.spinnerService.show()
    let json = {
      "SoftwareId": 8,
      "orgId":parseInt(this.ORGId),
      "createdBy":parseInt(this.AdminID)
    }
      this.assetService.PostMethod('assetMgnt/asset/get',json).subscribe((res:any)=>{
        this.AssetList = res.data
      },(error)=>{
        this.globalToastService.error(error.error.message)
        this.spinnerService.hide()
      })
  
    }
  
    GetBranches() {
      this._commonservice.ApiUsingGetWithOneParam("Admin/GetBranchList?OrgID=" + this.ORGId + "&AdminId=" + this.UserID).subscribe((data) => {
        this.BranchList = data.List;
        console.log(this.BranchList, "branchlist");
      }, (error) => {
        this.globalToastService.error(error); console.log(error);
      });
  
    }
  
    GetDepartments() {
      const json = {
        OrgID: this.ORGId,
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
        this.globalToastService.error(error); console.log(error);
      });
    }
  
  
    getEmployeeList() {
      let BranchID = this.selectedBranch?.map((y: any) => y.Value)[0] || 0;
      let deptID = this.selectedDepartment?.map((y: any) => y.Value)[0] || 0;
      this.ApiURL = `Admin/GetMyEmployees?AdminID=${this.AdminID}&BranchId=${BranchID}&DeptId=${deptID}&ListType=All`;
          this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(response => {
            this.EmployeeList = response.List
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
    OnEmployeesChange(_event: any) {
      console.log(_event, "emp details");
  
    }
    OnEmployeesChangeDeSelect(event: any) {
    }
  setStepNumber(snum:number){
    this.step_number=snum
  }
  nextStep(){
    this.step_number= this.step_number+1
  }

  backStep(){
    this.step_number= this.step_number-1
  }

  addDetails(): void {
    this.AssetsDetails.push({
    Asset:'',
    MeasurementType:'',
    SerialNumber:''
   });
   }
   removeDetails(index: number): void {
     this.AssetsDetails.splice(index, 1);
   }
}


