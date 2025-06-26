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

export class FormInput {
  IsHalfday:any;
  StartDate:any;
  EndDate:any;
  Title:any;
  Description:any;
}


@Component({
  selector: 'app-holiday-list',
  templateUrl: './holiday-list.component.html',
  styleUrls: ['./holiday-list.component.css']
})
export class HolidayListComponent implements OnInit{
  formInput: FormInput|any;
  public isSubmit: boolean;
  Editdetails: any;
  editid: any;
  Edit = false;
    BranchSettings: IDropdownSettings = {};
  View = true;AdminID:any;OrgID:any;
  Holiday:any; ApiURL:any;
   institutionsList:any;
   dtExportButtonOptions: any = {};
   dtOptions: DataTables.Settings = {};
   dtTrigger: Subject<any> = new Subject();
   AddPermission:any;EditPermission:any;ViewPermission:any;DeletePermission:any;   
   Columns: any[] = [];
   selectedBranch: any[] = [];
  selectedbranchid: any;
  selectedOrganization:any[]=[]
  OrgList:any[]=[]
  orgSettings:IDropdownSettings = {}
  UserID:any;
  constructor(private _router: Router, private globalToastService: ToastrService,
     private spinnerService: NgxSpinnerService,private _commonservice: HttpCommonService,private pdfExportService : PdfExportService) {
    this.isSubmit = false;
    this.BranchSettings = {
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
  }
  ngOnInit(): void {
      this.AdminID = localStorage.getItem("AdminID");
      this.OrgID = localStorage.getItem("OrgID");
      this.UserID = localStorage.getItem("UserID");
    this.formInput = {     
      IsHalfday:false,
      StartDate:'',
      EndDate:'',
      Title:'',
      Description:''
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
    this.GetOrganization();
    this.GetBranches();
    this.GetHolidayList();
    this.AddPermission=localStorage.getItem("AddPermission"); if(this.AddPermission=="true"){this.AddPermission=true;} else{this.AddPermission=false;}
    this.EditPermission=localStorage.getItem("EditPermission");  if(this.EditPermission=="true"){this.EditPermission=true;}else{this.EditPermission=false;}
    this.ViewPermission=localStorage.getItem("ViewPermission");  if(this.ViewPermission=="true"){this.ViewPermission=true;}else{this.ViewPermission=false;}
    this.DeletePermission=localStorage.getItem("DeletePermission");  if(this.DeletePermission=="true"){this.DeletePermission=true;}else{this.DeletePermission=false;}
   
  }
  
  Viewlist()
  {
  window.location.reload();
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
       console.log(error);
    });
  }
  GetBranches() {
    let suborgid = this.selectedOrganization.map(res => res.Value)[0] || 0
    this.ApiURL = "Admin/GetBranchListupdated?OrgID="+this.OrgID+"&SubOrgID="+suborgid+"&AdminId="+this.AdminID
    this._commonservice
      .ApiUsingGetWithOneParam(
       this.ApiURL)
      .subscribe(
        (data) => {
          this.Columns = data.List;
        },
        (error) => {
}
      );
  }
  GetHolidayList() {
    this.spinnerService.show();
    // this.ApiURL="ShiftMaster/GetAllShiftList"?AdminID="+this.AdminID+"&BranchID="+BranchID;
    this.ApiURL="Portal/GetHolidays?OrgID="+this.OrgID;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((sec) => {
      if(sec.Status==true)
      {
        this.institutionsList = sec.Holidays;
        this.dtTrigger.next(null);
        this.Edit = false;
      }
      this.spinnerService.hide();
    }, (error) => {
      this.spinnerService.hide();
      
    });
  }
  newonDeselectedBranchesChange(event: any) {
    this.selectedbranchid = 0;
  }
  newonselectedBranchesChange(event: any) {
    this.selectedbranchid=event.Value;
  }

    Update() {
      if(this.selectedBranch.length==0)
        {
          this.globalToastService.warning("Please Select Branch...!");
          return false;
        } 
    else if (this.formInput.StartDate == ""||this.formInput.StartDate ==undefined) {
        this.globalToastService.warning("Please Select StartDate...!");
        return false;
      }
      else  if (this.formInput.EndDate == ""||this.formInput.EndDate ==undefined) {
        this.globalToastService.warning("Please Select EndDate...!");
        return false;
      }
      else  if (this.formInput.Title == ""||this.formInput.Title ==undefined) {
        this.globalToastService.warning("Please Enter Title...!");
        return false;
      }
      else  if (this.formInput.Description == ""||this.formInput.Description ==undefined) {
        this.globalToastService.warning("Please Enter Description...!");
        return false;
      }
      else{
        const json={
          AdminID:this.AdminID, 
          Comment:this.formInput.Description,
          ModifiedBy:this.AdminID,
          StartDate:this.formInput.StartDate,
          EndDate:this.formInput.EndDate,
          IsHalfday:this.formInput.IsHalfday,
          OrgID:this.OrgID,
          Title:this.formInput.Title,
          HolidayID:this.editid,
          BranchID:this.selectedbranchid       }
        this._commonservice.ApiUsingPost("Portal/UpdateHoliday",json).subscribe(
    
          (data: any) => {
            if(data.Status==true){
            this.spinnerService.hide();
            this.Edit = false;
            this.View = true;
            this.globalToastService.success(data.Message);
              window.location.reload();
            }
            else
            {
              this.globalToastService.warning(data.Message);
                this.spinnerService.hide();
            }
            
          }, (error: any) => {
            localStorage.clear();
    
            this.globalToastService.error(error.message);
            this.spinnerService.hide();
           }
        );
        return true;
      }
        
    }


       edit(IL: any): any {
     this.spinnerService.show();
          this.Editdetails = IL;
          this.spinnerService.hide();
          this.editid=IL.HolidayID;   
          this.formInput.IsHalfday = this.Editdetails.IsHalfday;
          this.formInput.StartDate = this.Editdetails.StartDate;
          this.formInput.EndDate = this.Editdetails.EndDate;
          this.formInput.Title = this.Editdetails.Title;
          this.formInput.Description = this.Editdetails.Comment;
          this.View= false;
          this.Edit=true;
          this.spinnerService.hide();  
        } 
  
     DeactiveModule(ID: number): any {
      this.spinnerService.show();
       this.ApiURL="Portal/DeleteHoliday?HolidayID="+ID;
       this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(data => {
        if(data.Status==true)
        {
          this.spinnerService.hide();
          this.globalToastService.success(data.Message);
            window.location.reload();
        }
        else{
          this.globalToastService.warning(data.Message);
          this.spinnerService.hide(); 
        }        
        }, (error) => {
          this.globalToastService.error(error);
         this.spinnerService.hide();
       })  
     }  

     exportexcel(){
      let columns = ['Title','Comment','StartDate','EndDate','CreatedDate']
  let fileName = 'HolidayList.xlsx'
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
  let columns = ['Title','Comment','StartDate','EndDate','CreatedDate']
  const header = ''
  const title = 'Holiday Master'
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
  }
