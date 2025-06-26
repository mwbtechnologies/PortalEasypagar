import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
declare const GetInfo: any;
import { Subject } from 'rxjs';
import * as moment from 'moment';
import { PdfExportService } from 'src/app/services/pdf-export.service';
import * as XLSX from 'xlsx';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { MatDialog } from '@angular/material/dialog';
import { ShowpopupComponent } from './showpopup/showpopup.component';
import { CommonTableComponent } from '../common-table/common-table.component';
import { ShowalertComponent } from '../create-employee/showalert/showalert.component';
export class FormInput {
  DepartmentName:any;
}

@Component({
  selector: 'app-department-master',
  templateUrl: './department-master.component.html',
  styleUrls: ['./department-master.component.css']
})
export class DepartmentMasterComponent implements OnInit{
  formInput: FormInput|any;
  public isSubmit: boolean;
  Editdetails: any;
  editid: any;
  Add = true;
  Edit = false;
  View = true;AdminID:any;OrgID:any;
  BranchList:any; DepartmentList:any;ApiURL:any;
   institutionsList:any;
   dtExportButtonOptions: any = {};
   dtOptions: DataTables.Settings = {};
   dtTrigger: Subject<any> = new Subject();
   file:File | any;ImageUrl:any;ShowImage=false;fileInput:any;
   AddPermission:any;EditPermission:any;ViewPermission:any;DeletePermission:any;   
   selectedBranches: any = [];
  Columns: any;BranchID:any;
  temparray: any=[];branchSettings:IDropdownSettings | any;selectedBranch:any;
  index: any;
  showadd:boolean = false
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
  commonTableOptions :any = {};UserID:any
  @ViewChild(CommonTableComponent) commonTableChild: CommonTableComponent|any;
  //ends here
  ShowBtn:boolean = false
  selectedOrganization:any[]=[]
  OrgList:any[]=[]
  orgSettings:IDropdownSettings = {}
   
