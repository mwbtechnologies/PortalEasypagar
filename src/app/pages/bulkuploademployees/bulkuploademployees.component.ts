import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { PdfExportService } from 'src/app/services/pdf-export.service';
import * as XLSX from 'xlsx';
import { environment } from 'src/environments/environment.prod';
import { MatDialog } from '@angular/material/dialog';
import { ShowalertComponent } from '../create-employee/showalert/showalert.component';

@Component({
  selector: 'app-bulkuploademployees',
  templateUrl: './bulkuploademployees.component.html',
  styleUrls: ['./bulkuploademployees.component.css']
})
export class BulkuploademployeesComponent {

  BranchList: any[] = [];
  DepartmentList: any;
  branchSettings: IDropdownSettings = {}
  departmentSettings: IDropdownSettings = {}
  selectedDepartment: any[] = [];
  ApiURL:any
  selectedBranch: any[] = []
  temparray: any = []; tempdeparray: any = [];
  ORGId:any
  AdminID:any
  UserID:any
  weekoffList:any[]=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
  selectedWeekoff:any
  weekoffSettings:IDropdownSettings = {}
  dailyPayment:boolean = false
  columns:any[]=[]
showweekoff:boolean=true;
  selectedFile: File | null = null;
fileurl:any; 
selectedOrganization:any[]=[]
OrgList:any[]=[]
orgSettings:IDropdownSettings = {}
 constructor(private pdfExportService:PdfExportService,private spinnerService: NgxSpinnerService,private dialog:MatDialog,
  private _route: Router, private _commonservice: HttpCommonService, private globalToastService: ToastrService,
   private _httpClient: HttpClient) {
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
this.weekoffSettings = {
    limitSelection:2,
    singleSelection: false,
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
 }

 ngOnInit(){
   this.ORGId = localStorage.getItem('OrgID')
   this.AdminID = localStorage.getItem("AdminID");
   this.UserID=localStorage.getItem("UserID");
   this.GetOrganization();
   this.GetBranches()
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
          this.onselectedOrg({Value:this.OrgList[0].Value,Text:this.OrgList[0].Text})
        }
      }, (error) => {
        this.ShowAlert(error,"error")
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
        //  console.log(error);
      });
  
    }
  
    
    GetDepartments() {
      this.selectedDepartment=[];
      var loggedinuserid=localStorage.getItem("UserID");
      this.DepartmentList=[];
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
    onDeptSelect(item: any) {
      console.log(item, "item");
      this.tempdeparray.push({ id: item.Value, text: item.Text });
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
    }
    onBranchSelect(item: any) {
      console.log(item, "item");
      this.temparray.push({ id: item.Value, text: item.Text });
      this.selectedDepartment = []
      this.GetDepartments();
    }
    onBranchDeSelect(item: any) {
      console.log(item, "item");
      this.temparray.splice(this.temparray.indexOf(item), 1);
      this.selectedDepartment = []
      this.GetDepartments();
    }

    onweekoffSelect(item:any){

    }
    onweekoffDeSelect(item:any){

    }
    exportexcel(){
      this._commonservice.ApiUsingGetWithOneParam("Account/DownloadExcel").subscribe((res:any)=>{
      })
      window.open(environment.Url+'/api/Account/DownloadExcel','_blank')
    }
    // uploadexcel(){
    //   if(this.selectedBranch.length == 0){
    //     this.globalToastService.warning("Please Select Branch")
    //   }
    //   else if(this.selectedWeekoff.length < 2){
    //     this.globalToastService.warning("Please Select Two WeekOffs")
    //   }
      
    // }
    onFileChange(event: any): void {
      const file = event.target.files[0];
      if (file) {
        this.selectedFile = file;
      }
    }
    Update(val:any)
    {
if(val==false)
{
  this.selectedWeekoff=[];
}
if(this.showweekoff==true)
{
  this.showweekoff=false;
}
else
{
  this.showweekoff=true
}
    }

    uploadExcel(): void {
    
      if (!this.selectedFile) {
        // this.globalToastService.info('Please select a file first')
        this.ShowAlert("Please select a file first","warning")
        return;
      }
      else if (this.selectedBranch.length === 0){
        // this.globalToastService.warning('Please select a branch')
        this.ShowAlert("Please select a branch","warning")
      }
      // else if (this.selectedDepartment.length === 0){
      //   this.globalToastService.warning('Please select a department')
      // }
      // else if (!this.dailyPayment &&!this.selectedWeekoff){
      //   this.globalToastService.warning('Please select weekoff')
      
      // }
      else{
        if(!this.selectedWeekoff){this.selectedWeekoff=[];}
        var DeptID=0;
        if(this.selectedDepartment.length === 0){
          DeptID=this.selectedDepartment.map(sb=>sb.Value)[0];
        }
        const formData = new FormData();
        formData.append('file', this.selectedFile, this.selectedFile.name);    
        // Send the file to the API
        const apiUrl = 'Admin/UploadFile?ImageType=Bulk_Excel';
        this._commonservice.ApiUsingPostMultipart(apiUrl, formData).subscribe(
          (response) => {
            if(response.Status == true){
              const json = {
               AdminID :this.AdminID,
               Branchid :this.selectedBranch.map(sb=>sb.Value)[0],
               DeptID :DeptID,
               Isdailypayment :this.dailyPayment,
               IsMondayOff :this.selectedWeekoff[0] ==  'Monday' || this.selectedWeekoff[1] ==  'Monday' ? true : false,
               IsTuesdayOff :this.selectedWeekoff[0] ==  'Tuesday' || this.selectedWeekoff[1] ==  'Tuesday' ? true : false,
               IsWednesdayOff :this.selectedWeekoff[0] ==  'Wednesday' || this.selectedWeekoff[1] ==  'Wednesday' ? true : false,
               IsThursdayOff :this.selectedWeekoff[0] ==  'Thursday' || this.selectedWeekoff[1] ==  'Thursday' ? true : false,
               IsFridayOff :this.selectedWeekoff[0] ==  'Friday' || this.selectedWeekoff[1] ==  'Friday' ? true : false,
               IsSaturdayOff :this.selectedWeekoff[0] ==  'Saturday' || this.selectedWeekoff[1] ==  'Saturday' ? true : false,
               IsSundayOff :this.selectedWeekoff[0] ==  'Sunday' || this.selectedWeekoff[1] ==  'Sunday' ? true : false,
               FileURL :response.ImagePath
           }
              this._commonservice.ApiUsingPost('Account/EmployeeBulkExcelreader',json).subscribe(data =>{
                console.log(data);
                if(data.Status == true){
                  // this.globalToastService.success(data.Message)
                  this.ShowAlert(data.Message,"success")
                  window.open(data.Filepath,'_blank')
                }
                else if(data.Status == false){
                  // this.globalToastService.error(data.Message)
                  this.ShowAlert(data.Message,"error")
                }else{
                  // this.globalToastService.error("An Error Occurred")
                  this.ShowAlert("An Error Occurred","error")
                }
              },(error)=>{
                // this.globalToastService.error(error.error.message)
                this.ShowAlert(error.error.message,"error")
              })
              
            }else if(response.Status == false){
              // this.globalToastService.error(response.Message)
              this.ShowAlert(response.Message,"error")
            }else{
              // this.globalToastService.error("An Error Occurred")
              this.ShowAlert("An Error Occurred","error")
            }
          },
          (error) => {
            console.error('Error uploading file:', error);
          }
        );
      }
  
     
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