  constructor(public dialog: MatDialog,private _router: Router, private globalToastService: ToastrService, private spinnerService: NgxSpinnerService,private _commonservice: HttpCommonService,private pdfExportService:PdfExportService) {
    this.isSubmit = false;
    
    this.branchSettings = {
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

     //common table
     this.actionOptions = [
      {
        name: "View Edit",
        icon: "fa fa-edit",
        filter: [
          { field:'Status',value : true}
        ],
      },
      {
        name: "Delete",
        icon: "fa fa-trash",
      }
    ];

    this.displayColumns= {
      // SelectAll: "SelectAll",
      "SLno":"SL No",
      "Department":"DEPARTMENT",
      "BranchName":"BRANCH NAME",
      "Status":"STATUS",
      "Actions":"ACTIONS"
    },


    this.displayedColumns= [
      "SLno",
      "Department",
      "BranchName",
      "Status",
      "Actions"
    ]

    this.editableColumns = {
    }
    this.headerColors ={}
  }
  ngOnInit(): void {
    this.BranchID=0;
    this.AdminID = localStorage.getItem("AdminID");
    this.OrgID = localStorage.getItem("OrgID");
    this.UserID = localStorage.getItem("UserID");
    if (this.AdminID==null||this.AdminID==""||this.OrgID==undefined||this.OrgID==null||this.OrgID==""||this.AdminID==undefined) {
      this._router.navigate(["auth/signin-v2"]);
    }
    this.formInput = {     
      DepartmentName:''
    };
    this.dtOptions = {
      pagingType: 'full_numbers',
       pageLength: 10 
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
    this.formInput.OrgID=this.OrgID;
    this.GetDepartmentList();
    this.GetOrganization();
    this.GetBranches();
    
this.AddPermission=localStorage.getItem("AddPermission"); if(this.AddPermission=="true"){this.AddPermission=true;} else{this.AddPermission=false;}
this.EditPermission=localStorage.getItem("EditPermission");  if(this.EditPermission=="true"){this.EditPermission=true;}else{this.EditPermission=false;}
this.ViewPermission=localStorage.getItem("ViewPermission");  if(this.ViewPermission=="true"){this.ViewPermission=true;}else{this.ViewPermission=false;}
this.DeletePermission=localStorage.getItem("DeletePermission");  if(this.DeletePermission=="true"){this.DeletePermission=true;}else{this.DeletePermission=false;}

  }
  isValidKey(event:any) {
    const key = event.key;
    
    // Allow backspace, delete, arrow keys, and other control keys
    if (key === "Backspace" || key === "Delete" || key === "ArrowLeft" || key === "ArrowRight" || event.ctrlKey || event.metaKey) {
      return true;
    }
    
    // Validate input for letters and spaces only
    const regex = /^[a-zA-Z\s]$/;
    return regex.test(key);
  }
  Viewlist()
  {
  // window.location.reload();
  this.GetDepartmentList()
  }
  getData(): void {
    let tmp = [];
    // tmp.push({ id: 0, text: "All Branch" });
    for (let i = 0; i < this.Columns.length; i++) {
      tmp.push({ id: this.Columns[i].Value, text: this.Columns[i].Text });
    }
    this.Columns = tmp;
  }
  onselectedOrg(item:any){
    this.selectedBranch = []
    this.GetBranches()
  }
  onDeselectedOrg(item:any){
    this.selectedBranch = []
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
  GetBranches() {
    let suborgid = this.selectedOrganization.map(res => res.Value)[0] || 0
    this.ApiURL = "Admin/GetBranchListupdated?OrgID="+this.OrgID+"&SubOrgID="+suborgid+"&AdminId="+this.AdminID
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => {
      console.log(data);
      if (data.List.length > 0) {
        this.Columns = data.List;
        this.getData();

      }
    }, (error) => { console.log(error);
    });
  }
  
  onselectedBranchesDeSelectAll() {
    this.temparray=[];
  }
  onselectedBranchesSelectAll(event: any) {
    let tmp = [];
    for (let i = 0; i < this.Columns.length; i++) {
      tmp.push({ id: this.Columns[i].id, text: this.Columns[i].text });
    }
    this.temparray=tmp;
  }
  onselectedBranchesChange(item:any){
    console.log(item,"item");
    this.temparray.push({id:item.id, text:item.text });
   }
   onDeselectedBranchesChange(item:any){
    console.log(item,"item");
    this.temparray.splice(this.temparray.indexOf(item), 1);
   }
   create(){
    this.formInput.DepartmentName='';
    this.showadd = false
    this.Add = true
    this.Edit = false
    this.GetBranches()
   }

  GetDepartmentList() {
    this.spinnerService.show();
    this.employeeLoading= true
    // this.ApiURL="ShiftMaster/GetAllShiftList"?AdminID="+this.AdminID+"&BranchID="+BranchID;
    this.ApiURL="Portal/GetDepartment?OrgID="+this.OrgID+"&UserID="+this.UserID;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((sec) => {
      var table = $('#DataTables_Table_0').DataTable();
      table.destroy();    
        // this.institutionsList = sec.DepartmentList.map((l: any, i: any) => { return { SLno: i + 1, ...l } });
        this.institutionsList = sec.DepartmentList.map((data:any,i:any)=>{
          const toggledItem = {...data,
          "Status":data.IsActive,
          "SLno": i + 1, ...data
      };
      return toggledItem;
    })
        this.ShowBtn = true
        this.dtTrigger.next(null);
        this.employeeLoading= false
        this.Edit = false;this.Add = true;
        
      this.spinnerService.hide();
    }, (error) => {
      this.spinnerService.hide();
      this.employeeLoading= false
      // 
    });
  }

  validateName(name: string) {
    const Pattern = /^[a-zA-Z][a-zA-Z0-9\s]*$/;

    if (!Pattern.test(name)) {
     return "Fail"
    } else {
      console.log('Valid');
      return "Ok"
    }
  }

  UploadProof1Image1(event:any,form: NgForm) {
    this.fileInput = document.getElementById('formFile');
    const target = event.target as HTMLInputElement;
    var img = (target.files as FileList)[0];
    if (img && img.type.startsWith('image/'))
    {
    this.file = (target.files as FileList)[0];
var reader = new FileReader();
reader.onload = (event: any) => {
this, this.ImageUrl = event.target.result;
}
reader.readAsDataURL(this.file);
this.ShowImage = true;
const fData: FormData = new FormData();
fData.append('formdata', JSON.stringify(form.value));
fData.append('FileType', "Image");
if (this.file != undefined) { fData.append('File', this.file, this.file.name);
this._commonservice.ApiUsingPost("Admin/FileUpload",fData).subscribe(data => { this.ImageUrl=data.URL;});}
}
else
{
  // this.globalToastService.warning("Please select valid image file");
  this.ShowAlert("Please select valid image file","warning");
  this.fileInput.value = '';
}
 
}

    Update() { 
      
     if (this.formInput.DepartmentName == ""||this.formInput.DepartmentName ==undefined) {
        // this.globalToastService.warning("Please Enter Department Name...!");
        this.ShowAlert("Please Enter Department Name...!","warning");
        return false;
      }
      else{
        const json={
          Department:this.formInput.DepartmentName, 
          OrgID:this.OrgID,
          ModifiedByID:this.AdminID,
          DepartmentID:this.editid,
          ImageURl:this.ImageUrl,
          BranchID:this.BranchID
                    }
        this._commonservice.ApiUsingPost("Portal/UpdateDepartment",json).subscribe(
    
          (data: any) => {
            if(data.Status==true){
            this.spinnerService.hide();
            this.Add = true;
            this.Edit = false;
            this.View = true;
            // this.globalToastService.success(data.Message);
            this.ShowAlert(data.Message,"success");
              this.GetDepartmentList()
            }
            else
            {
              this.globalToastService.warning(data.Message);
              this.ShowAlert(data.Message,"warning");
                this.spinnerService.hide();
            }
            
          }, (error: any) => {
            localStorage.clear();
    
            // this.globalToastService.error(error.message);
            this.ShowAlert(error.message,"error");
            this.spinnerService.hide();
           }
        );
        return true;
      }
        
    }


       edit(IL: any): any {
        window.scrollTo({ top: 0, behavior: 'smooth' })
          this.showadd = true
          this.spinnerService.show();
          this.Editdetails = IL;
          this.spinnerService.hide();
          this.editid=IL.DepartmentID;   
          this.formInput.DepartmentName = this.Editdetails.Department;
          this.selectedBranch= this.Editdetails.BranchName;
          this.BranchID=this.Editdetails.BranchID;
          this.View= true;
          this.Add=false;
          this.Edit=true;
          this.spinnerService.hide();  
        } 
    
    
  CreateDepartment() {
    let br = this.temparray.map((t:any)=> t.text)[0]
    let isDuplicate = this.institutionsList.some((institution: any) =>
      institution.BranchName === br && institution.Department === this.formInput.DepartmentName
    );
    if (this.formInput.DepartmentName == ""||this.formInput.DepartmentName ==undefined) {
      // this.globalToastService.warning("Please Enter Department Name...!");
      this.ShowAlert("Please Enter Department Name...!","warning");
      return false;
    }
    else if(this.temparray.length==0)
    {
      // this.globalToastService.warning("Please select atleast one branch");
      this.ShowAlert("Please select atleast one branch","warning");
      return false;
    }
    else if(isDuplicate){
      // this.globalToastService.warning("Department is already created.");
      this.ShowAlert("Department is already created.","warning");
      return
    }
    else{
      const json={
        "Department":this.formInput.DepartmentName, 
        "OrgID":this.OrgID,
    "CreatedByID":this.UserID,
    "ImageURl":this.ImageUrl,
    "Branches":this.temparray
  }
  if(this.temparray)
  {
    var tmp=[];
    for(this.index=0;this.index<this.temparray.length;this.index++)
    {
      tmp.push({id:this.temparray[this.index].id,text:this.temparray[this.index].text})
    }
    json.Branches=tmp;
  }
        this._commonservice.ApiUsingPost("Portal/CreateDepartment",json).subscribe(
    
          (data: any) => {
            if(data.Status==true){
            this.spinnerService.hide();
            this.Add = true;
            this.Edit = false;
            this.View = true;
            this.formInput.DepartmentName = ""
            this.temparray = [];
            // this.globalToastService.success(data.Message);
            this.ShowAlert(data.Message,"success");
            window.location.reload();
              // this.GetDepartmentList();
              this.spinnerService.hide();
            }
            else{
              // this.globalToastService.warning(data.Message);
              this.ShowAlert(data.Message,"warning");
                this.spinnerService.hide();
            }
            }, (error: any) => {
              // this.globalToastService.error(error.message);
              this.ShowAlert(error.message,"error");
              this.spinnerService.hide();
             }
          );
      return true;
        
    }
   }
    AddNewModule()
    {
      this.spinnerService.show();
      this.View=false;
      this.Add=true;
      this.Edit=false;
      this.spinnerService.hide();this.selectedBranch="";
    }

    ActDeactiveModule(row: any): any {
      this.spinnerService.show();
      if(row.IsActive == false){
        this.ApiURL="Portal/ActiveDepartment?DepartmentID="+row.DepartmentID;
      }else if(row.IsActive == true){
        this.ApiURL="Portal/DeleteDepartment?DepartmentID="+row.DepartmentID;
      }
       this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(data => {
        if(data.Status==true)
        {
          this.spinnerService.hide();
          // this.globalToastService.success(data.Message);
          this.ShowAlert(data.Message,"success");
            // window.location.reload();
            this.GetDepartmentList()
        }
        else{
          // this.globalToastService.warning(data.Message);
          this.ShowAlert(data.Message,"warning");
          this.spinnerService.hide(); 
        }        
        }, (error) => {
          // this.globalToastService.error(error);
          this.ShowAlert(error,"error");
         this.spinnerService.hide();
       })  
     }   
    //  DeactiveModule(ID: number): any {
    //   this.spinnerService.show();
    //    this.ApiURL="Portal/DeleteDepartment?DepartmentID="+ID;
    //    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(data => {
    //     if(data.Status==true)
    //     {
    //       this.spinnerService.hide();
    //       this.globalToastService.success(data.Message);
    //         // window.location.reload();
    //         this.GetDepartmentList()
    //     }
    //     else{
    //       this.globalToastService.warning(data.Message);
    //       this.spinnerService.hide(); 
    //     }        
    //     }, (error) => {
    //       this.globalToastService.error(error);
    //      this.spinnerService.hide();
    //    })  
    //  }  

     DeleteModule(ID: number): any {
      this.spinnerService.show();
       this.ApiURL="Portal/DeleteDepartment?DeptID="+ID;
       this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(data => {
        if(data.Status==true)
        {
          this.spinnerService.hide();
          // this.globalToastService.success(data.Message);
          this.ShowAlert(data.Message,"success");
            // window.location.reload();
            this.GetDepartmentList()
        }
        else{
          // this.globalToastService.warning(data.Message);
          this.ShowAlert(data.Message,"warning");
          this.spinnerService.hide(); 
        }        
        }, (error) => {
          // this.globalToastService.error(error);
          this.ShowAlert(error,"error");
         this.spinnerService.hide();
       })  
     } 

     exportexcel(){
      let columns = ['Department','CreatedBy','ModifiedBy']
      let fileName = 'DepartmentList.xlsx'
         let data = this.institutionsList.map((item:any) => {
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
      let columns = ['Department','CreatedBy','ModifiedBy']
      const header = ''
      const title = 'Department Master'
      let data = this.institutionsList.map((item:any) => {
        const rowData: any[] = [];
        for (let column of columns) {
          if (column.toLowerCase().split('date').length > 1) {
            rowData.push(moment(item[column]).format('MMMM Do YYYY'));
          }
          else rowData.push(item[column]);
        }
        return rowData;
      });
      console.log(data,"data");
      
      this.pdfExportService.generatePDF(header, title, columns, data);
    }

    openDialog(ID:any): void {

      this.dialog.open(ShowpopupComponent,{
        data: {ID:ID}
         ,panelClass: 'custom-dialog',
        disableClose: true }).afterClosed().subscribe((res:any)=>{
        // if(res){
             this.GetDepartmentList();
        // }
      })
    }
     //common table
 actionEmitter(data:any){
  if(data.action.name == "View Edit"){
    this.edit(data.row);
  }

  if(data.action.name == "Delete"){
      this.openDialog(data.row.DepartmentID);
    }
  
}
downloadReport(){
  let selectedColumns = this.displayedColumns
  this.commonTableChild.downloadReport(selectedColumns)
}

//ends here

backToDashboard()
{
  this._router.navigate(["appdashboard"]);
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
